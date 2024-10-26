"use server";

import * as z from "zod";
import prisma from "../prisma";
import { revalidateTag } from "next/cache";
import { UnitKerjaSchema } from "../schema/unit-kerja-schema";
import { getIdUnitKerja } from "../data/unit-kerja";
import { setIdAutoincrement } from "../helper";

export const addUnitKerja = async (values: z.infer<typeof UnitKerjaSchema>) => {
  try {
    const validateValues = UnitKerjaSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }
    const { namaUnitKerja, alamatKantor } = validateValues.data;

    const id = await getIdUnitKerja();
    const addUnitKerja = await prisma.unitKerja.create({
      data: {
        noUnitKerja: setIdAutoincrement(id),
        namaUnitKerja,
        alamatKantor,
      },
    });
    if (addUnitKerja) {
      revalidateTag("unit-kerja");
      return { ok: true, message: "Data berhasil disimpan" };
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const editUnitKerja = async (
  id: number,
  values: z.infer<typeof UnitKerjaSchema>,
) => {
  try {
    const validateValues = UnitKerjaSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const editUnitKerja = await prisma.unitKerja.update({
      where: {
        noUnitKerja: id,
      },
      data: validateValues.data,
    });

    if (editUnitKerja) {
      revalidateTag("unit-kerja");
      return { ok: true, message: "Data berhasil diubah" };
    } else {
      return { ok: false, message: "Data gagal diubah" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const deleteUnitKerja = async (id: number) => {
  try {
    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }

    const deleteUnitKerja = await prisma.unitKerja.delete({
      where: {
        noUnitKerja: id,
      },
    });

    if (deleteUnitKerja) {
      revalidateTag("unit-kerja");
      return { ok: true, message: "Data berhasil dihapus" };
    } else {
      return { ok: false, message: "Data gagal dihapus" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};
