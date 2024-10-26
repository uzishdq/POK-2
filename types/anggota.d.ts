export type TAnggota = {
  noAnggota: string;
  nik?: string;
  nip?: string;
  nama: string;
  tanggalLahir: Date;
  tempatLahir: string;
  jenisKelamin: "Laki-Laki" | "Perempuan";
  alamat?: string;
  noTelp?: string;
  jabatanId: number;
  statusPekerjaan: "TETAP" | "KONTRAK" | "HONORER";
  unitKerjaId: number;
  namaBank: string;
  noRek: string;
  pilManasuka?: number;
  userEmail: string;
  statusAnggota: "ACTIVE" | "NOTACTIVE";
};

export type TListAnggota = {
  jabatan: {
    namaJabatan: string;
  };
  unitKerja: {
    namaUnitKerja: string;
  };
  noAnggota: string;
  nama: string;
  statusPekerjaan: "TETAP" | "KONTRAK" | "HONORER";
  pilManasuka: number | null;
  statusAnggota: "ACTIVE" | "NOTACTIVE";
};
