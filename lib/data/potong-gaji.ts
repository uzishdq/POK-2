"use server";
import prisma from "@/lib/prisma";
import { getPendaftaranSimpanan } from "./simpanan";
import {
  TDataPotongan,
  TPotongGaji,
  TPotonganApproved,
} from "@/types/potongan";
import { unstable_cache } from "next/cache";
import { TPendaftaranSimpananCard } from "@/types/simpanan";

export const getIdPotonganGaji = async () => {
  try {
    const noPotongan = await prisma.potongGaji.aggregate({
      _max: {
        idPotonganGaji: true,
      },
    });
    const nextId = noPotongan._max.idPotonganGaji;
    return nextId;
  } catch (error) {
    return null;
  }
};

const getPotonganAngsuran = async (jenisPinjaman: "JASA" | "BARANG") => {
  try {
    const angsuran = await prisma.pinjaman.findMany({
      where: {
        AND: [{ statusPinjaman: "APPROVED" }, { jenisPinjaman }],
      },
      select: {
        anggotaId: true,
        AngsuranPinjaman: {
          select: {
            pinjamanId: true,
            angsuranPinjamanKe: true,
            angsuranPinjamanDari: true,
            jumlahAngsuranPinjaman: true,
          },
          orderBy: {
            tanggalAngsuranPinjaman: "desc",
          },
          take: 1,
        },
      },
    });

    if (angsuran) {
      return angsuran;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getPotonganSimpananBerjangka = async (
  simpanan: TPendaftaranSimpananCard | null,
) => {
  try {
    const today = new Date();

    if (!simpanan) {
      return null;
    }

    if (
      simpanan.tanggalAwalSimpanan <= today &&
      simpanan.tanggalAkhirSimpanan >= today
    ) {
      const pendaftar = await prisma.pendaftar.findMany({
        where: {
          pendaftaranId: simpanan.noPendaftaran,
        },
        select: {
          anggotaId: true,
          jumlahPilihan: true,
        },
      });
      if (pendaftar) {
        return pendaftar;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getListPotonganGaji = unstable_cache(
  async () => {
    const [lebaran, qurban, ubar] = await Promise.all([
      getPendaftaranSimpanan("simpanan-lebaran"),
      getPendaftaranSimpanan("simpanan-qurban"),
      getPendaftaranSimpanan("simpanan-ubar"),
    ]);

    const [
      potonganLebaran,
      potonganQurban,
      potonganUbar,
      potonganPinjamanJasa,
      potonganPinjamanBarang,
    ] = await Promise.all([
      getPotonganSimpananBerjangka(lebaran.value ? lebaran.value : null),
      getPotonganSimpananBerjangka(qurban.value ? qurban.value : null),
      getPotonganSimpananBerjangka(ubar.value ? ubar.value : null),
      getPotonganAngsuran("JASA"),
      getPotonganAngsuran("BARANG"),
    ]);

    const anggota = await prisma.anggota.findMany({
      where: {
        statusAnggota: "ACTIVE",
      },
      select: {
        noAnggota: true,
        nama: true,
        pilManasuka: true,
        unitKerja: {
          select: {
            namaUnitKerja: true,
          },
        },
      },
    });

    const potonganGaji: TPotongGaji[] = anggota.map((itemAnggota) => {
      const itemLebaran = potonganLebaran?.find(
        (lebaran) => lebaran.anggotaId === itemAnggota.noAnggota,
      );
      const itemQurban = potonganQurban?.find(
        (qurban) => qurban.anggotaId === itemAnggota.noAnggota,
      );
      const itemUbar = potonganUbar?.find(
        (ubar) => ubar.anggotaId === itemAnggota.noAnggota,
      );
      const itemPinjamanJasa = potonganPinjamanJasa?.find(
        (pinjamanJasa) => pinjamanJasa.anggotaId === itemAnggota.noAnggota,
      );
      const itemPinjamanBarang = potonganPinjamanBarang?.find(
        (pinjamanBarang) => pinjamanBarang.anggotaId === itemAnggota.noAnggota,
      );

      const data: TDataPotongan = {
        wajib: 15000,
        manasuka: itemAnggota.pilManasuka ? itemAnggota.pilManasuka : 0,
        lebaran: itemLebaran?.jumlahPilihan ? itemLebaran?.jumlahPilihan : 0,
        qurban: itemQurban?.jumlahPilihan ? itemQurban?.jumlahPilihan : 0,
        ubar: itemUbar?.jumlahPilihan ? itemUbar?.jumlahPilihan : 0,
        angsuranJasa: itemPinjamanJasa?.AngsuranPinjaman[0]
          .jumlahAngsuranPinjaman
          ? itemPinjamanJasa?.AngsuranPinjaman[0].jumlahAngsuranPinjaman
          : 0,
        angsuranBarang: itemPinjamanBarang?.AngsuranPinjaman[0]
          .jumlahAngsuranPinjaman
          ? itemPinjamanBarang?.AngsuranPinjaman[0].jumlahAngsuranPinjaman
          : 0,
      };

      return {
        anggotaId: itemAnggota.noAnggota,
        nama: itemAnggota.nama,
        unitGarapan: itemAnggota.unitKerja.namaUnitKerja,
        simpananWajib: data.wajib,
        simpananManasuka: data.manasuka,
        simpananLebaran: data.lebaran,
        simpananQurban: data.qurban,
        simpananUbar: data.ubar,
        noPinjamanJasa: itemPinjamanJasa
          ? itemPinjamanJasa.AngsuranPinjaman[0].pinjamanId
          : "-",
        AngsuranKeJasa: itemPinjamanJasa
          ? itemPinjamanJasa.AngsuranPinjaman[0].angsuranPinjamanKe + 1
          : "-",
        AngsuranDariJasa: itemPinjamanJasa
          ? itemPinjamanJasa.AngsuranPinjaman[0].angsuranPinjamanDari
          : "-",
        jumlahAngsuranJasa: data.angsuranJasa >= 0 ? data.angsuranJasa : "-",
        noPinjamanBarang: itemPinjamanBarang
          ? itemPinjamanBarang.AngsuranPinjaman[0].pinjamanId
          : "-",
        AngsuranKeBarang: itemPinjamanBarang
          ? itemPinjamanBarang.AngsuranPinjaman[0].angsuranPinjamanKe + 1
          : "-",
        AngsuranDariBarang: itemPinjamanBarang
          ? itemPinjamanBarang.AngsuranPinjaman[0].angsuranPinjamanDari
          : "-",
        jumlahAngsuranBarang:
          data.angsuranBarang >= 0 ? data.angsuranBarang : "-",
        total:
          data.wajib +
          data.manasuka +
          data.lebaran +
          data.qurban +
          data.ubar +
          data.angsuranJasa +
          data.angsuranBarang,
      };
    });

    return potonganGaji;
  },
  ["list-potongan-gaji"],
  { tags: ["list-potongan-gaji"] },
);

export const getListPotonganGajiApproved = unstable_cache(
  async () => {
    try {
      const potongan = await prisma.potongGaji.findMany();
      if (potongan) {
        return { ok: true, value: potongan as TPotonganApproved[] };
      } else {
        return { ok: true, value: [] };
      }
    } catch (error) {
      console.log("error: ", error);
      return { ok: false, value: null };
    }
  },
  ["list-potongan-gaji-approved"],
  { tags: ["list-potongan-gaji-approved"] },
);
