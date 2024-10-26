"use server";

import * as z from "zod";
import prisma from "../prisma";
import { JsonPotongGajiSchema } from "../schema/potong-gaji-schema";
import { setPotonganGaji, splitAngsuran, splitDataSimpanan } from "../helper";
import { getIdSimpanan } from "../data/simpanan";
import { getIdAngsuran } from "../data/pinjaman";
import { notifPotonganGaji } from "./notifikasi";
import { revalidateTag } from "next/cache";
import { getIdPotonganGaji } from "../data/potong-gaji";

export const addPotongGaji = async (
  values: z.infer<typeof JsonPotongGajiSchema>,
) => {
  try {
    const validateValues = JsonPotongGajiSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "file yang diunggah tidak valid" };
    }

    const [idSimpanan, idAngsuran, idPotonganGaji] = await Promise.all([
      getIdSimpanan(),
      getIdAngsuran(),
      getIdPotonganGaji(),
    ]);

    const dataSimpanan = splitDataSimpanan(idSimpanan, validateValues.data);
    const dataAngsuran = splitAngsuran(idAngsuran, validateValues.data);
    const dataPotongan = setPotonganGaji(validateValues.data, idPotonganGaji);

    const newSimpanan = await prisma.simpanan.createMany({
      data: dataSimpanan,
    });

    if (newSimpanan.count === 0) {
      return { ok: false, message: "Data simpanan gagal disimpan" };
    }

    if (dataAngsuran.data.length > 0) {
      const newAngsuran = await prisma.angsuranPinjaman.createMany({
        data: dataAngsuran.data.map(
          ({ anggotaId, jenisPinjaman, ...rest }) => rest,
        ),
      });

      if (newAngsuran.count === 0) {
        return { ok: false, message: "Data angsuran gagal disimpan" };
      }
    }

    if (dataAngsuran.pass.length > 0) {
      const noPinjamans = dataAngsuran.pass.map((item) => item.pinjamanId);
      const updatePinjaman = await prisma.pinjaman.updateMany({
        where: { noPinjaman: { in: noPinjamans } },
        data: { statusPinjaman: "COMPLETED" },
      });
      if (updatePinjaman.count === 0) {
        return { ok: false, message: "Update pinjaman gagal" };
      }
    }

    const newPotonganGaji = await prisma.potongGaji.createMany({
      data: dataPotongan,
    });
    if (newPotonganGaji) {
      revalidateTag("potongan-gaji");
      revalidateTag("max-pinjaman");
      revalidateTag("max-simpanan");
      revalidateTag("max-pelunasan");
      revalidateTag("total-simpanan");
      revalidateTag("total-simpanan-anggota");
      revalidateTag("total-pengambilan-simpanan");
      revalidateTag("max-besaran-pinjaman");
      revalidateTag("list-angsuran");
      revalidateTag("list-pinjaman-jasa");
      revalidateTag("list-pinjaman-barang");
      revalidateTag("list-pinjaman-id");
      revalidateTag("list-potongan-gaji");
      revalidateTag("list-potongan-gaji-approved");
      revalidateTag("list-simpanan-anggota");
      revalidateTag("count-pinjaman-jasa-anggota");
      revalidateTag("count-pinjaman-barang-anggota");
      await notifPotonganGaji(dataSimpanan, dataAngsuran.data);
      return { ok: true, message: "Data berhasil disimpan" };
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    console.log("error:", error);
    return { ok: false, message: "Invalid Field!" };
  }
};
