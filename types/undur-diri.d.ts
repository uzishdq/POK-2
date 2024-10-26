export type TListUndurDiri = {
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
  statusPengunduranDiri: "PENDING" | "APPROVED" | "REJECTED ";
  anggota: {
    nama: string;
    unitKerja: {
      namaUnitKerja: string;
    };
  };
};

export interface ISplitDataPengambilanSimpananUndurDiri {
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
}

export type TSplitDataPengambilanSimpananUndurDiri = {
  noPengambilanSimpanan;
  anggotaId: string;
  jenisPengambilanSimpanan: string;
  jumlahPengambilanSimpanan: number;
  statusPengambilanSimpanan: "PENDING" | "APPROVED" | "REJECTED";
};

export type SimpananKeys =
  | "simpananWajibPengunduranDiri"
  | "simpananManasukaPengunduranDiri"
  | "simpananLebaranPengunduranDiri"
  | "simpananQurbanPengunduranDiri"
  | "simpananUbarPengunduranDiri";
