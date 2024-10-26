"use server";
import prisma from "@/lib/prisma";
import {
  TChartBarPinjaman,
  TListPinjaman,
  TListPinjamanId,
  TMaxPelunasanPinjaman,
  TMaxPinjaman,
  TPelunasanPinjaman,
} from "@/types/pinjaman";
import { TStrukPinjaman } from "@/types/struk";
import { unstable_cache } from "next/cache";
import {
  calculateChartPinjamanAnggota,
  generateJenisPinjaman,
} from "../helper";

export const getMaxPinjamanById = unstable_cache(
  async (anggotaId: string, jenis: "BARANG" | "JASA") => {
    try {
      const pinjaman = await prisma.pinjaman.findFirst({
        where: {
          OR: [{ statusPinjaman: "APPROVED" }, { statusPinjaman: "PENDING" }],
          AND: [{ anggotaId }, { jenisPinjaman: jenis }],
        },
        select: {
          noPinjaman: true,
          tanggalPinjaman: true,
          ajuanPinjaman: true,
          statusPinjaman: true,
          AngsuranPinjaman: {
            select: {
              noAngsuranPinjaman: true,
              angsuranPinjamanKe: true,
              angsuranPinjamanDari: true,
            },
            orderBy: {
              tanggalAngsuranPinjaman: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          tanggalPinjaman: "desc",
        },
        take: 1,
      });

      if (pinjaman) {
        return { ok: true, value: pinjaman as TMaxPinjaman };
      } else {
        return { ok: true, value: null };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["max-pinjaman"],
  {
    tags: ["max-pinjaman"],
  },
);

//belum tau kena caching ato engga
export const getSecondPinjaman = async (
  anggotaId: string,
  jenis: "BARANG" | "JASA",
) => {
  try {
    const pinjaman = await prisma.pinjaman.findFirst({
      where: {
        OR: [{ statusPinjaman: "APPROVED" }, { statusPinjaman: "PENDING" }],
        AND: [{ anggotaId }, { jenisPinjaman: jenis }],
      },
      select: {
        noPinjaman: true,
        tanggalPinjaman: true,
        ajuanPinjaman: true,
        statusPinjaman: true,
        AngsuranPinjaman: {
          select: {
            noAngsuranPinjaman: true,
            angsuranPinjamanKe: true,
            angsuranPinjamanDari: true,
          },
          orderBy: {
            tanggalAngsuranPinjaman: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        tanggalPinjaman: "desc",
      },
      skip: 1,
      take: 1,
    });

    if (pinjaman) {
      return { ok: true, value: pinjaman as TMaxPinjaman };
    } else {
      return { ok: true, value: null };
    }
  } catch (error) {
    console.log("Error : ", error);
    return { ok: false, value: null };
  }
};

export const getIdPinjaman = async (jenisPinjaman: string) => {
  try {
    const jenis = generateJenisPinjaman(jenisPinjaman);
    const id = await prisma.pinjaman.findFirst({
      where: {
        noPinjaman: {
          contains: jenis,
        },
      },
      select: {
        noPinjaman: true,
      },
      orderBy: {
        tanggalPinjaman: "desc",
      },
      take: 1,
    });
    if (id) {
      return id.noPinjaman;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getIdAngsuran = async () => {
  try {
    const id = await prisma.angsuranPinjaman.findFirst({
      select: {
        noAngsuranPinjaman: true,
      },
      orderBy: {
        tanggalAngsuranPinjaman: "desc",
      },
      take: 1,
    });
    if (id) {
      return id.noAngsuranPinjaman;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getIdPelunasan = async () => {
  try {
    const id = await prisma.pelunasanPinjaman.findFirst({
      select: {
        noPelunasanPinjaman: true,
      },
      orderBy: {
        tanggalPelunasanPinjaman: "desc",
      },
      take: 1,
    });
    if (id) {
      return id.noPelunasanPinjaman;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getListPinjamanJasa = unstable_cache(
  async () => {
    try {
      const listPinjaman = await prisma.pinjaman.findMany({
        where: {
          jenisPinjaman: "JASA",
        },
        include: {
          anggota: {
            select: {
              noAnggota: true,
              nama: true,
              namaBank: true,
              noRek: true,
              noTelp: true,
              unitKerja: {
                select: {
                  namaUnitKerja: true,
                },
              },
            },
          },
          AngsuranPinjaman: true,
        },
      });
      if (listPinjaman) {
        return { ok: true, value: listPinjaman as TListPinjaman[] };
      } else {
        return { ok: true, value: null };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-pinjaman-jasa"],
  { tags: ["list-pinjaman-jasa"] },
);

export const getListPinjamanById = unstable_cache(
  async (anggotaId: string, jenisPinjaman: "JASA" | "BARANG") => {
    try {
      const listPinjaman = await prisma.pinjaman.findMany({
        where: {
          AND: [{ anggotaId }, { jenisPinjaman }],
        },
        include: {
          AngsuranPinjaman: true,
        },
      });
      if (listPinjaman) {
        return { ok: true, value: listPinjaman as TListPinjamanId[] };
      } else {
        return { ok: true, value: null };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-pinjaman-id"],
  {
    tags: ["list-pinjaman-id"],
  },
);

export const getListPinjamanBarang = unstable_cache(
  async () => {
    try {
      const listPinjaman = await prisma.pinjaman.findMany({
        where: {
          jenisPinjaman: "BARANG",
        },
        include: {
          anggota: {
            select: {
              noAnggota: true,
              nama: true,
              namaBank: true,
              noRek: true,
              noTelp: true,
              unitKerja: {
                select: {
                  namaUnitKerja: true,
                },
              },
            },
          },
          AngsuranPinjaman: true,
        },
      });
      if (listPinjaman) {
        return { ok: true, value: listPinjaman as TListPinjaman[] };
      } else {
        return { ok: true, value: null };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-pinjaman-barang"],
  {
    tags: ["list-pinjaman-barang"],
  },
);

export const getStrukPinjamanAdmin = async (pinjamanId: string) => {
  try {
    const pinjaman = await prisma.pinjaman.findFirst({
      where: {
        noPinjaman: pinjamanId,
      },
      include: {
        anggota: {
          select: {
            nama: true,
            alamat: true,
            noTelp: true,
            nik: true,
            tanggalLahir: true,
            tempatLahir: true,
            unitKerja: {
              select: {
                namaUnitKerja: true,
                alamatKantor: true,
              },
            },
            jabatan: {
              select: { namaJabatan: true },
            },
          },
        },
      },
    });
    if (pinjaman) {
      return { ok: true, value: pinjaman as TStrukPinjaman };
    } else {
      return { ok: true, value: null };
    }
  } catch (error) {
    console.log("Error : ", error);
    return { ok: false, value: null };
  }
};

export const getCountPinjaman = async (
  statusPinjaman:
    | "PENDING"
    | "PENDINGYAYASAN"
    | "APPROVED"
    | "COMPLETED"
    | "NOTCOMPLETE"
    | "REJECTED",
  jenisPinjaman: "BARANG" | "JASA",
) => {
  try {
    const countPinjaman = await prisma.pinjaman.aggregate({
      where: {
        AND: [{ jenisPinjaman }, { statusPinjaman }],
      },
      _count: {
        noPinjaman: true,
      },
    });
    if (countPinjaman) {
      return countPinjaman._count.noPinjaman;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getCountPinjamanJasaValue = unstable_cache(
  async () => {
    try {
      const [approved, completed, pending] = await Promise.all([
        getCountPinjaman("APPROVED", "JASA"),
        getCountPinjaman("COMPLETED", "JASA"),
        getCountPinjaman("PENDING", "JASA"),
      ]);

      const hasil =
        (approved ? approved : 0) +
        (completed ? completed : 0) +
        (pending ? pending : 0);

      return { hasil, approved, completed, pending };
    } catch (error) {
      return null;
    }
  },
  ["count-pinjaman-jasa-anggota"],
  { tags: ["count-pinjaman-jasa-anggota"] },
);

export const getCountPinjamanBarangValue = unstable_cache(
  async () => {
    try {
      const [approved, completed, pending] = await Promise.all([
        getCountPinjaman("APPROVED", "BARANG"),
        getCountPinjaman("COMPLETED", "BARANG"),
        getCountPinjaman("PENDING", "BARANG"),
      ]);

      const hasil =
        (approved ? approved : 0) +
        (completed ? completed : 0) +
        (pending ? pending : 0);

      return { hasil, approved, completed, pending };
    } catch (error) {
      return null;
    }
  },
  ["count-pinjaman-barang-anggota"],
  { tags: ["count-pinjaman-barang-anggota"] },
);

export const getMaxAngsuran = unstable_cache(
  async (noPinjaman: string) => {
    try {
      const angsuran = await prisma.pinjaman.findFirst({
        where: {
          AND: [{ noPinjaman }, { statusPinjaman: "APPROVED" }],
        },
        select: {
          noPinjaman: true,
          tujuanPinjaman: true,
          waktuPengembalian: true,
          ajuanPinjaman: true,
          AngsuranPinjaman: {
            select: {
              tanggalAngsuranPinjaman: true,
              angsuranPinjamanKe: true,
              angsuranPinjamanDari: true,
              jumlahAngsuranPinjaman: true,
            },
          },
        },
        orderBy: {
          tanggalPinjaman: "desc",
        },
        take: 1,
      });
      if (angsuran) {
        return angsuran as TMaxPelunasanPinjaman;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  },
  ["list-angsuran"],
  { tags: ["list-angsuran"] },
);

export const getMaxPinjaman = unstable_cache(
  async (anggotaId: string) => {
    try {
      const pelunasan = await prisma.pinjaman.findMany({
        where: {
          PelunasanPinjaman: {
            none: {},
          },
          AND: [{ anggotaId }, { statusPinjaman: "APPROVED" }],
        },
        select: {
          noPinjaman: true,
        },
      });
      if (pelunasan) {
        return { ok: true, value: pelunasan as TPelunasanPinjaman[] };
      } else {
        return { ok: true, value: null };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["max-pelunasan"],
  { tags: ["max-pelunasan"] },
);

const sumChartPinjamanAnggota = async (maxPinjaman: TMaxPinjaman | null) => {
  if (maxPinjaman !== null) {
    const pinjaman = await getMaxAngsuran(maxPinjaman.noPinjaman);
    if (pinjaman) {
      const hasil = calculateChartPinjamanAnggota(pinjaman);
      return hasil;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const getChartPinjamanAnggota = async (anggotaId: string) => {
  try {
    const [maxPinjamanJasa, maxPinjamanBarang] = await Promise.all([
      getMaxPinjamanById(anggotaId, "JASA"),
      getMaxPinjamanById(anggotaId, "BARANG"),
    ]);
    if (!maxPinjamanJasa.ok || !maxPinjamanBarang.ok) {
      return {
        ok: false,
        value: null,
      };
    }
    const [pinjamanJasa, pinjamanBarang] = await Promise.all([
      sumChartPinjamanAnggota(maxPinjamanJasa.value),
      sumChartPinjamanAnggota(maxPinjamanBarang.value),
    ]);

    const hasil: TChartBarPinjaman = {
      produktif: pinjamanJasa,
      barang: pinjamanBarang,
    };

    return { ok: true, value: hasil as TChartBarPinjaman };
  } catch (error) {
    console.log("Error : ", error);
    return { ok: false, value: null };
  }
};
