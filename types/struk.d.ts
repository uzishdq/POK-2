type TStrukUnitKerja = {
  namaUnitKerja: string;
};

type TStrukPinjamanJabatan = {
  namaJabatan: string;
};

type TStrukPinjamanUnitKerja = TStrukUnitKerja & {
  alamatKantor: string;
};

type TStrukPinjamanAnggota = {
  nama: string;
  jabatan: TStrukPinjamanJabatan;
  unitKerja: TStrukPinjamanUnitKerja;
  alamat: string;
  noTelp: string;
  nik: string;
  tanggalLahir: Date;
  tempatLahir: string;
};

export type TStrukPinjaman = {
  noPinjaman: string;
  ajuanPinjaman: number;
  tujuanPinjaman: string;
  waktuPengembalian: number;
  jenisPinjaman: "JASA" | "BARANG";
  tanggalPinjaman: Date;
  jumlahPenghasilan: number;
  anggota: TStrukPinjamanAnggota;
};

export type TStrukPengambilanSimpanan = {
  anggota: {
    nama: string;
    unitKerja: TStrukUnitKerja;
  };
  noPengambilanSimpanan: string;
  tanggalPengambilanSimpanan: Date;
  jenisPengambilanSimpanan: string;
  jumlahPengambilanSimpanan: number;
};

export type TSuratPengunduran = {
  anggota: {
    nik: string;
    nama: string;
    tanggalLahir: Date;
    tempatLahir: string;
    namaBank: string;
    noRek: string;
    statusPekerjaan: "TETAP" | "KONTRAK" | "HONORER";
    unitKerja: TStrukUnitKerja;
  };
  noPengunduran: string;
  anggotaId: string;
  tanggalPengunduran: Date;
  keterangan: string;
  jenisUndurDiri: "TRANSFER" | "CASH";
  biayaPengunduranDiri: number;
  simpananWajibPengunduranDiri: number;
  simpananManasukaPengunduranDiri: number;
  simpananLebaranPengunduranDiri: number;
  simpananQurbanPengunduranDiri: number;
  simpananUbarPengunduranDiri: number;
  totalPengunduranDiri: number;
  totalDiterimaPengunduranDiri: number;
  noUser: string;
  statusPengunduranDiri: "PENDING" | "APPROVED" | "REJECTED";
};
