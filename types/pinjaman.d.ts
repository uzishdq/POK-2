import { ICalculateChartPinjamanAnggota } from "@/lib/helper";

export type TPinjaman = {
  noPinjaman: string;
  ajuanPinjaman: number;
  statusPinjaman: string;
};

export type TPelunasanPinjaman = {
  noPinjaman: string;
};

export type TMaxPelunasanPinjaman = {
  noPinjaman: string;
  tujuanPinjaman: string;
  ajuanPinjaman: number;
  waktuPengembalian: number;
  AngsuranPinjaman: {
    tanggalAngsuranPinjaman: Date;
    angsuranPinjamanKe: number;
    angsuranPinjamanDari: number;
    jumlahAngsuranPinjaman: number;
  }[];
};

export type TMaxPinjaman = {
  noPinjaman: string;
  tanggalPinjaman: Date;
  ajuanPinjaman: number;
  statusPinjaman:
    | "PENDING"
    | "PENDINGYAYASAN"
    | "APPROVED"
    | "COMPLETED"
    | "NOTCOMPLETE"
    | "REJECTED";
  AngsuranPinjaman: {
    noAngsuranPinjaman: string;
    angsuranPinjamanKe: number;
    angsuranPinjamanDari: number;
  }[];
};

export type TOptionPinjaman = {
  noAnggota: string;
  nama: string;
  namaBank: string | null;
  noRek: string | null;
  noTelp: string | null;
  unitKerja: {
    namaUnitKerja: string;
  };
};
export type TOptionPelunasanPinjaman = {
  noPelunasan: string;
  pinjamanId: string;
  angsuranKe: number;
  sudahDibayarkan: number;
  nama: string;
  unitKerja: string;
  jenis: string;
  jumlahDibayar: number;
  waktuPelunasan: number;
  ajuanPinjaman: number;
};

export type TListPinjaman = {
  noPinjaman: string;
  anggotaId: string;
  tanggalPinjaman: Date;
  tujuanPinjaman: string;
  waktuPengembalian: number;
  jenisPinjaman: "JASA" | "BARANG";
  ajuanPinjaman: number;
  jumlahDiterima: number;
  strukGaji: string;
  jumlahPenghasilan: number;
  statusPinjaman:
    | "PENDING"
    | "PENDINGYAYASAN"
    | "APPROVED"
    | "COMPLETED"
    | "NOTCOMPLETE"
    | "REJECTED";
  anggota: {
    noAnggota: string;
    nama: string;
    namaBank: string | null;
    noRek: string | null;
    noTelp: string | null;
    unitKerja: {
      namaUnitKerja: string;
    };
  };
  AngsuranPinjaman: TListAngsuranPinjaman[];
};

export type TListAngsuranPinjaman = {
  noAngsuranPinjaman: string;
  tanggalAngsuranPinjaman: Date;
  pinjamanId: string;
  angsuranPinjamanKe: number;
  angsuranPinjamanDari: number;
  jumlahAngsuranPinjaman: number;
  statusAngsuranPinjaman: "ONPROGRESS" | "COMPLETED" | "NOTCOMPLETE";
};

export type TSplitAngsuran = TListAngsuranPinjaman & {
  anggotaId: string;
  jenisPinjaman: "JASA" | "BARANG";
};

export type TUpdateAngsuran = {
  pinjamanId: string;
  statusPinjaman:
    | "PENDING"
    | "PENDINGYAYASAN"
    | "APPROVED"
    | "COMPLETED"
    | "NOTCOMPLETE"
    | "REJECTED";
};

export type TListPinjamanId = {
  noPinjaman: string;
  anggotaId: string;
  tanggalPinjaman: Date;
  tujuanPinjaman: String;
  waktuPengembalian: number;
  jenisPinjaman: "JASA" | "BARANG";
  ajuanPinjaman: number;
  jumlahDiterima: number;
  strukGaji: string;
  jumlahPenghasilan: number;
  statusPinjaman:
    | "PENDING"
    | "PENDINGYAYASAN"
    | "APPROVED"
    | "COMPLETED"
    | "NOTCOMPLETE"
    | "REJECTED";
  AngsuranPinjaman: TListAngsuranPinjaman[];
};

export type TListPelunasanPinjaman = {
  noPelunasanPinjaman: string;
  tanggalPelunasanPinjaman: Date;
  pinjamanId: string;
  angsuranKePelunasanPinjaman: number;
  sudahDibayarkan: number;
  buktiPelunasanPinjaman: string;
  jenisPelunasanPinjaman: "TRANSFER" | "CASH";
  jumlahPelunasanPinjaman: number;
  statusPelunasanPinjaman: "PENDING" | "APPROVED" | "REJECTED";
  pinjaman: {
    ajuanPinjaman: number;
    waktuPengembalian: number;
    anggota: {
      noAnggota: string;
      nama: string;
      unitKerja: {
        namaUnitKerja: string;
      };
    };
    AngsuranPinjaman: TListAngsuranPinjaman[];
  };
};

export type TChartBarPinjaman = {
  produktif: ICalculateChartPinjamanAnggota | null;
  barang: ICalculateChartPinjamanAnggota | null;
};
