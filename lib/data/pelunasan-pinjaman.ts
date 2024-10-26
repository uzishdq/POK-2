"use server";
import prisma from "@/lib/prisma";
import { TListPelunasanPinjaman } from "@/types/pinjaman";
import { unstable_cache } from "next/cache";

export const getListPelunasanPinjaman = unstable_cache(
  async () => {
    try {
      const listPelunasan = await prisma.pelunasanPinjaman.findMany({
        include: {
          pinjaman: {
            select: {
              ajuanPinjaman: true,
              waktuPengembalian: true,
              anggota: {
                select: {
                  noAnggota: true,
                  nama: true,
                  unitKerja: {
                    select: {
                      namaUnitKerja: true,
                    },
                  },
                },
              },
              AngsuranPinjaman: true,
            },
          },
        },
      });

      if (listPelunasan) {
        return { ok: true, value: listPelunasan as TListPelunasanPinjaman[] };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-pelunasan-pinjaman-petugas"],
  {
    tags: ["list-pelunasan-pinjaman-petugas"],
  },
);
