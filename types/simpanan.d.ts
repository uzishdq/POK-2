import { ICalculatePelunasanPinjaman } from "@/lib/helper";

export type TSimpanan = {
  noSimpanan: string;
  anggotaId: string;
  tanggalSimpanan: string | Date;
  jenisSimpanan:
    | "WAJIB"
    | "SUKAMANA"
    | "LEBARAN"
    | "QURBAN"
    | "UBAR"
    | "MANASUKA";
  basil: number;
  jumlahSimpanan: number;
};

export type TPengambilanSimpanan = {
  noPengambilanSimpanan: string;
  anggotaId: string;
  tanggalPengambilanSimpanan: string | Date;
  jenisPengambilanSimpanan:
    | "WAJIB"
    | "SUKAMANA"
    | "LEBARAN"
    | "QURBAN"
    | "UBAR"
    | "MANASUKA";
  jumlahPengambilanSimpanan: number;
  statusPengambilanSimpanan: string;
};

export type TSimpananBerjangka = {
  noPendaftaran: number;
  namaPendaftaran: string;
  tanggalAwalSimpanan: Date;
  tanggalAkhirSimpanan: Date;
  tanggalTutupPendaftaran: Date;
  statusPendaftaran: "OPEN" | "CLOSE";
  createdAt: Date;
  jenisPendaftaran: "simpanan-lebaran" | "simpanan-qurban" | "simpanan-ubar";
};

export type TSimpananBerjangkaAnggota = {
  anggota: {
    unitKerja: {
      namaUnitKerja: string;
    };
    Simpanan: {
      jenisSimpanan: string;
      tanggalSimpanan: Date;
      jumlahSimpanan: number;
    }[];
    PengambilanSimpanan: {
      jenisPengambilanSimpanan: string;
      tanggalPengambilanSimpanan: Date;
      jumlahPengambilanSimpanan: number;
    }[];
    noAnggota: string;
    nama: string;
  };
}[];

export type TSimpananBerjangkaValue = {
  noAnggota: string;
  nama: string;
  unitKerja: string;
  jenisSimpanan: string;
  totalSimpanan: number;
  simpanan: TDetailSimpananBerjangka[];
};

export type TDetailSimpananBerjangka = {
  bulan: string;
  total: number;
};

export type TPendaftar = {
  anggota: {
    unitKerja: {
      namaUnitKerja: string;
    };
    noAnggota: string;
    nama: string;
  };
  jumlahPilihan: number;
};

export type TListSimpananBerjangka = {
  noPendaftaran: number;
  namaPendaftaran: string;
  tanggalAwalSimpanan: Date;
  tanggalAkhirSimpanan: Date;
  tanggalTutupPendaftaran: Date;
  statusPendaftaran: "OPEN" | "CLOSE";
  createdAt: Date;
  jenisPendaftaran: "simpanan-lebaran" | "simpanan-qurban" | "simpanan-ubar";
  Pendaftar: TPendaftar[];
};

export type TPendaftaranSimpananCard = {
  noPendaftaran: number;
  namaPendaftaran: string;
  tanggalTutupPendaftaran: Date;
  tanggalAwalSimpanan: Date;
  tanggalAkhirSimpanan: Date;
  createdAt: Date;
};

export type TSimpananBerjangkaById = {
  noPendaftaran: number;
  namaPendaftaran: string;
  jenisPendaftaran: string;
  tanggalAwalSimpanan: Date;
  tanggalAkhirSimpanan: Date;
  tanggalTutupPendaftaran: Date;
  statusPendaftaran: "OPEN" | "CLOSE";
  createdAt: Date;
};

export type TParameterSimpananBerjangka = {
  noPendaftaran: number;
  dateStart: Date;
  dateEnd: Date;
  jenisSimpanan: JenisSimpanan;
};

export type TPendaftar = {
  anggotaId: string;
  pendaftaranId: number;
  jumlahPilihan: number;
};

export type TTotalSimpanan = {
  sukamana: number | null;
  lebaran: number | null;
  qurban: number | null;
};

export type TPengambilanSimpananAnggota = {
  noPengambilanSimpanan: string;
  anggotaId: string;
  tanggalPengambilanSimpanan: Date;
  jenisPengambilanSimpanan: string;
  jumlahPengambilanSimpanan: number;
  statusPengambilanSimpanan: string;
  anggota: {
    nama: string;
    namaBank: string | null;
    noRek: string | null;
    unitKerja: {
      namaUnitKerja: string;
    };
  };
};

export type TCekUndurDiri = {
  isPass: boolean;
  anggotaId: string;
  noUser: string;
  keterangan: string;
  wajib: number;
  sukamana: number;
  lebaran: number;
  qurban: number;
  ubar: number;
  biaya: number;
  totalKotor: number;
  totalBersih: number;
  pinjamanJasa: ICalculatePelunasanPinjaman | null;
  pinjamanBarang: ICalculatePelunasanPinjaman | null;
};

export type BalanceType = "WAJIB" | "MANASUKA" | "LEBARAN" | "QURBAN" | "UBAR";

export type TTotalBalance = {
  noAnggota: string;
  nama: string;
  unitKerja: string;
  wajib: number;
  manasuka: number;
  lebaran: number;
  qurban: number;
  ubar: number;
  totalPengambilan: number;
  total: number;
};

export type TBalanceSimpanan = {
  totalSimpanan: number;
  totalPengambilan: number;
  balance: number;
  jenis: string;
};

export type TAllBalanceSimpanan = {
  wajib: TBalanceSimpanan | null;
  sukamana: TBalanceSimpanan | null;
  lebaran: TBalanceSimpanan | null;
  qurban: TBalanceSimpanan | null;
  ubar: TBalanceSimpanan | null;
  totalBalance: number;
  totalPengambilan: number;
};

export type TChartBarSimpanan = {
  wajib: number;
  sukamana: number;
  lebaran: number;
  qurban: number;
  ubar: number;
};
