"use server";

import * as z from "zod";
import prisma from "../prisma";
import { revalidateTag } from "next/cache";
import { DataMasterSchema } from "../schema/data-master-schema";
import { getIdMaster } from "../data/master";
import { setIdAutoincrement } from "../helper";

export const addMaster = async (values: z.infer<typeof DataMasterSchema>) => {
  try {
    const validateValues = DataMasterSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }

    const {
      nikMaster,
      nipMaster,
      namaMaster,
      jenisKelaminMaster,
      alamatMaster,
      tempatLahirMaster,
      tanggalLahirMaster,
      jabatanMaster,
      unitKerjaMaster,
      statusPekerjaanMaster,
    } = validateValues.data;

    const id = await getIdMaster();

    const addMaster = await prisma.master.create({
      data: {
        idMaster: setIdAutoincrement(id),
        nipMaster,
        nikMaster,
        namaMaster,
        tempatLahirMaster,
        tanggalLahirMaster,
        jenisKelaminMaster,
        alamatMaster,
        statusPekerjaanMaster,
        unitKerjaMaster,
        jabatanMaster,
      },
    });

    if (addMaster) {
      revalidateTag("list-master");
      return { ok: true, message: "Data berhasil disimpan" };
    } else {
      return { ok: false, message: "Data gagal disimpan" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const editMaster = async (
  id: number,
  values: z.infer<typeof DataMasterSchema>,
) => {
  try {
    const validateValues = DataMasterSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: "Invalid Field!" };
    }
    const editMaster = await prisma.master.update({
      where: {
        idMaster: id,
      },
      data: validateValues.data,
    });
    if (editMaster) {
      revalidateTag("list-master");
      return { ok: true, message: "Data berhasil diubah" };
    } else {
      return { ok: false, message: "Data gagal diubah" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};

export const deleteMaster = async (id: number) => {
  try {
    if (!id) {
      return { ok: false, message: "Invalid Field!" };
    }

    const deleteMaster = await prisma.master.delete({
      where: {
        idMaster: id,
      },
    });

    if (deleteMaster) {
      revalidateTag("list-master");
      return { ok: true, message: "Data berhasil dihapus" };
    } else {
      return { ok: false, message: "Data gagal dihapus" };
    }
  } catch (error) {
    return { ok: false, message: "Invalid Field!" };
  }
};
