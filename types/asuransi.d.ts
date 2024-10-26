export type TAsuransi = {
  pinjaman: {
    ajuanPinjaman: number;
    anggota: {
      nama: string;
      tanggalLahir: Date;
      unitKerja: {
        namaUnitKerja: string;
      };
    };
  };
  noAsuransi: number;
  pinjamanId: string;
  usiaAsuransi: number;
  tanggalAsuransi: Date;
  tanggalAkhirAsuransi: Date;
  masaAsuransiTH: number;
  masaAsuransiBL: number;
  masaAsuransiJK: number;
  premi: number;
};
