"use server";

import * as z from "zod";
import prisma from "../prisma";
import { laporanPinjamanSchema } from "../schema/laporan-pinjaman-schema";
import { transformLaporanPinjaman, transformLaporanSimpanan } from "../helper";
import { TLaporanPinjaman, TLaporanSimpanan } from "@/types/laporan";
import { laporanSimpananSchema } from "../schema/laporan-simpanan-schema";

export const getLaporanPinjaman = async (
  values: z.infer<typeof laporanPinjamanSchema>,
) => {
  try {
    const validateValues = laporanPinjamanSchema.safeParse(values);
    if (!validateValues.success) {
      return {
        ok: false,
        message: "Invalid Field!",
        value: null,
      };
    }

    const pinjaman = await prisma.pinjaman.findMany({
      where: {
        AND: [
          {
            jenisPinjaman: validateValues.data.jenisPinjaman,
          },
          {
            statusPinjaman: validateValues.data.statusPinjaman,
          },
        ],
      },
      select: {
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
        noPinjaman: true,
        tanggalPinjaman: true,
        ajuanPinjaman: true,
        jenisPinjaman: true,
        statusPinjaman: true,
        waktuPengembalian: true,
        AngsuranPinjaman: {
          where: {
            angsuranPinjamanKe: {
              gt: 0,
            },
          },
          select: {
            angsuranPinjamanKe: true,
            jumlahAngsuranPinjaman: true,
          },
        },
      },
    });

    if (pinjaman.length > 0) {
      return {
        ok: true,
        message: "Data Ditemukan",
        value: transformLaporanPinjaman(pinjaman) as TLaporanPinjaman[],
      };
    } else {
      return {
        ok: false,
        message: "Data Kosong",
        value: null,
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: "Invalid Field!",
      value: null,
    };
  }
};

export const getLaporanSimpanan = async (
  values: z.infer<typeof laporanSimpananSchema>,
) => {
  try {
    const validateValues = laporanSimpananSchema.safeParse(values);
    if (!validateValues.success) {
      return {
        ok: false,
        message: "Invalid Field!",
        value: null,
      };
    }
    switch (validateValues.data.jenisLaporanSimpanan) {
      case "laporan-simpanan-wajib-sukamana":
        const simpanan = await prisma.anggota.findMany({
          where: {
            statusAnggota: "ACTIVE",
          },
          select: {
            noAnggota: true,
            nama: true,
            unitKerja: {
              select: {
                namaUnitKerja: true,
              },
            },
            Simpanan: {
              where: {
                AND: [
                  {
                    OR: [
                      { jenisSimpanan: "WAJIB" },
                      { jenisSimpanan: "MANASUKA" },
                    ],
                  },
                  {
                    tanggalSimpanan: {
                      gte: validateValues.data.date.from,
                      lte: validateValues.data.date.to,
                    },
                  },
                ],
              },
              select: {
                jenisSimpanan: true,
                tanggalSimpanan: true,
                jumlahSimpanan: true,
              },
            },
            PengambilanSimpanan: {
              where: {
                AND: [
                  {
                    OR: [
                      { jenisPengambilanSimpanan: "WAJIB" },
                      { jenisPengambilanSimpanan: "MANASUKA" },
                    ],
                  },
                  {
                    tanggalPengambilanSimpanan: {
                      gte: validateValues.data.date.from,
                      lte: validateValues.data.date.to,
                    },
                  },
                ],
              },
              select: {
                jenisPengambilanSimpanan: true,
                tanggalPengambilanSimpanan: true,
                jumlahPengambilanSimpanan: true,
              },
            },
          },
        });
        if (simpanan.length > 0) {
          return {
            ok: true,
            message: "Data Ditemukan",
            value: transformLaporanSimpanan(
              simpanan,
              validateValues.data.date.from as Date,
              validateValues.data.date.to as Date,
            ) as TLaporanSimpanan[],
          };
        } else {
          return {
            ok: false,
            message: "Data Kosong",
            value: null,
          };
        }

      default:
        return {
          ok: false,
          message: "Data Kosong",
          value: null,
        };
    }
  } catch (error) {
    return {
      ok: false,
      message: "Invalid Field!",
      value: null,
    };
  }
};
