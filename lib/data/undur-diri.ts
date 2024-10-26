"use server";
import prisma from "@/lib/prisma";
import { TSuratPengunduran } from "@/types/struk";
import { TListUndurDiri } from "@/types/undur-diri";
import { unstable_cache } from "next/cache";

export const getListUndurDiri = unstable_cache(
  async () => {
    try {
      const listUndurDiri = await prisma.pengunduranDiri.findMany({
        include: {
          anggota: {
            select: {
              nama: true,
              unitKerja: {
                select: {
                  namaUnitKerja: true,
                },
              },
            },
          },
        },
      });
      if (listUndurDiri.length > 0) {
        return { ok: true, value: listUndurDiri as TListUndurDiri[] };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      return { ok: false, value: null };
    }
  },
  ["list-undur-diri"],
  { tags: ["list-undur-diri"] },
);

export const getSuratPengunduran = async (noPengunduran: string) => {
  try {
    const pengunduranDiri = await prisma.pengunduranDiri.findFirst({
      where: {
        noPengunduran,
      },
      include: {
        anggota: {
          select: {
            nik: true,
            nama: true,
            tanggalLahir: true,
            tempatLahir: true,
            namaBank: true,
            noRek: true,
            statusPekerjaan: true,
            unitKerja: {
              select: {
                namaUnitKerja: true,
              },
            },
          },
        },
      },
    });

    if (pengunduranDiri) {
      return { ok: true, value: pengunduranDiri as TSuratPengunduran };
    } else {
      return { ok: true, value: null };
    }
  } catch (error) {
    console.log("Error : ", error);
    return { ok: false, value: null };
  }
};
