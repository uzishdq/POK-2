"use server";

import * as z from "zod";
import prisma from "../prisma";
import { revalidateTag } from "next/cache";
import {
  PendaftarSimpananSchema,
  SettingPendaftaranSchema,
  SimpananBerjangkaSchema,
} from "../schema/setting-pendaftaran-simpanan-schema";
import {
  PengambilanSimpananSchema,
  PengambilanSimpananSchemaType,
} from "../schema/simpanan-schema";
import {
  getIdPengambilanSimpanan,
  getPendaftaranSimpanan,
  getSimpananBerjangka,
} from "../data/simpanan";
import {
  generatePengambilanId,
  splitDataPengambilanSimpananBerjangka,
} from "../helper";
import {
  notifPengambilanSimpanan,
  notifPengumumamSimpanan,
} from "./notifikasi";

export const addSettingSimpananBerjangka = async (
  values: z.infer<typeof SettingPendaftaranSchema>,
) => {
  try {
    const validateValues = SettingPendaftaranSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const { date, ...dataWithoutDate } = validateValues.data;

    if (date && date.from && date.to) {
      const addSetting = await prisma.pendaftaranSimpanan.create({
        data: {
          namaPendaftaran: dataWithoutDate.namaPendaftaran,
          tanggalAwalSimpanan: date.from,
          tanggalAkhirSimpanan: date.to,
          tanggalTutupPendaftaran: dataWithoutDate.tanggalTutupPendaftaran,
          jenisPendaftaran: dataWithoutDate.jenisPendaftaran,
        },
      });
      if (addSetting) {
        revalidateTag("list-simpanan-berjangka");
        await notifPengumumamSimpanan(addSetting);
        return { ok: true, message: "Data berhasil disimpan" };
      } else {
        return { ok: false, message: "Data gagal disimpan" };
      }
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const editSettingSimpananBerjangka = async (
  id: number,
  values: z.infer<typeof SettingPendaftaranSchema>,
) => {
  try {
    const validateValues = SettingPendaftaranSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }

    const { date, ...dataWithoutDate } = validateValues.data;

    if (date && date.from && date.to) {
      const editSetting = await prisma.pendaftaranSimpanan.update({
        where: {
          noPendaftaran: id,
        },
        data: {
          namaPendaftaran: dataWithoutDate.namaPendaftaran,
          tanggalAwalSimpanan: date.from,
          tanggalAkhirSimpanan: date.to,
          tanggalTutupPendaftaran: dataWithoutDate.tanggalTutupPendaftaran,
          jenisPendaftaran: dataWithoutDate.jenisPendaftaran,
        },
      });
      if (editSetting) {
        revalidateTag("list-simpanan-berjangka");
        return { ok: true, message: "Data berhasil diubah" };
      } else {
        return { ok: false, message: "Data gagal diubah" };
      }
    } else {
      return { ok: false, message: "Data gagal diubah" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const deleteSettingSimpananBerjangka = async (id: number) => {
  try {
    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }

    const deleteSetting = await prisma.pendaftaranSimpanan.delete({
      where: {
        noPendaftaran: id,
      },
    });
    if (deleteSetting) {
      revalidateTag("list-simpanan-berjangka");
      return { ok: true, message: "Data berhasil dihapus" };
    } else {
      return { ok: false, message: "Data gagal dihapus" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const cekSimpananBerjangka = async (
  values: z.infer<typeof SimpananBerjangkaSchema>,
) => {
  try {
    const validateValues = SimpananBerjangkaSchema.safeParse(values);
    if (!validateValues.success) {
      return {
        ok: false,
        message: "Invalid Field!",
        value: null,
      };
    }

    const data = await getSimpananBerjangka(
      validateValues.data.jenisPendaftaran,
    );

    if (!data.ok && data.value === null) {
      return {
        ok: data.ok,
        message: "Simpanan Berjangka Tidak Ditemukan",
        value: null,
      };
    } else {
      return {
        ok: data.ok,
        message: "Simpanan Berjangka Ditemukan",
        value: data.value,
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: "Invalid Field!",
      value: null,
    };
  }
};

export const addPengambilanSimpananBerjangka = async (
  values: z.infer<typeof SimpananBerjangkaSchema>,
) => {
  try {
    const validateValues = SimpananBerjangkaSchema.safeParse(values);

    if (!validateValues.success) {
      return {
        ok: false,
        message: "Invalid Field!",
      };
    }

    const [data, idPengambilan] = await Promise.all([
      getSimpananBerjangka(validateValues.data.jenisPendaftaran),
      getIdPengambilanSimpanan(),
    ]);

    if (!data.ok && data.value === null) {
      return {
        ok: data.ok,
        message: "Simpanan Berjangka Tidak Ditemukan",
      };
    }

    if (data.value === null) {
      return {
        ok: data.ok,
        message: "Simpanan Berjangka Tidak Ditemukan",
      };
    }
    const dataPengambilan = splitDataPengambilanSimpananBerjangka(
      idPengambilan,
      data.value,
    );
    console.log(dataPengambilan);
    return { ok: true, message: "Data berhasil disimpan" };
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

//tambah revalidate untuk potongan gaji
export const addPendaftaranSimpanan = async (
  values: z.infer<typeof PendaftarSimpananSchema>,
) => {
  try {
    const validateValues = PendaftarSimpananSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const isDaftar = await prisma.pendaftar.findFirst({
      where: {
        AND: [
          { pendaftaranId: validateValues.data.pendaftaranId },
          { anggotaId: validateValues.data.anggotaId },
        ],
      },
    });

    if (isDaftar) {
      return { ok: false, message: "sudah terdaftar" };
    } else {
      const pendaftaranSimpanan = await prisma.pendaftar.create({
        data: validateValues.data,
      });
      if (pendaftaranSimpanan) {
        revalidateTag("total-pendaftar");
        revalidateTag("list-potongan-gaji");
        revalidateTag("list-simpanan-berjangka");
        return { ok: true, message: "pendaftaran berhasil" };
      } else {
        return { ok: false, message: "pendaftaran gagal" };
      }
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const cekPengambilanSimpananBerjangka = async (type: string) => {
  try {
    let jenisPendaftaran: string = "";
    switch (type) {
      case "LEBARAN":
        jenisPendaftaran = "simpanan-lebaran";
        break;
      case "QURBAN":
        jenisPendaftaran = "simpanan-qurban";
        break;
      case "UBAR":
        jenisPendaftaran = "simpanan-ubar";
        break;
      default:
        jenisPendaftaran = "simpanan-sukamana";
        break;
    }

    if (jenisPendaftaran === "simpanan-sukamana") {
      return true;
    }

    const isPengambilanBerjangka =
      await getPendaftaranSimpanan(jenisPendaftaran);

    if (!isPengambilanBerjangka.ok) {
      return false;
    }

    if (isPengambilanBerjangka.ok && isPengambilanBerjangka.value != null) {
      const isDaftar = await prisma.pengambilanSimpanan.findFirst({
        where: {
          tanggalPengambilanSimpanan: {
            gte: isPengambilanBerjangka.value.tanggalAwalSimpanan,
            lte: isPengambilanBerjangka.value.tanggalAkhirSimpanan,
          },
        },
        select: {
          noPengambilanSimpanan: true,
        },
      });
      return isDaftar ? false : true;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

//tambah validasi pengambilan simpanan berjangka
export const addPengambilanSimpanan = async (
  limit: number,
  values: PengambilanSimpananSchemaType,
  type: string,
) => {
  try {
    const validateValues = PengambilanSimpananSchema(limit, type).safeParse(
      values,
    );

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const isDaftar = await cekPengambilanSimpananBerjangka(
      validateValues.data.jenisPengambilanSimpanan,
    );

    if (!isDaftar) {
      return {
        ok: false,
        message: `Anda sudah mengambil Simpanan ${validateValues.data.jenisPengambilanSimpanan.toLocaleLowerCase()} dalam periode ini. Penarikan hanya dapat dilakukan sekali dalam satu periode.`,
      };
    }

    const id = await getIdPengambilanSimpanan();
    const addPengambilan = await prisma.pengambilanSimpanan.create({
      data: {
        noPengambilanSimpanan: generatePengambilanId(
          id,
          validateValues.data.jenisPengambilanSimpanan,
        ),
        jenisPengambilanSimpanan: validateValues.data.jenisPengambilanSimpanan,
        anggotaId: validateValues.data.anggotaId,
        jumlahPengambilanSimpanan:
          validateValues.data.jumlahPengambilanSimpanan,
      },
    });
    if (addPengambilan) {
      revalidateTag("max-pinjaman");
      revalidateTag("max-simpanan");
      revalidateTag("total-pengambilan-simpanan");
      revalidateTag("list-pengambilan");
      revalidateTag("max-besaran-pinjaman");
      await notifPengambilanSimpanan(addPengambilan);
      return { ok: true, message: "ajuan pengambilan simpanan berhasil" };
    } else {
      return { ok: false, message: "ajuan pengambilan simpanan gagal" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const ApprovedPengambilanSimpanan = async (id: string) => {
  try {
    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }
    const approved = await prisma.pengambilanSimpanan.update({
      where: {
        noPengambilanSimpanan: id,
      },
      data: {
        statusPengambilanSimpanan: "APPROVED",
      },
    });
    if (approved) {
      revalidateTag("max-pinjaman");
      revalidateTag("max-simpanan");
      revalidateTag("max-besaran-pinjaman");
      revalidateTag("total-simpanan");
      revalidateTag("total-simpanan-anggota");
      revalidateTag("total-pengambilan-simpanan");
      revalidateTag("list-pengambilan");
      revalidateTag("list-simpanan-anggota");
      await notifPengambilanSimpanan(approved);
      return {
        ok: true,
        message: "Pengambilan Simpanan Anggota, Berhasil Disetujui.",
      };
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const RejectedPengambilanSimpanan = async (id: string) => {
  try {
    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }
    const rejected = await prisma.pengambilanSimpanan.update({
      where: {
        noPengambilanSimpanan: id,
      },
      data: {
        statusPengambilanSimpanan: "REJECTED",
      },
    });
    if (rejected) {
      revalidateTag("max-pinjaman");
      revalidateTag("max-simpanan");
      revalidateTag("total-pengambilan-simpanan");
      revalidateTag("list-pengambilan");
      revalidateTag("total-simpanan");
      revalidateTag("max-besaran-pinjaman");
      await notifPengambilanSimpanan(rejected);
      return {
        ok: true,
        message: "Pengambilan Simpanan Anggota, Berhasil Ditolak.",
      };
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};
