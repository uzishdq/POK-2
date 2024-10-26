"use server";

import prisma from "@/lib/prisma";
import { TMaster } from "@/types/master";
import { unstable_cache } from "next/cache";

export const getIdMaster = async () => {
  try {
    const idMaster = await prisma.master.aggregate({
      _max: {
        idMaster: true,
      },
    });
    const nextId = idMaster._max.idMaster;
    return nextId;
  } catch (error) {
    return null;
  }
};

export const getMasterbyNik = async (nik: string) => {
  try {
    const master = await prisma.master.findFirst({
      where: { OR: [{ nikMaster: nik }, { nipMaster: nik }] },
    });
    if (master) return master;
  } catch (error) {
    console.log("error data : ", error);
    return null;
  }
};

export const getListMaster = unstable_cache(
  async () => {
    const listMaster = await prisma.master.findMany();

    if (listMaster) {
      return listMaster as TMaster[];
    } else {
      return null;
    }
  },
  ["list-master"],
  {
    tags: ["list-master"],
  },
);
