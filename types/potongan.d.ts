export type TPotongGaji = {
  anggotaId: string;
  nama: string;
  unitGarapan: string;
  simpananWajib: number | null;
  simpananManasuka: number | null;
  simpananLebaran: number | null;
  simpananQurban: number | null;
  simpananUbar: number | null;
  noPinjamanJasa: string | null;
  AngsuranKeJasa: number | string | null;
  AngsuranDariJasa: number | string | null;
  jumlahAngsuranJasa: number | string | null;
  noPinjamanBarang: string | null;
  AngsuranKeBarang: number | string | null;
  AngsuranDariBarang: number | string | null;
  jumlahAngsuranBarang: number | string | null;
  total: number | null;
};

export type TDataPotongan = {
  wajib: number;
  manasuka: number;
  lebaran: number;
  qurban: number;
  ubar: number;
  angsuranJasa: number;
  angsuranBarang: number;
};

export type TPotonganSimpanan = {
  anggotaId: string;
  jumlahPilihan: number;
};

export type TPotonganAngsuran = {
  AngsuranPinjaman: {
    pinjamanId: string;
    angsuranPinjamanKe: number;
    angsuranPinjamanDari: number;
    jumlahAngsuranPinjaman: number;
  }[];
  anggotaId: string;
};

export type TPotonganApproved = {
  idPotonganGaji: number;
  tanggalPotonganGaji: Date;
  anggotaIdPotongGaji: string | null;
  namaPotongGaji: string | null;
  unitGarapanPotongGaji: string | null;
  simpananWajibPotongGaji: number | null;
  simpananManasukaPotongGaji: number | null;
  simpananLebaranPotongGaji: number | null;
  simpananQurbanPotongGaji: number | null;
  simpananUbarPotongGaji: number | null;
  noPinjamanJasaPotongGaji: string | null;
  AngsuranKeJasaPotongGaji: number | null;
  AngsuranDariJasaPotongGaji: number | null;
  jumlahAngsuranJasaPotongGaji: number | null;
  noPinjamanBarangPotongGaji: string | null;
  AngsuranKeBarangPotongGaji: number | null;
  AngsuranDariBarangPotongGaji: number | null;
  jumlahAngsuranBarangPotongGaji: number | null;
  totalPotongGaji: number | null;
  statusPotonganGaji: "APPROVED" | "SUCCESS";
};

export type TColumnLaporan = {
  header: string;
  value: string;
};
