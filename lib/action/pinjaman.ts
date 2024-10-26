"use server";

import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  PengajuanPinjamanSchema,
  PengajuanPinjamanSchemaType,
} from "../schema/pinjaman-schema";
import {
  calculateAsuransi,
  calculateLoanInstallment,
  calculatePelunasanPinjaman,
  cekLoanInstallment,
  formatToIDR,
  generateAngsuranId,
  generatePelunasanPinjamanId,
  generatePinjamanId,
  isPassPinjaman,
  predictLoanBasedOnSalary,
  setIdAutoincrement,
} from "../helper";
import {
  getIdAngsuran,
  getIdPelunasan,
  getIdPinjaman,
  getMaxAngsuran,
  getMaxPinjamanById,
  getSecondPinjaman,
} from "../data/pinjaman";
import prisma from "../prisma";
import { uploadImage } from "./upload-image";
import { revalidateTag } from "next/cache";
import { getIdAsuransi } from "../data/asuransi";
import { notifPelunasanPinjaman, notifPengajuanPinjaman } from "./notifikasi";
import {
  cekPelunasanSchema,
  PelunasanPinjamanSchema,
} from "../schema/pelunasan-pinjaman-schema";

export const cekSyaratPinjaman = async (
  limit: number,
  values: FormData,
  tanggalLahir: Date,
  pinjamanId: string | null,
) => {
  try {
    const formData = Object.fromEntries(values.entries());
    const validateValues = PengajuanPinjamanSchema(limit).safeParse(formData);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!", value: null };
    }

    const {
      jumlahPenghasilan,
      ajuanPinjaman,
      waktuPengembalian,
      jenisPinjaman,
    } = validateValues.data;

    const hasil = cekLoanInstallment(
      jumlahPenghasilan,
      ajuanPinjaman,
      waktuPengembalian,
    );

    if (hasil) {
      let pelunasan: number = 0;

      if (pinjamanId) {
        const maxAngsuran = await getMaxAngsuran(pinjamanId);
        if (!maxAngsuran) {
          return {
            ok: false,
            message: `Maaf, Pengajuan pinjaman belum memenuhi persyaratan`,
            value: null,
          };
        }
        const pinjaman = calculatePelunasanPinjaman(maxAngsuran);
        pelunasan = pinjaman.jumlahPelunasan;
      }

      const asuransi = calculateAsuransi(
        jumlahPenghasilan,
        tanggalLahir,
        waktuPengembalian,
        ajuanPinjaman,
        jenisPinjaman,
        pelunasan,
      );

      return {
        ok: asuransi.statusAsuransi,
        message: asuransi.pesanAsuransai,
        value: asuransi.statusAsuransi ? asuransi : null,
      };
    } else {
      const prediksi = predictLoanBasedOnSalary(
        jumlahPenghasilan,
        ajuanPinjaman,
      );

      if (prediksi.maxLoanAmount > 0) {
        return {
          ok: false,
          message: `Maaf, Pengajuan pinjaman belum memenuhi persyaratan, Rekomendasi: dengan besaran pinjaman ${formatToIDR(prediksi.maxLoanAmount)}, waktu pengembalian yang sesuai ${prediksi.maxRepaymentTime} bulan. Dengan batas maksimal angsuran bulanan ${formatToIDR(prediksi.monthlyInstallment)}`,
          value: null,
        };
      } else {
        return {
          ok: false,
          message: `Maaf, Pengajuan pinjaman belum memenuhi persyaratan`,
          value: null,
        };
      }
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!", value: null };
  }
};

export const addPinjaman = async (
  limit: number,
  values: FormData,
  tanggalLahir: Date,
) => {
  try {
    let isPass: boolean = false;
    let pelunasan: number = 0;
    const formData = Object.fromEntries(values.entries());
    const validateValues = PengajuanPinjamanSchema(limit).safeParse(formData);
    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const isPinjaman = await getMaxPinjamanById(
      validateValues.data.anggotaId,
      validateValues.data.jenisPinjaman,
    );

    //benerin logika nya jika masih ada pinjaman maka false, tapi jika pinjaman jasa dan angsuran sudah 50% true. dan update pinjaman jika isPassPinjaman true dan bikin angsuran pinjaman
    if (isPinjaman.value != null) {
      isPass =
        validateValues.data.jenisPinjaman === "JASA"
          ? isPassPinjaman(
              isPinjaman.value.AngsuranPinjaman[0].angsuranPinjamanKe,
              isPinjaman.value.AngsuranPinjaman[0].angsuranPinjamanDari,
            )
          : false;

      if (isPass) {
        const maxAngsuran = await getMaxAngsuran(isPinjaman.value.noPinjaman);
        if (!maxAngsuran) {
          return {
            ok: false,
            message: `Maaf, Pengajuan pinjaman belum memenuhi persyaratan`,
          };
        }
        const pinjaman = calculatePelunasanPinjaman(maxAngsuran);
        pelunasan = pinjaman.jumlahPelunasan;
      }

      if (
        validateValues.data.jenisPinjaman === "JASA" &&
        !isPassPinjaman(
          isPinjaman.value.AngsuranPinjaman[0].angsuranPinjamanKe,
          isPinjaman.value.AngsuranPinjaman[0].angsuranPinjamanDari,
        )
      ) {
        return {
          ok: false,
          message: `Anda masih memiliki pinjaman ${validateValues.data.jenisPinjaman === "JASA" ? "produktif" : "barang"} yang sedang berjalan atau dalam proses pengajuan. Harap selesaikan terlebih dahulu sebelum mengajukan yang baru!`,
        };
      }
      if (validateValues.data.jenisPinjaman === "BARANG") {
        return {
          ok: false,
          message: `Anda masih memiliki pinjaman ${validateValues.data.jenisPinjaman === "BARANG" ? "barang" : "produktif"} yang sedang berjalan atau dalam proses pengajuan. Harap selesaikan terlebih dahulu sebelum mengajukan yang baru!`,
        };
      }
    }

    const asuransi = calculateAsuransi(
      validateValues.data.jumlahPenghasilan,
      tanggalLahir,
      validateValues.data.waktuPengembalian,
      validateValues.data.ajuanPinjaman,
      validateValues.data.jenisPinjaman,
      pelunasan,
    );

    if (!asuransi.statusAsuransi) {
      return {
        ok: false,
        message: "pengajuan pinjaman belum memenuhi syarat!",
      };
    }

    const newUUID = uuidv4();
    const id = await getIdPinjaman(validateValues.data.jenisPinjaman);
    const pinjamanId = generatePinjamanId(
      id,
      validateValues.data.jenisPinjaman,
    );

    const nameStruk = `${validateValues.data.anggotaId}/${newUUID}-struk-gaji.jpg`;
    const struk = await uploadImage(
      validateValues.data.strukGaji,
      nameStruk,
      "struk-gaji",
    );

    if (!struk.error || !struk.imageUrl) {
      return { ok: false, message: "gagal upload struk gaji" };
    }

    const addPinjaman = await prisma.pinjaman.create({
      data: {
        noPinjaman: pinjamanId,
        anggotaId: validateValues.data.anggotaId,
        tujuanPinjaman: validateValues.data.tujuanPinjaman,
        waktuPengembalian: validateValues.data.waktuPengembalian,
        ajuanPinjaman: validateValues.data.ajuanPinjaman,
        jenisPinjaman: validateValues.data.jenisPinjaman,
        jumlahPenghasilan: validateValues.data.jumlahPenghasilan,
        jumlahDiterima: asuransi.receive!,
        strukGaji: struk.imageUrl,
      },
    });

    if (addPinjaman) {
      const idAngsuran = await getIdAngsuran();
      const addAngsuran = await prisma.angsuranPinjaman.create({
        data: {
          noAngsuranPinjaman: generateAngsuranId(idAngsuran),
          pinjamanId: pinjamanId,
          angsuranPinjamanKe: 0,
          angsuranPinjamanDari: validateValues.data.waktuPengembalian,
          jumlahAngsuranPinjaman: asuransi.monthlyInstallment!,
        },
      });
      if (addAngsuran) {
        if (validateValues.data.jenisPinjaman === "BARANG") {
          revalidateTag("max-pinjaman");
          revalidateTag("list-pinjaman-jasa");
          revalidateTag("list-pinjaman-barang");
          revalidateTag("list-pinjaman-id");
          revalidateTag("count-pinjaman-jasa-anggota");
          revalidateTag("count-pinjaman-barang-anggota");
          revalidateTag("list-asuransi");
          revalidateTag("list-angsuran");
          await notifPengajuanPinjaman(addPinjaman);
          return {
            ok: true,
            message:
              "pengajuan pinjaman berhasil, proses membutuhkan waktu 3-5 hari kerja !",
          };
        } else {
          const idAsuransi = await getIdAsuransi();
          const addAsuransi = await prisma.asuransi.create({
            data: {
              noAsuransi: setIdAutoincrement(idAsuransi),
              pinjamanId: pinjamanId,
              usiaAsuransi: asuransi.umur!,
              tanggalAkhirAsuransi: asuransi.tglSelesaiAsuransi!,
              masaAsuransiTH: asuransi.tenor!,
              masaAsuransiBL: 0,
              masaAsuransiJK: asuransi.tenor!,
              premi: asuransi.totalPremi!,
            },
          });
          if (addAsuransi) {
            revalidateTag("max-pinjaman");
            revalidateTag("list-pinjaman-jasa");
            revalidateTag("list-pinjaman-barang");
            revalidateTag("list-pinjaman-id");
            revalidateTag("count-pinjaman-jasa-anggota");
            revalidateTag("count-pinjaman-barang-anggota");
            revalidateTag("list-asuransi");
            revalidateTag("list-angsuran");
            await notifPengajuanPinjaman(addPinjaman);
            return {
              ok: true,
              message:
                "pengajuan pinjaman berhasil, proses membutuhkan waktu 3-5 hari kerja !",
            };
          }
        }
      } else {
        return {
          ok: false,
          message: "pengajuan pinjaman gagal!",
        };
      }
    }
  } catch (error) {
    console.log("error: ", error);
    return { ok: false, message: "Invalid Field!" };
  }
};

export const updatePinjaman = async (
  pinjamanId: string,
  angsuranKe: number,
  pelunasan: number,
) => {
  const updatePinjaman = await prisma.pinjaman.update({
    where: {
      noPinjaman: pinjamanId,
    },
    data: {
      statusPinjaman: "COMPLETED",
    },
  });
  if (updatePinjaman) {
    const idUpdate = await getIdAngsuran();
    const addAngsuran = await prisma.angsuranPinjaman.create({
      data: {
        noAngsuranPinjaman: generateAngsuranId(idUpdate),
        pinjamanId: updatePinjaman.noPinjaman,
        angsuranPinjamanKe: angsuranKe + 1,
        angsuranPinjamanDari: updatePinjaman.waktuPengembalian,
        jumlahAngsuranPinjaman: pelunasan,
        statusAngsuranPinjaman: "COMPLETED",
      },
    });
    if (addAngsuran) {
      return true;
    }
  }
};

export const approvePinjaman = async (
  id: string,
  noAnggota: string,
  jenis: "BARANG" | "JASA",
) => {
  try {
    let isPass: boolean = false;
    let pelunasan: number = 0;
    if (jenis === "JASA") {
      const secound = await getSecondPinjaman(noAnggota, jenis);
      if (secound.value != null) {
        isPass = isPassPinjaman(
          secound.value.AngsuranPinjaman[0].angsuranPinjamanKe,
          secound.value.AngsuranPinjaman[0].angsuranPinjamanDari,
        );
        if (isPass) {
          const maxAngsuran = await getMaxAngsuran(secound.value.noPinjaman);
          if (!maxAngsuran) {
            return { ok: false, message: "tidak bisa update pinjaman!" };
          }
          const pinjaman = calculatePelunasanPinjaman(maxAngsuran);
          pelunasan = pinjaman.jumlahPelunasan;
          await updatePinjaman(
            secound.value.noPinjaman,
            secound.value.AngsuranPinjaman[0].angsuranPinjamanKe,
            pelunasan,
          );
        }
      }
    }

    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }
    const approved = await prisma.pinjaman.update({
      where: {
        noPinjaman: id,
      },
      data: {
        statusPinjaman: "APPROVED",
      },
    });

    if (approved) {
      revalidateTag("max-pinjaman");
      revalidateTag("max-besaran-pinjaman");
      revalidateTag("list-pinjaman-jasa");
      revalidateTag("list-pinjaman-barang");
      revalidateTag("list-pinjaman-id");
      revalidateTag("count-pinjaman-jasa-anggota");
      revalidateTag("count-pinjaman-barang-anggota");
      revalidateTag("max-pelunasan");
      revalidateTag("list-potongan-gaji");
      await notifPengajuanPinjaman(approved);
      return { ok: true, message: "Pinjaman Berhasil Disetujui" };
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const rejectPinjaman = async (id: string) => {
  try {
    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }
    const rejected = await prisma.pinjaman.update({
      where: {
        noPinjaman: id,
      },
      data: {
        statusPinjaman: "REJECTED",
      },
    });

    if (rejected) {
      revalidateTag("max-pinjaman");
      revalidateTag("max-besaran-pinjaman");
      revalidateTag("list-pinjaman-jasa");
      revalidateTag("list-pinjaman-barang");
      revalidateTag("list-pinjaman-id");
      revalidateTag("count-pinjaman-jasa-anggota");
      revalidateTag("count-pinjaman-barang-anggota");
      await notifPengajuanPinjaman(rejected);
      return { ok: true, message: "Pinjaman Berhasil Ditolak" };
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const cekPelunasanPinjaman = async (
  values: z.infer<typeof cekPelunasanSchema>,
) => {
  try {
    const validateValues = cekPelunasanSchema.safeParse(values);
    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!", value: null };
    }

    const { pinjamanId } = validateValues.data;

    const pinjaman = await getMaxAngsuran(pinjamanId);

    if (!pinjaman) {
      return {
        ok: false,
        message: "Anda Tidak Memiliki, Pinjaman",
        value: null,
      };
    }

    const isPass = calculatePelunasanPinjaman(pinjaman);
    return {
      ok: true,
      message: "Cek Pelunasan Pinjaman Berhasil!",
      value: isPass,
    };
  } catch (error) {
    return { ok: false, message: "Cek Pelunasan Pinjaman Gagal!", value: null };
  }
};

export const addPelunasanPinjaman = async (limit: number, values: FormData) => {
  try {
    const formData = Object.fromEntries(values.entries());

    const validateValues = PelunasanPinjamanSchema(limit).safeParse(formData);
    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const pinjaman = await getMaxAngsuran(validateValues.data.pinjamanId);

    if (!pinjaman) {
      return {
        ok: false,
        message: "Anda Tidak Memiliki, Pinjaman",
      };
    }

    const id = await getIdPelunasan();
    const newUUID = uuidv4();
    const nameStruk = `${newUUID}-pelunasan.jpg`;
    const struk = await uploadImage(
      validateValues.data.buktiPelunasanPinjaman,
      nameStruk,
      "struk-pelunasan",
    );

    if (!struk.error || !struk.imageUrl) {
      return { ok: false, message: "gagal upload bukti pelunasan" };
    }

    const newPelunasan = await prisma.pelunasanPinjaman.create({
      data: {
        noPelunasanPinjaman: generatePelunasanPinjamanId(
          id,
          validateValues.data.jenisPelunasanPinjaman,
        ),
        pinjamanId: validateValues.data.pinjamanId,
        angsuranKePelunasanPinjaman:
          validateValues.data.angsuranKePelunasanPinjaman,
        sudahDibayarkan: validateValues.data.sudahDibayarkan,
        buktiPelunasanPinjaman: struk.imageUrl,
        jenisPelunasanPinjaman: validateValues.data.jenisPelunasanPinjaman,
        jumlahPelunasanPinjaman: Number(
          validateValues.data.jumlahPelunasanPinjaman,
        ),
      },
    });

    if (newPelunasan) {
      await notifPelunasanPinjaman(newPelunasan, pinjaman);
      revalidateTag("max-pelunasan");
      revalidateTag("list-pelunasan-pinjaman-petugas");
      return {
        ok: true,
        message:
          "pengajuan pelunasan pinjaman berhasil, proses membutuhkan waktu 3-5 hari kerja !",
      };
    } else {
      return { ok: false, message: "pengajuan pelunasan pinjaman gagal." };
    }
  } catch (error) {
    console.log("error: ", error);
    return { ok: false, message: "Invalid Field!" };
  }
};

export const approvedPelunasanPinjaman = async (
  id: string,
  pinjamanId: string,
  pelunasan: number,
) => {
  try {
    if (!id || !pinjamanId) {
      return { ok: false, message: "Invalid Field!" };
    }

    const pinjaman = await getMaxAngsuran(pinjamanId);

    if (!pinjaman) {
      return {
        ok: false,
        message: "Anda Tidak Memiliki, Pinjaman",
      };
    }

    const isPass = calculatePelunasanPinjaman(pinjaman);
    //cari solusinya
    if (isPass.jumlahPelunasan !== pelunasan) {
      return {
        ok: false,
        message:
          "Jumlah pelunasan tidak sesuai, kemungkinan potongan gaji sudah diinput.",
      };
    }

    const approved = await prisma.pelunasanPinjaman.update({
      where: {
        noPelunasanPinjaman: id,
      },
      data: {
        statusPelunasanPinjaman: "APPROVED",
        pinjaman: {
          update: {
            statusPinjaman: "COMPLETED",
          },
        },
      },
    });

    if (!approved) {
      return { ok: false, message: "Gagal Update Pelunasan Pinjaman" };
    }

    const idAngsuran = await getIdAngsuran();
    const angsuran = await prisma.angsuranPinjaman.create({
      data: {
        noAngsuranPinjaman: generateAngsuranId(idAngsuran),
        pinjamanId,
        angsuranPinjamanKe: isPass.angsuranKe + 1,
        angsuranPinjamanDari: isPass.angsuranDari,
        jumlahAngsuranPinjaman: pelunasan,
        statusAngsuranPinjaman: "COMPLETED",
      },
    });

    if (angsuran) {
      revalidateTag("max-pinjaman");
      revalidateTag("max-pelunasan");
      revalidateTag("max-besaran-pinjaman");
      revalidateTag("list-pinjaman-jasa");
      revalidateTag("list-pinjaman-barang");
      revalidateTag("list-pinjaman-id");
      revalidateTag("count-pinjaman-jasa-anggota");
      revalidateTag("count-pinjaman-barang-anggota");
      revalidateTag("list-potongan-gaji");
      revalidateTag("list-pelunasan-pinjaman-petugas");
      revalidateTag("list-angsuran");
      await notifPelunasanPinjaman(approved, pinjaman, angsuran);
      return { ok: true, message: "Pelunasan Pinjaman Berhasil Disetujui" };
    } else {
      return { ok: false, message: "Pelunasan Pinjaman Gagal Disetujui" };
    }
  } catch (error) {
    console.log("error: ", error);

    return { ok: false, message: "Invalid Field!" };
  }
};

export const rejectPelunasanPinjaman = async (
  id: string,
  pinjamanId: string,
) => {
  try {
    if (!id || !pinjamanId) {
      return { ok: false, message: "Invalid Field!" };
    }

    const pinjaman = await getMaxAngsuran(pinjamanId);

    if (!pinjaman) {
      return {
        ok: false,
        message: "Anda Tidak Memiliki, Pinjaman",
      };
    }
    const reject = await prisma.pelunasanPinjaman.update({
      where: {
        noPelunasanPinjaman: id,
      },
      data: {
        statusPelunasanPinjaman: "APPROVED",
        pinjaman: {
          update: {
            data: {
              statusPinjaman: "COMPLETED",
            },
          },
        },
      },
    });

    if (reject) {
      revalidateTag("max-pinjaman");
      revalidateTag("max-pelunasan");
      revalidateTag("max-besaran-pinjaman");
      revalidateTag("list-pinjaman-jasa");
      revalidateTag("list-pinjaman-barang");
      revalidateTag("list-pinjaman-id");
      revalidateTag("count-pinjaman-jasa-anggota");
      revalidateTag("count-pinjaman-barang-anggota");
      revalidateTag("list-potongan-gaji");
      revalidateTag("list-pelunasan-pinjaman-petugas");
      await notifPelunasanPinjaman(reject, pinjaman);
      return { ok: true, message: "Pelunasan Pinjaman Berhasil Ditolak" };
    } else {
      return { ok: false, message: "Pelunasan Pinjaman Gagal Ditolak" };
    }
  } catch (error) {
    console.log("error: ", error);
    return { ok: false, message: "Invalid Field!" };
  }
};
