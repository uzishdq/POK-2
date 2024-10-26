"use server";

import * as z from "zod";
import prisma from "../prisma";
import { revalidateTag } from "next/cache";
import { JabatanSchema } from "../schema/jabatan-schema";
import { getIdJabatan } from "../data/jabatan";
import { setIdAutoincrement } from "../helper";

export const addJabatan = async (values: z.infer<typeof JabatanSchema>) => {
  try {
    const validateValues = JabatanSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const { namaJabatan } = validateValues.data;

    const id = await getIdJabatan();

    const addJabatan = await prisma.jabatan.create({
      data: {
        noJabatan: setIdAutoincrement(id),
        namaJabatan,
      },
    });
    if (addJabatan) {
      revalidateTag("jabatan");
      return { ok: true, message: "Data berhasil disimpan" };
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const editJabatan = async (
  id: number,
  values: z.infer<typeof JabatanSchema>,
) => {
  try {
    const validateValues = JabatanSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const editJabatan = await prisma.jabatan.update({
      where: {
        noJabatan: id,
      },
      data: validateValues.data,
    });

    if (editJabatan) {
      revalidateTag("jabatan");
      return { ok: true, message: "Data berhasil diubah" };
    } else {
      return { ok: false, message: "Data gagal diubah" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const deleteJabatan = async (id: number) => {
  try {
    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }

    const deleteJabatan = await prisma.jabatan.delete({
      where: {
        noJabatan: id,
      },
    });

    if (deleteJabatan) {
      revalidateTag("jabatan");
      return { ok: true, message: "Data berhasil dihapus" };
    } else {
      return { ok: false, message: "Data gagal dihapus" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};
