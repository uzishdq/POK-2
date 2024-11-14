import { TDetailSimpananBerjangka } from "./simpanan";

export type TDataPinjamanLaporan = {
  anggota: {
    noAnggota: string;
    nama: string;
    unitKerja: {
      namaUnitKerja: string;
    };
  };
  noPinjaman: string;
  tanggalPinjaman: Date;
  waktuPengembalian: number;
  ajuanPinjaman: number;
  jenisPinjaman: "JASA" | "BARANG";
  statusPinjaman:
    | "APPROVED"
    | "COMPLETED"
    | "PENDING"
    | "PENDINGYAYASAN"
    | "NOTCOMPLETE"
    | "REJECTED";
  AngsuranPinjaman: {
    angsuranPinjamanKe: number;
    jumlahAngsuranPinjaman: number;
  }[];
};

export type TLaporanPinjaman = {
  noAnggota: string;
  nama: string;
  namaUnitKerja: string;
  noPinjaman: string;
  tanggalPinjaman: Date;
  waktuPengembalian: string;
  jenisPinjaman: "JASA" | "BARANG";
  statusPinjaman:
    | "APPROVED"
    | "COMPLETED"
    | "PENDING"
    | "PENDINGYAYASAN"
    | "NOTCOMPLETE"
    | "REJECTED";
  ajuanPinjaman: number;
  jumlahAngsuran: number;
  akad: number;
  pokokMasuk: number;
  jasaMasuk: number;
  sisaPokok: number;
};

export type TDataSimpananLaporan = {
  noAnggota: string;
  nama: string;
  unitKerja: {
    namaUnitKerja: string;
  };
  Simpanan: {
    tanggalSimpanan: Date;
    jenisSimpanan: string;
    jumlahSimpanan: number;
  }[];
  PengambilanSimpanan: {
    tanggalPengambilanSimpanan: Date;
    jenisPengambilanSimpanan: string;
    jumlahPengambilanSimpanan: number;
  }[];
};

export type TLaporanSimpanan = {
  noAnggota: string;
  nama: string;
  namaUnitKerja: string;
  jumlahSimpanan: number;
  jumlahSimpananWajib: number;
  jumlahSimpananSukamana: number;
  pengambilanSimpanan: number;
  saldoSimpanan: number;
  simpanan: TDetailSimpananBerjangka[];
};
