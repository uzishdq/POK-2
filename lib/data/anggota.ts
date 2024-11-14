"use server";
import { TAnggota, TListAnggota } from "@/types/anggota";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { getSesi } from "../session";

export const getPhoneByEmail = async (noAnggota: string) => {
  try {
    const phone = await prisma.anggota.findUnique({
      where: {
        noAnggota,
      },
      select: {
        nama: true,
        noTelp: true,
        unitKerja: {
          select: {
            namaUnitKerja: true,
          },
        },
      },
    });
    if (phone) {
      return phone;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error : ", error);
    return null;
  }
};

export const getListPhone = async () => {
  try {
    const phone = await prisma.anggota.findMany({
      where: {
        AND: [{ statusAnggota: "ACTIVE" }, { noTelp: { not: null } }],
      },
      select: {
        noAnggota: true,
        nama: true,
        noTelp: true,
      },
    });
    if (phone) {
      return phone;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error : ", error);
    return null;
  }
};

export const getPhoneByEmailRole = async () => {
  try {
    const phoneRole = await prisma.user.findMany({
      where: {
        AND: [
          {
            role: {
              in: ["ADMIN", "BENDAHARA"],
            },
          },
          { statusUser: "APPROVED" },
        ],
      },
      select: {
        role: true,
        Anggota: {
          where: {
            noTelp: { not: null },
          },
          select: {
            nama: true,
            noTelp: true,
          },
        },
      },
    });
    if (phoneRole) {
      return phoneRole;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error : ", error);
    return null;
  }
};

export const getAnggotaByEmail = async (userEmail: string) => {
  try {
    const anggota = await prisma.anggota.findFirst({
      where: {
        userEmail,
      },
    });

    if (anggota) {
      return anggota as TAnggota;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error : ", error);
    return null;
  }
};

export const getProfile = unstable_cache(
  async (noAnggota: string) => {
    try {
      const profile = await prisma.anggota.findUnique({
        where: {
          noAnggota,
        },
        select: {
          noAnggota: true,
          nik: true,
          nip: true,
          nama: true,
          tanggalLahir: true,
          tempatLahir: true,
          jenisKelamin: true,
          alamat: true,
          noTelp: true,
          jabatanId: true,
          statusPekerjaan: true,
          unitKerjaId: true,
          namaBank: true,
          noRek: true,
          pilManasuka: true,
        },
      });

      if (profile) {
        return profile as TAnggota;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error : ", error);
      return null;
    }
  },
  ["profile"],
  {
    tags: ["profile"],
  },
);

export const getTanggalLahirById = unstable_cache(
  async (noAnggota: string) => {
    try {
      const session = await getSesi();

      if (!session) {
        return null;
      }
      const tgl = await prisma.anggota.findFirst({
        where: {
          noAnggota,
        },
        select: {
          tanggalLahir: true,
        },
      });
      if (tgl) {
        return tgl;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error : ", error);
      return null;
    }
  },
  ["get-tanggal-lahir"],
  {
    tags: ["get-tanggal-lahir"],
  },
);

export const getPhoneByPinjamanId = async (pinjamanId: string) => {
  try {
    const phone = await prisma.pinjaman.findUnique({
      where: {
        noPinjaman: pinjamanId,
      },
      select: {
        anggota: {
          select: {
            nama: true,
            noTelp: true,
            unitKerja: {
              select: {
                namaUnitKerja: true,
              },
            },
          },
        },
      },
    });

    if (phone) {
      return phone.anggota;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error : ", error);
    return null;
  }
};

export const getListAnggota = unstable_cache(
  async () => {
    try {
      const anggota = await prisma.anggota.findMany({
        select: {
          noAnggota: true,
          nama: true,
          unitKerja: {
            select: {
              namaUnitKerja: true,
            },
          },
          jabatan: {
            select: {
              namaJabatan: true,
            },
          },
          pilManasuka: true,
          statusPekerjaan: true,
          statusAnggota: true,
        },
      });
      if (anggota) {
        return { ok: true, value: anggota as TListAnggota[] };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-anggota-koperasi"],
  { tags: ["list-anggota-koperasi"] },
);

export const getTotalAnggota = unstable_cache(
  async () => {
    try {
      const aktif = await prisma.anggota.aggregate({
        where: {
          statusAnggota: "ACTIVE",
        },
        _count: {
          noAnggota: true,
        },
      });
      const noAktif = await prisma.anggota.aggregate({
        where: {
          statusAnggota: "NOTACTIVE",
        },
        _count: {
          noAnggota: true,
        },
      });

      const total = {
        anggotaAktif: aktif._count.noAnggota,
        anggotaTidakAktif: noAktif._count.noAnggota,
      };
      return { ok: true, value: total };
    } catch (error) {
      console.log("Error :", error);
      return { ok: false, value: null };
    }
  },
  ["total-anggota-koperasi"],
  {
    tags: ["total-anggota-koperasi"],
  },
);
