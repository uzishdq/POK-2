"use server";
import prisma from "@/lib/prisma";
import {
  BalanceType,
  TAllBalanceSimpanan,
  TBalanceSimpanan,
  TChartBarSimpanan,
  TListSimpananBerjangka,
  TPendaftaranSimpananCard,
  TPengambilanSimpanan,
  TPengambilanSimpananAnggota,
  TSimpanan,
  TSimpananBerjangka,
  TTotalBalance,
  TTotalSimpanan,
} from "@/types/simpanan";
import { unstable_cache } from "next/cache";
import {
  balanceSimpanan,
  generateSimpananBerjangka,
  IDRToNumber,
  JenisSimpanan,
  pengurangan2Data,
  penguranganTotalSimpanan,
} from "../helper";
import { TStrukPengambilanSimpanan } from "@/types/struk";

export const getSimpananBerjangkaPetugas = unstable_cache(
  async () => {
    try {
      const listBerjangka = await prisma.pendaftaranSimpanan.findMany({
        include: {
          Pendaftar: {
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
              jumlahPilihan: true,
            },
          },
        },
      });
      if (listBerjangka) {
        return {
          ok: true,
          value: listBerjangka as TListSimpananBerjangka[],
        };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-simpanan-berjangka"],
  {
    tags: ["list-simpanan-berjangka"],
  },
);

export const getCobaBerjangka = async () => {
  try {
    const listBerjangka = await prisma.pendaftaranSimpanan.findMany({
      include: {
        Pendaftar: {
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
            jumlahPilihan: true,
          },
        },
      },
    });
    if (listBerjangka) {
      return {
        ok: true,
        value: listBerjangka as TListSimpananBerjangka[],
      };
    } else {
      return { ok: true, value: [] };
    }
  } catch (error) {
    console.log("Error : ", error);
    return { ok: false, value: null };
  }
};

export const getTotalSimpananById = unstable_cache(
  async (anggotaId: string, jenisSimpanan: string) => {
    try {
      const pengambilanSimpanan = await prisma.pengambilanSimpanan.aggregate({
        _sum: { jumlahPengambilanSimpanan: true },
        where: {
          AND: [
            { anggotaId },
            { jenisPengambilanSimpanan: jenisSimpanan },
            { statusPengambilanSimpanan: "APPROVED" },
          ],
        },
      });

      const totalSimpanan = await prisma.simpanan.aggregate({
        _sum: { jumlahSimpanan: true },
        where: {
          AND: [{ anggotaId }, { jenisSimpanan }],
        },
      });

      if (totalSimpanan && pengambilanSimpanan) {
        const total = penguranganTotalSimpanan(
          totalSimpanan._sum.jumlahSimpanan,
          pengambilanSimpanan._sum.jumlahPengambilanSimpanan,
        );
        return { ok: true, value: total };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["total-simpanan"],
  {
    tags: ["total-simpanan"],
  },
);

export const getAllSimpananbyId = async (anggotaId: string) => {
  try {
    const [
      totalSimpananWajib,
      totalSimpananSukamana,
      totalSimpananLebaran,
      totalSimpananQurban,
      totalSimpananUbar,
    ] = await Promise.all([
      getTotalSimpananById(anggotaId, "WAJIB"),
      getTotalSimpananById(anggotaId, "MANASUKA"),
      getTotalSimpananById(anggotaId, "LEBARAN"),
      getTotalSimpananById(anggotaId, "QURBAN"),
      getTotalSimpananById(anggotaId, "UBAR"),
    ]);
    if (
      !totalSimpananWajib?.ok ||
      !totalSimpananSukamana?.ok ||
      !totalSimpananLebaran?.ok ||
      !totalSimpananQurban?.ok ||
      !totalSimpananUbar?.ok
    ) {
      return {
        ok: false,
        value: null,
      };
    } else {
      return {
        ok: true,
        value:
          IDRToNumber(totalSimpananWajib.value) +
          IDRToNumber(totalSimpananSukamana.value) +
          IDRToNumber(totalSimpananLebaran.value) +
          IDRToNumber(totalSimpananQurban.value) +
          IDRToNumber(totalSimpananUbar.value),
      };
    }
  } catch (error) {
    return {
      ok: false,
      value: null,
    };
  }
};

export const getChartSimpananById = async (anggotaId: string) => {
  try {
    const [
      totalSimpananWajib,
      totalSimpananSukamana,
      totalSimpananLebaran,
      totalSimpananQurban,
      totalSimpananUbar,
    ] = await Promise.all([
      getTotalSimpananById(anggotaId, "WAJIB"),
      getTotalSimpananById(anggotaId, "MANASUKA"),
      getTotalSimpananById(anggotaId, "LEBARAN"),
      getTotalSimpananById(anggotaId, "QURBAN"),
      getTotalSimpananById(anggotaId, "UBAR"),
    ]);
    if (
      !totalSimpananWajib?.ok ||
      !totalSimpananSukamana?.ok ||
      !totalSimpananLebaran?.ok ||
      !totalSimpananQurban?.ok ||
      !totalSimpananUbar?.ok
    ) {
      return {
        ok: false,
        value: null,
      };
    } else {
      const barChart: TChartBarSimpanan = {
        wajib: IDRToNumber(totalSimpananWajib.value),
        sukamana: IDRToNumber(totalSimpananSukamana.value),
        lebaran: IDRToNumber(totalSimpananLebaran.value),
        qurban: IDRToNumber(totalSimpananQurban.value),
        ubar: IDRToNumber(totalSimpananUbar.value),
      };
      return {
        ok: true,
        value: barChart as TChartBarSimpanan,
      };
    }
  } catch (error) {
    return {
      ok: false,
      value: null,
    };
  }
};

export const getTotalPengambilanById = async (
  anggotaId: string,
  jenisSimpanan: string,
) => {
  try {
    const pengambilanSimpanan = await prisma.pengambilanSimpanan.aggregate({
      _sum: { jumlahPengambilanSimpanan: true },
      where: {
        AND: [
          { anggotaId },
          { jenisPengambilanSimpanan: jenisSimpanan },
          { statusPengambilanSimpanan: "APPROVED" },
        ],
      },
    });

    if (pengambilanSimpanan) {
      const total = pengambilanSimpanan._sum.jumlahPengambilanSimpanan;
      return total;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error : ", error);
    return null;
  }
};

export const getTotalPengambilanAnggota = async (jenisSimpanan: string) => {
  try {
    const pengambilanSimpanan = await prisma.pengambilanSimpanan.aggregate({
      _sum: { jumlahPengambilanSimpanan: true },
      where: {
        AND: [
          { jenisPengambilanSimpanan: jenisSimpanan },
          { statusPengambilanSimpanan: "APPROVED" },
        ],
      },
    });

    if (pengambilanSimpanan) {
      const total = pengambilanSimpanan._sum.jumlahPengambilanSimpanan;
      return total;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error : ", error);
    return null;
  }
};

export const getSimpananById = unstable_cache(
  async (anggotaId: string, jenisSimpanan: string) => {
    try {
      const simpananWajib = await prisma.simpanan.findMany({
        where: {
          AND: [{ anggotaId }, { jenisSimpanan }],
        },
      });

      if (simpananWajib.length > 0) {
        return { ok: true, value: simpananWajib as TSimpanan[] };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["potongan-gaji"],
  {
    tags: ["potongan-gaji"],
  },
);

export const getPengambilanSimpananById = unstable_cache(
  async (anggotaId: string) => {
    try {
      const pengambilanSimpanan = await prisma.pengambilanSimpanan.findMany({
        where: {
          anggotaId,
        },
      });

      if (pengambilanSimpanan.length > 0) {
        return {
          ok: true,
          value: pengambilanSimpanan as TPengambilanSimpanan[],
        };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-pengambilan"],
  {
    tags: ["list-pengambilan"],
  },
);

export const getPengambilanSimpananAnggota = unstable_cache(
  async () => {
    try {
      const pengambilanSimpanan = await prisma.pengambilanSimpanan.findMany({
        where: {
          OR: [
            { statusPengambilanSimpanan: "PENDING" },
            { statusPengambilanSimpanan: "REJECTED" },
          ],
        },
        include: {
          anggota: {
            select: {
              nama: true,
              namaBank: true,
              noRek: true,
              unitKerja: {
                select: {
                  namaUnitKerja: true,
                },
              },
            },
          },
        },
      });

      if (pengambilanSimpanan.length > 0) {
        return {
          ok: true,
          value: pengambilanSimpanan as TPengambilanSimpananAnggota[],
        };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-pengambilan"],
  {
    tags: ["list-pengambilan"],
  },
);

export const getPengambilanSimpananApprovedAnggota = unstable_cache(
  async () => {
    try {
      const pengambilanSimpanan = await prisma.pengambilanSimpanan.findMany({
        where: {
          statusPengambilanSimpanan: "APPROVED",
        },
        include: {
          anggota: {
            select: {
              nama: true,
              namaBank: true,
              noRek: true,
              unitKerja: {
                select: {
                  namaUnitKerja: true,
                },
              },
            },
          },
        },
      });

      if (pengambilanSimpanan.length > 0) {
        return {
          ok: true,
          value: pengambilanSimpanan as TPengambilanSimpananAnggota[],
        };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-pengambilan"],
  {
    tags: ["list-pengambilan"],
  },
);

export const getPendaftaranSimpanan = unstable_cache(
  async (jenisPendaftaran: string) => {
    try {
      const pendaftaran = await prisma.pendaftaranSimpanan.findFirst({
        where: {
          jenisPendaftaran,
        },
        select: {
          noPendaftaran: true,
          namaPendaftaran: true,
          tanggalTutupPendaftaran: true,
          tanggalAwalSimpanan: true,
          tanggalAkhirSimpanan: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      });

      if (pendaftaran) {
        return { ok: true, value: pendaftaran as TPendaftaranSimpananCard };
      } else {
        return { ok: true, value: null };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-simpanan-berjangka"],
  {
    tags: ["list-simpanan-berjangka"],
  },
);

export const getTotalPendaftaranSimpanan = async (jenisPendaftaran: string) => {
  try {
    const pendaftaran = await getPendaftaranSimpanan(jenisPendaftaran);

    if (pendaftaran.ok && pendaftaran.value) {
      const pendaftar = await prisma.pendaftar.aggregate({
        _count: { anggotaId: true },
        where: {
          pendaftaranId: pendaftaran.value.noPendaftaran,
        },
      });
      if (pendaftar) {
        const total = pendaftar._count.anggotaId;
        const nama = pendaftaran.value.namaPendaftaran;
        return { total, nama };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error : ", error);
    return null;
  }
};

export const getTotalPendaftaranSimpananValue = unstable_cache(
  async () => {
    try {
      const [ubar, lebaran, qurban] = await Promise.all([
        getTotalPendaftaranSimpanan("simpanan-ubar"),
        getTotalPendaftaranSimpanan("simpanan-lebaran"),
        getTotalPendaftaranSimpanan("simpanan-qurban"),
      ]);

      const hasil =
        (ubar?.total ? ubar.total : 0) +
        (lebaran?.total ? lebaran.total : 0) +
        (qurban?.total ? qurban.total : 0);

      return { ubar, lebaran, qurban, hasil };
    } catch (error) {
      return null;
    }
  },
  ["total-pendaftar"],
  {
    tags: ["total-pendaftar"],
  },
);

export const getCoba = unstable_cache(
  async () => {
    try {
      const listSimpananBerjangka = await prisma.pendaftaranSimpanan.findMany({
        include: {
          Pendaftar: {
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
          },
        },
      });

      if (listSimpananBerjangka.length > 0) {
        return {
          ok: true,
          value: listSimpananBerjangka,
        };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-simpanan-berjangka"],
  {
    tags: ["list-simpanan-berjangka"],
  },
);

export const getIdPengambilanSimpanan = async () => {
  try {
    const id = await prisma.pengambilanSimpanan.findFirst({
      select: {
        noPengambilanSimpanan: true,
      },
      orderBy: {
        tanggalPengambilanSimpanan: "desc",
      },
      take: 1,
    });

    if (id) {
      return id.noPengambilanSimpanan;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getIdSimpanan = async () => {
  try {
    const id = await prisma.simpanan.findFirst({
      select: {
        noSimpanan: true,
      },
      orderBy: {
        tanggalSimpanan: "desc",
      },
      take: 1,
    });
    if (id) {
      return id.noSimpanan;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getMaxSimpananById = async (
  anggotaId: string,
  jenisSimpanan: string,
) => {
  try {
    const pengambilanSimpanan = await prisma.pengambilanSimpanan.aggregate({
      _sum: { jumlahPengambilanSimpanan: true },
      where: {
        AND: [
          { anggotaId },
          { jenisPengambilanSimpanan: jenisSimpanan },
          {
            OR: [
              { statusPengambilanSimpanan: "APPROVED" },
              { statusPengambilanSimpanan: "PENDING" },
            ],
          },
        ],
      },
    });

    const totalSimpanan = await prisma.simpanan.aggregate({
      _sum: { jumlahSimpanan: true },
      where: {
        AND: [{ anggotaId }, { jenisSimpanan }],
      },
    });

    if (totalSimpanan && pengambilanSimpanan) {
      const hasil = pengurangan2Data(
        totalSimpanan._sum.jumlahSimpanan,
        pengambilanSimpanan._sum.jumlahPengambilanSimpanan,
      );
      return hasil;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error : ", error);
    return null;
  }
};

//revalidate buat potongan gaji
export const getPengambilanSimpananValueById = unstable_cache(
  async (anggotaId: string) => {
    try {
      const [sukamana, lebaran, qurban] = await Promise.all([
        getMaxSimpananById(anggotaId, "MANASUKA"),
        getMaxSimpananById(anggotaId, "LEBARAN"),
        getMaxSimpananById(anggotaId, "QURBAN"),
      ]);

      return { sukamana, lebaran, qurban };
    } catch (error) {
      return null;
    }
  },
  ["max-simpanan"],
  {
    tags: ["max-simpanan"],
  },
);

export const getTotalPengambilanSimpananValueById = unstable_cache(
  async (anggotaId: string) => {
    try {
      const [sukamana, lebaran, qurban] = await Promise.all([
        getTotalPengambilanById(anggotaId, "MANASUKA"),
        getTotalPengambilanById(anggotaId, "LEBARAN"),
        getTotalPengambilanById(anggotaId, "QURBAN"),
      ]);

      const hasil =
        (sukamana ? sukamana : 0) +
        (lebaran ? lebaran : 0) +
        (qurban ? qurban : 0);

      return { sukamana, lebaran, qurban, hasil };
    } catch (error) {
      return null;
    }
  },
  ["total-pengambilan-simpanan"],
  {
    tags: ["total-pengambilan-simpanan"],
  },
);

export const getTotalPengambilanSimpananValueAnggota = unstable_cache(
  async () => {
    try {
      const [sukamana, lebaran, qurban] = await Promise.all([
        getTotalPengambilanAnggota("MANASUKA"),
        getTotalPengambilanAnggota("LEBARAN"),
        getTotalPengambilanAnggota("QURBAN"),
      ]);

      const hasil =
        (sukamana ? sukamana : 0) +
        (lebaran ? lebaran : 0) +
        (qurban ? qurban : 0);

      return { sukamana, lebaran, qurban, hasil };
    } catch (error) {
      return null;
    }
  },
  ["total-pengambilan-simpanan"],
  {
    tags: ["total-pengambilan-simpanan"],
  },
);

//revalidate buat potongan gaji
export const getMaxBesaranPinjamanById = unstable_cache(
  async (anggotaId: string) => {
    try {
      const [sukamana, wajib] = await Promise.all([
        getMaxSimpananById(anggotaId, "MANASUKA"),
        getMaxSimpananById(anggotaId, "WAJIB"),
      ]);

      let hasil = ((sukamana ? sukamana : 0) + (wajib ? wajib : 0)) * 15;
      hasil = hasil >= 50000000 ? 50000000 : hasil;
      return hasil;
    } catch (error) {
      return null;
    }
  },
  ["max-besaran-pinjaman"],
  {
    tags: ["max-besaran-pinjaman"],
  },
);

export const getStrukPengambilanSimpanan = async (
  noPengambilanSimpanan: string,
) => {
  try {
    const strukPengambilanSimpanan =
      await prisma.pengambilanSimpanan.findUnique({
        where: {
          noPengambilanSimpanan,
        },
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
    if (strukPengambilanSimpanan) {
      return {
        ok: true,
        value: strukPengambilanSimpanan as TStrukPengambilanSimpanan,
      };
    } else {
      return { ok: true, value: null };
    }
  } catch (error) {
    console.log("Error : ", error);
    return { ok: false, value: null };
  }
};

export const getListSimpananAnggota = unstable_cache(
  async () => {
    try {
      const types = ["WAJIB", "MANASUKA", "LEBARAN", "QURBAN", "UBAR"];
      const results = await prisma.anggota.findMany({
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
            select: {
              jenisSimpanan: true,
              jumlahSimpanan: true,
            },
          },
          PengambilanSimpanan: {
            where: {
              statusPengambilanSimpanan: "APPROVED",
            },
            select: {
              jenisPengambilanSimpanan: true,
              jumlahPengambilanSimpanan: true,
            },
          },
        },
      });

      if (results) {
        const userBalance: TTotalBalance[] = results.map((user) => {
          const balances: Record<BalanceType, number> = {
            WAJIB: 0,
            MANASUKA: 0,
            LEBARAN: 0,
            QURBAN: 0,
            UBAR: 0,
          };

          types.forEach((type) => {
            const totalSimpanan = user.Simpanan.filter(
              (simpanan) => simpanan.jenisSimpanan === type,
            ).reduce((sum, simpanan) => sum + simpanan.jumlahSimpanan, 0);

            const totalPengambilan = user.PengambilanSimpanan.filter(
              (pengambilan) => pengambilan.jenisPengambilanSimpanan === type,
            ).reduce(
              (sum, pengambilan) => sum + pengambilan.jumlahPengambilanSimpanan,
              0,
            );

            balances[type as BalanceType] = totalSimpanan - totalPengambilan;
          });

          const total =
            balances.WAJIB +
            balances.MANASUKA +
            balances.LEBARAN +
            balances.QURBAN +
            balances.UBAR;

          const pengambilan = user.PengambilanSimpanan.reduce(
            (sum, pengambilan) => sum + pengambilan.jumlahPengambilanSimpanan,
            0,
          );

          return {
            noAnggota: user.noAnggota,
            nama: user.nama,
            unitKerja: user.unitKerja.namaUnitKerja,
            wajib: balances.WAJIB,
            manasuka: balances.MANASUKA,
            lebaran: balances.LEBARAN,
            qurban: balances.QURBAN,
            ubar: balances.UBAR,
            totalPengambilan: pengambilan,
            total,
          };
        });
        return { ok: true, value: userBalance as TTotalBalance[] };
      } else {
        return { ok: false, value: [] };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["list-simpanan-anggota"],
  { tags: ["list-simpanan-anggota"] },
);

export const getTotalSimpananAnggota = unstable_cache(
  async (jenis: string) => {
    try {
      const pengambilan = await prisma.pengambilanSimpanan.aggregate({
        where: {
          AND: [
            {
              anggota: {
                statusAnggota: "ACTIVE",
              },
            },
            { jenisPengambilanSimpanan: jenis },
            { statusPengambilanSimpanan: "APPROVED" },
          ],
        },
        _sum: {
          jumlahPengambilanSimpanan: true,
        },
      });

      const simpanan = await prisma.simpanan.aggregate({
        where: {
          AND: [
            { anggota: { statusAnggota: "ACTIVE" } },
            { jenisSimpanan: jenis },
          ],
        },
        _sum: {
          jumlahSimpanan: true,
        },
      });

      if (pengambilan && simpanan) {
        const hasil = balanceSimpanan(
          simpanan._sum.jumlahSimpanan,
          pengambilan._sum.jumlahPengambilanSimpanan,
          jenis,
        );
        return { ok: true, value: hasil as TBalanceSimpanan };
      } else {
        return { ok: false, value: null };
      }
    } catch (error) {
      console.log("Error : ", error);
      return { ok: false, value: null };
    }
  },
  ["total-simpanan-anggota"],
  { tags: ["total-simpanan-anggota"] },
);

export const getAllSimpananAnggota = async () => {
  try {
    const [
      SimpananWajib,
      SimpananSukamana,
      SimpananLebaran,
      SimpananQurban,
      SimpananUbar,
    ] = await Promise.all([
      getTotalSimpananAnggota("WAJIB"),
      getTotalSimpananAnggota("MANASUKA"),
      getTotalSimpananAnggota("LEBARAN"),
      getTotalSimpananAnggota("QURBAN"),
      getTotalSimpananAnggota("UBAR"),
    ]);
    if (
      !SimpananWajib.ok ||
      !SimpananSukamana.ok ||
      !SimpananLebaran.ok ||
      !SimpananQurban.ok ||
      !SimpananUbar.ok
    ) {
      return {
        ok: false,
        value: null,
      };
    } else {
      const totalBalance =
        (SimpananWajib.value?.balance ?? 0) +
        (SimpananSukamana.value?.balance ?? 0) +
        (SimpananLebaran.value?.balance ?? 0) +
        (SimpananQurban.value?.balance ?? 0) +
        (SimpananUbar.value?.balance ?? 0);

      const totalPengambilan =
        (SimpananWajib.value?.totalPengambilan ?? 0) +
        (SimpananSukamana.value?.totalPengambilan ?? 0) +
        (SimpananLebaran.value?.totalPengambilan ?? 0) +
        (SimpananQurban.value?.totalPengambilan ?? 0) +
        (SimpananUbar.value?.totalPengambilan ?? 0);
      const balance: TAllBalanceSimpanan = {
        wajib: SimpananWajib.value,
        sukamana: SimpananSukamana.value,
        lebaran: SimpananLebaran.value,
        qurban: SimpananQurban.value,
        ubar: SimpananUbar.value,
        totalBalance,
        totalPengambilan,
      };
      return { ok: true, value: balance as TAllBalanceSimpanan };
    }
  } catch (error) {
    return {
      ok: false,
      value: null,
    };
  }
};

// tambahin data pendaftaran untuk pengambilan simpanan berjangka
export const getSimpananBerjangka = async (jenis: string) => {
  try {
    const simpananBerjangka = await getPendaftaranSimpanan(jenis);

    if (!simpananBerjangka.ok && !simpananBerjangka.value) {
      return {
        ok: false,
        value: null,
      };
    }
    const data = {
      dateStart: simpananBerjangka.value?.tanggalAwalSimpanan ?? new Date(),
      dateEnd: simpananBerjangka.value?.tanggalAkhirSimpanan ?? new Date(),
      jenisSimpanan: jenis
        .replace("simpanan-", "")
        .toUpperCase() as JenisSimpanan,
    };

    const simpanan = await prisma.pendaftar.findMany({
      where: {
        AND: [
          {
            anggota: {
              statusAnggota: "ACTIVE",
            },
          },
          { pendaftaranId: simpananBerjangka.value?.noPendaftaran },
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
            Simpanan: {
              where: {
                AND: [
                  {
                    tanggalSimpanan: {
                      gte: data.dateStart,
                      lte: data.dateEnd,
                    },
                  },
                  {
                    jenisSimpanan: data.jenisSimpanan,
                  },
                ],
              },
              select: {
                tanggalSimpanan: true,
                jumlahSimpanan: true,
                jenisSimpanan: true,
              },
            },
            PengambilanSimpanan: {
              where: {
                AND: [
                  {
                    tanggalPengambilanSimpanan: {
                      gte: data.dateStart,
                      lte: data.dateEnd,
                    },
                  },
                  {
                    jenisPengambilanSimpanan: data.jenisSimpanan,
                  },
                ],
              },
              select: {
                tanggalPengambilanSimpanan: true,
                jumlahPengambilanSimpanan: true,
                jenisPengambilanSimpanan: true,
              },
            },
          },
        },
      },
    });

    if (simpanan) {
      return {
        ok: true,
        value: generateSimpananBerjangka(
          simpanan,
          data.dateStart,
          data.dateEnd,
          data.jenisSimpanan,
        ),
      };
    } else {
      return {
        ok: true,
        value: [],
      };
    }
  } catch (error) {
    return {
      ok: false,
      value: null,
    };
  }
};
