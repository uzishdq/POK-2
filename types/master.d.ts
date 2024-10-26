import { number, string } from "zod";
import { TUnitKerja } from "./unit-kerja";
import { TJabatan } from "./jabatan";

export type TMaster = {
  idMaster: number;
  emailMaster?: string;
  nipMaster?: string;
  nikMaster?: string;
  namaMaster: string;
  tempatLahirMaster: string;
  tanggalLahirMaster: Date;
  jenisKelaminMaster: "Laki-Laki" | "Perempuan";
  alamatMaster?: string;
  statusPekerjaanMaster: "TETAP" | "KONTRAK" | "HONORER";
  unitKerjaMaster: number;
  jabatanMaster: number;
};
