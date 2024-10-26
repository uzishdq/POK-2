"use server";

import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { TUnitKerja } from "@/types/unit-kerja";

export const getIdUnitKerja = async () => {
  try {
    const idUnitKerja = await prisma.unitKerja.aggregate({
      _max: {
        noUnitKerja: true,
      },
    });
    const nextId = idUnitKerja._max.noUnitKerja;
    return nextId;
  } catch (error) {
    return null;
  }
};

export const getUnitKerja = unstable_cache(
  async () => {
    const unitKerja = await prisma.unitKerja.findMany({
      orderBy: {
        namaUnitKerja: "asc",
      },
    });

    if (unitKerja) {
      return unitKerja as TUnitKerja[];
    } else {
      return null;
    }
  },
  ["unit-kerja"],
  {
    tags: ["unit-kerja"],
  },
);
