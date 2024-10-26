"use server";

import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { TJabatan } from "@/types/jabatan";

export const getIdJabatan = async () => {
  try {
    const idJabatan = await prisma.jabatan.aggregate({
      _max: {
        noJabatan: true,
      },
    });
    const nextId = idJabatan._max.noJabatan;
    return nextId;
  } catch (error) {
    return null;
  }
};

export const getJabatan = unstable_cache(
  async () => {
    const jabatan = await prisma.jabatan.findMany({
      orderBy: {
        namaJabatan: "asc",
      },
    });

    if (jabatan) {
      return jabatan as TJabatan[];
    } else {
      return null;
    }
  },
  ["jabatan"],
  {
    tags: ["jabatan"],
  },
);
