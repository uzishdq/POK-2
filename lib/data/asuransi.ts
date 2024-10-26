"use server";

import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { TAsuransi } from "@/types/asuransi";

export const getIdAsuransi = async () => {
  try {
    const idAsuransi = await prisma.asuransi.aggregate({
      _max: {
        noAsuransi: true,
      },
    });
    const nextId = idAsuransi._max.noAsuransi;
    return nextId;
  } catch (error) {
    return null;
  }
};

export const getListAsuransi = unstable_cache(
  async () => {
    try {
      const listAsuransi = await prisma.asuransi.findMany({
        where: {
          pinjaman: {
            statusPinjaman: "APPROVED",
          },
        },
        include: {
          pinjaman: {
            select: {
              ajuanPinjaman: true,
              anggota: {
                select: {
                  nama: true,
                  tanggalLahir: true,
                  unitKerja: {
                    select: {
                      namaUnitKerja: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (listAsuransi) {
        return {
          ok: true,
          value: listAsuransi as TAsuransi[],
        };
      } else {
        return { ok: false, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-asuransi"],
  { tags: ["list-asuransi"] },
);
