"use server";

import * as z from "zod";
import {
  CekUndurDiriSchema,
  UndurDiriSchema,
} from "../schema/undur-diri-schema";
import {
  getIdPengambilanSimpanan,
  getTotalSimpananById,
} from "../data/simpanan";
import {
  calculatePelunasanPinjaman,
  calculateUndurDiri,
  generateAngsuranId,
  generatePelunasanPinjamanId,
  ICalculatePelunasanPinjaman,
  IDRToNumber,
  splitDataPengambilanSimpananUndurDiri,
  TCalculateUndurDiri,
} from "../helper";
import prisma from "../prisma";
import { revalidateTag } from "next/cache";
import {
  getIdAngsuran,
  getIdPelunasan,
  getMaxAngsuran,
  getMaxPinjamanById,
} from "../data/pinjaman";
import { TMaxPinjaman } from "@/types/pinjaman";
import { notifPengunduranAnggota } from "./notifikasi";

export const cekPinjamanUndurDiri = async (
  maxPinjaman: TMaxPinjaman | null,
) => {
  if (maxPinjaman !== null) {
    const pinjaman = await getMaxAngsuran(maxPinjaman.noPinjaman);
    if (pinjaman) {
      const isPass = calculatePelunasanPinjaman(pinjaman);
      return isPass;
    }
  }
  return null;
};

export const updatePinjamanUndurDiri = async (
  values: ICalculatePelunasanPinjaman,
) => {
  const updatePinjaman = await prisma.pinjaman.update({
    where: { noPinjaman: values.noPinjaman },
    data: {
      statusPinjaman: "COMPLETED",
    },
  });
  if (updatePinjaman) {
    const idAngsuran = await getIdAngsuran();
    const angsuran = await prisma.angsuranPinjaman.create({
      data: {
        noAngsuranPinjaman: generateAngsuranId(idAngsuran),
        pinjamanId: updatePinjaman.noPinjaman,
        angsuranPinjamanKe: values.angsuranKe + 1,
        angsuranPinjamanDari: values.angsuranDari,
        jumlahAngsuranPinjaman: values.jumlahPelunasan,
        statusAngsuranPinjaman: "COMPLETED",
      },
    });
    if (angsuran) {
      const idPelunasan = await getIdPelunasan();
      const pelunasan = await prisma.pelunasanPinjaman.create({
        data: {
          noPelunasanPinjaman: generatePelunasanPinjamanId(idPelunasan, "CASH"),
          pinjamanId: angsuran.pinjamanId,
          angsuranKePelunasanPinjaman: angsuran.angsuranPinjamanKe,
          sudahDibayarkan: values.sudahDibayarkan,
          buktiPelunasanPinjaman: "none",
          jenisPelunasanPinjaman: "CASH",
          jumlahPelunasanPinjaman: angsuran.jumlahAngsuranPinjaman,
          statusPelunasanPinjaman: "APPROVED",
        },
      });
      if (pelunasan) {
        return { ok: true, message: "Update pinjaman dan angsuran berhasil" };
      } else {
        return {
          ok: false,
          message:
            "Pengajuan Undur Diri Gagal Disetujui, create pelunasan gagal",
        };
      }
    } else {
      return {
        ok: false,
        message: "Pengajuan Undur Diri Gagal Disetujui, update angsuran gagal",
      };
    }
  } else {
    return {
      ok: false,
      message: "Pengajuan Undur Diri Gagal Disetujui, update pinjaman gagal",
    };
  }
};

export const cekUndurDiri = async (
  values: z.infer<typeof CekUndurDiriSchema>,
) => {
  try {
    const validateValues = CekUndurDiriSchema.safeParse(values);
    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!", value: null };
    }
    const [
      totalSimpananWajib,
      totalSimpananSukamana,
      totalSimpananLebaran,
      totalSimpananQurban,
      totalSimpananUbar,
      maxPinjamanJasa,
      maxPinjamanBarang,
    ] = await Promise.all([
      getTotalSimpananById(validateValues.data.anggotaId, "WAJIB"),
      getTotalSimpananById(validateValues.data.anggotaId, "MANASUKA"),
      getTotalSimpananById(validateValues.data.anggotaId, "LEBARAN"),
      getTotalSimpananById(validateValues.data.anggotaId, "QURBAN"),
      getTotalSimpananById(validateValues.data.anggotaId, "UBAR"),
      getMaxPinjamanById(validateValues.data.anggotaId, "JASA"),
      getMaxPinjamanById(validateValues.data.anggotaId, "BARANG"),
    ]);

    if (
      !totalSimpananWajib?.ok ||
      !totalSimpananSukamana?.ok ||
      !totalSimpananLebaran?.ok ||
      !totalSimpananQurban?.ok ||
      !totalSimpananUbar?.ok ||
      !maxPinjamanJasa.ok ||
      !maxPinjamanBarang.ok
    ) {
      return {
        ok: false,
        message:
          "Mohon maaf, proses cek undur diri Anda gagal karena koneksi kami sedang terganggu. Silahkan coba beberapa saat lagi",
        value: null,
      };
    }
    const [pinjamanJasa, pinjamanBarang] = await Promise.all([
      cekPinjamanUndurDiri(maxPinjamanJasa.value),
      cekPinjamanUndurDiri(maxPinjamanBarang.value),
    ]);

    const dataSimpanan: TCalculateUndurDiri = {
      anggotaId: validateValues.data.anggotaId,
      noUser: validateValues.data.noUser,
      keterangan: validateValues.data.keterangan,
      wajib: IDRToNumber(totalSimpananWajib.value),
      sukamana: IDRToNumber(totalSimpananSukamana.value),
      lebaran: IDRToNumber(totalSimpananLebaran.value),
      qurban: IDRToNumber(totalSimpananQurban.value),
      ubar: IDRToNumber(totalSimpananUbar.value),
      biaya: 25000,
      pinjamanJasa,
      pinjamanBarang,
    };

    const hasil = calculateUndurDiri(dataSimpanan);
    return {
      ok: hasil.isPass,
      message: hasil.isPass
        ? "Proses cek undur diri Anda telah berhasil dilakukan!"
        : "Mohon maaf, proses cek undur diri Anda gagal karena kewajiban belum dapat dilunasi.",
      value: hasil,
    };
  } catch (error) {
    return { ok: false, message: "Cek Undur Diri Gagal!", value: null };
  }
};

export const addUndurDiri = async (values: z.infer<typeof UndurDiriSchema>) => {
  try {
    const validateValues = UndurDiriSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }
    const [maxPinjamanJasa, maxPinjamanBarang] = await Promise.all([
      getMaxPinjamanById(validateValues.data.anggotaId, "JASA"),
      getMaxPinjamanById(validateValues.data.anggotaId, "BARANG"),
    ]);

    if (!maxPinjamanJasa.ok || !maxPinjamanBarang.ok) {
      return {
        ok: false,
        message:
          "Mohon maaf, proses cek undur diri Anda gagal karena koneksi kami sedang terganggu. Silahkan coba beberapa saat lagi",
      };
    }

    const [pinjamanJasa, pinjamanBarang] = await Promise.all([
      cekPinjamanUndurDiri(maxPinjamanJasa.value),
      cekPinjamanUndurDiri(maxPinjamanBarang.value),
    ]);

    const {
      anggotaId,
      noUser,
      keterangan,
      biayaPengunduranDiri,
      jenisUndurDiri,
      simpananWajibPengunduranDiri,
      simpananManasukaPengunduranDiri,
      simpananLebaranPengunduranDiri,
      simpananQurbanPengunduranDiri,
      simpananUbarPengunduranDiri,
      totalPengunduranDiri,
      totalDiterimaPengunduranDiri,
    } = validateValues.data;

    const undurDiri = await prisma.pengunduranDiri.create({
      data: {
        anggotaId,
        noUser,
        keterangan,
        jenisUndurDiri,
        biayaPengunduranDiri,
        simpananWajibPengunduranDiri,
        simpananManasukaPengunduranDiri,
        simpananLebaranPengunduranDiri,
        simpananQurbanPengunduranDiri,
        simpananUbarPengunduranDiri,
        totalPengunduranDiri,
        totalDiterimaPengunduranDiri,
      },
    });
    if (undurDiri) {
      revalidateTag("list-undur-diri");
      await notifPengunduranAnggota(undurDiri, pinjamanJasa, pinjamanBarang);
      return { ok: true, message: "Pengajuan Undur Diri Berhasil!" };
    } else {
      return { ok: false, message: "Pengajuan Undur Diri Gagal!" };
    }
  } catch (error) {
    return { ok: false, message: "Pengajuan Undur Diri Gagal!" };
  }
};

export interface IOptionUndurDiri {
  noPengunduran: string;
  anggotaId: string;
  noUser: string;
}

//kalo bisa tambahin ke db pelunasan pinjaman
export const approvedUndurDiri = async (values: IOptionUndurDiri) => {
  try {
    if (!values.noPengunduran || !values.anggotaId || !values.noUser) {
      return { ok: false, message: "Invalid Field!" };
    }
    const [maxPinjamanJasa, maxPinjamanBarang] = await Promise.all([
      getMaxPinjamanById(values.anggotaId, "JASA"),
      getMaxPinjamanById(values.anggotaId, "BARANG"),
    ]);

    if (!maxPinjamanJasa.ok || !maxPinjamanBarang.ok) {
      return {
        ok: false,
        message:
          "Mohon maaf, proses cek undur diri Anda gagal karena koneksi kami sedang terganggu. Silahkan coba beberapa saat lagi",
      };
    }

    const [pinjamanJasa, pinjamanBarang] = await Promise.all([
      cekPinjamanUndurDiri(maxPinjamanJasa.value),
      cekPinjamanUndurDiri(maxPinjamanBarang.value),
    ]);

    if (pinjamanJasa) {
      const updatePinjamanJasa = await updatePinjamanUndurDiri(pinjamanJasa);
      if (!updatePinjamanJasa.ok) {
        return {
          ok: updatePinjamanJasa.ok,
          message: updatePinjamanJasa.message,
        };
      }
    }

    if (pinjamanBarang) {
      const updatePinjamanBarang =
        await updatePinjamanUndurDiri(pinjamanBarang);
      if (!updatePinjamanBarang.ok) {
        return {
          ok: updatePinjamanBarang.ok,
          message: updatePinjamanBarang.message,
        };
      }
    }

    const approved = await prisma.pengunduranDiri.update({
      where: {
        noPengunduran: values.noPengunduran,
      },
      data: {
        statusPengunduranDiri: "APPROVED",
        anggota: {
          update: {
            statusAnggota: "NOTACTIVE",
          },
        },
        user: {
          update: {
            statusUser: "REJECTED",
          },
        },
      },
    });

    if (approved) {
      const id = await getIdPengambilanSimpanan();
      const dataPengambilan = splitDataPengambilanSimpananUndurDiri(
        approved,
        id,
      );

      const addPengambilan = await prisma.pengambilanSimpanan.createMany({
        data: dataPengambilan,
      });

      if (addPengambilan) {
        revalidateTag("list-angsuran");
        revalidateTag("list-undur-diri");
        revalidateTag("list-pengambilan");
        revalidateTag("list-pinjaman-id");
        revalidateTag("list-potongan-gaji");
        revalidateTag("list-anggota-koperasi");
        revalidateTag("list-pelunasan-pinjaman-petugas");
        revalidateTag("list-simpanan-anggota");
        revalidateTag("total-anggota-koperasi");
        revalidateTag("total-simpanan");
        revalidateTag("total-simpanan-anggota");
        revalidateTag("total-pengambilan-simpanan");
        revalidateTag("count-pinjaman-jasa-anggota");
        revalidateTag("count-pinjaman-barang-anggota");
        revalidateTag("max-simpanan");
        revalidateTag("max-besaran-pinjaman");
        revalidateTag("max-pelunasan");
        revalidateTag("max-besaran-pinjaman");
        revalidateTag("max-pinjaman");
        await notifPengunduranAnggota(approved, pinjamanJasa, pinjamanBarang);
        return { ok: true, message: "Pengajuan Undur Diri Berhasil Disetujui" };
      } else {
        return { ok: false, message: "Pengajuan Undur Diri Gagal Disetujui" };
      }
    } else {
      return { ok: false, message: "Pengajuan Undur Diri Gagal Disetujui" };
    }
  } catch (error) {
    console.log("error: ", error);
    return { ok: false, message: "Invalid Field!" };
  }
};

export const rejectedUndurDiri = async (values: IOptionUndurDiri) => {
  try {
    if (!values.noPengunduran || !values.anggotaId || !values.noUser) {
      return { ok: false, message: "Invalid Field!" };
    }

    const rejected = await prisma.pengunduranDiri.update({
      where: {
        noPengunduran: values.noPengunduran,
      },
      data: {
        statusPengunduranDiri: "REJECTED",
      },
    });

    if (rejected) {
      revalidateTag("list-undur-diri");
      revalidateTag("list-potongan-gaji");
      await notifPengunduranAnggota(rejected, null, null);
      return { ok: true, message: "Pengajuan Undur Diri Berhasil Ditolak" };
    } else {
      return { ok: false, message: "Pengajuan Undur Diri Gagal Ditolak" };
    }
  } catch (error) {
    console.log("error: ", error);
    return { ok: false, message: "Invalid Field!" };
  }
};
