import { TColumnLaporan } from "@/types/potongan";

export const publicRoutes = ["/", "/daftar", "/reset-password"];
export const authRoutes = ["/", "/daftar", "/reset-password"];
export const apiAuthPrefix = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
export const DEFAULT_API_URL = "/api";
export const DEFAULT_AUTH = "/api/auth";
export const PROTECTED_ROUTE = "/dashboard/petugas";
export const LOGIN_REQUIRED = "/data-diri";

export const LABEL = {
  CARD: {
    HEADER: "Koperasi Karyawan Yayasan Al Ghifari",
    DESCRIPTION: "sedikit bicara banyak sedekah.",
  },
};

export const PICTURES = {
  LOGO: "/logo/logo_koperasi.svg",
  PENDAFTARAN_LEBARAN: "/pendaftaran/1.svg",
  PENDAFTARAN_QURBAN: "/pendaftaran/2.svg",
  PENDAFTARAN_UBAR: "/pendaftaran/3.svg",
};

export const ROUTES = {
  LOGIN: "/",
  DAFTAR: "/daftar",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/dashboard/profile",
  RESIGN: "/dashboard/undur-diri",
  DATA_DIRI: "/data-diri",
  PINJAMAN: {
    PRODUKTIF: "/dashboard/pinjaman-produktif",
    BARANG: "/dashboard/pinjaman-barang",
    AJUAN_PINJAMAN: "/dashboard/pengajuan-pinjaman",
    PELUNASAN: "/dashboard/pelunasan-pinjaman",
  },
  SIMPANAN: {
    WAJIB: "/dashboard/simpanan-wajib",
    SUKAMANA: "/dashboard/simpanan-sukamana",
    LEBARAN: "/dashboard/simpanan-lebaran",
    QURBAN: "/dashboard/simpanan-qurban",
    UBAR: "/dashboard/simpanan-ubar",
    PENGAMBILAN_SIMPANAN: "/dashboard/pengambilan-simpanan",
    PENDAFTARAN_SIMPANAN: "/dashboard/pendaftaran-simpanan-berjangka",
  },
  PETUGAS: {
    INDEX: "/dashboard/petugas",
    DATA_MASTER: {
      MASTER: "/dashboard/petugas/data-master",
      JABATAN: "/dashboard/petugas/jabatan",
      UNIT_KERJA: "/dashboard/petugas/unit-kerja",
      ANGGOTA: "/dashboard/petugas/anggota",
    },
    SIMPANAN_PETUGAS: {
      BERJANGKA: "/dashboard/petugas/simpanan-berjangka",
      TOTAL_SIMPANAN: "/dashboard/petugas/simpanan-anggota",
      PENGAMBILAN: "/dashboard/petugas/pengambilan-simpanan-anggota",
      STRUK_PENGAMBILAN: (id: string) =>
        `/dashboard/petugas/pengambilan-simpanan-anggota/stuk-pengambilan-simpanan/${id}`,
    },
    PINJAMAN_PETUGAS: {
      JASA: "/dashboard/petugas/pinjaman-produktif-anggota",
      BARANG: "/dashboard/petugas/pinjaman-barang-anggota",
      PELUNASAN_ANGGOTA: "/dashboard/petugas/pelunasan-pinjaman-anggota",
      STRUK: (id: string) =>
        `/dashboard/petugas/surat-permohonan-pinjaman/${id}`,
    },
    POTONGAN_GAJI: "/dashboard/petugas/potongan-gaji",
    ASURANSI: "/dashboard/petugas/asuransi",
    LAPORAN: "/dashboard/petugas/laporan-simpanan-pinjaman",
    PENGUNDURAN: {
      PENGUNDURAN_ANGGOTA: "/dashboard/petugas/pengunduran-anggota",
      SURAT_PENGUNDURAN: (id: string) =>
        `/dashboard/petugas/pengunduran-anggota/surat-pengunduran-anggota/${id}`,
    },
  },
};

export const BENDAHARA_ROUTE = [
  ROUTES.PETUGAS.POTONGAN_GAJI,
  ROUTES.PETUGAS.SIMPANAN_PETUGAS.BERJANGKA,
  ROUTES.PETUGAS.SIMPANAN_PETUGAS.PENGAMBILAN,
  ROUTES.PETUGAS.SIMPANAN_PETUGAS.TOTAL_SIMPANAN,
  ROUTES.PETUGAS.PINJAMAN_PETUGAS.BARANG,
  ROUTES.PETUGAS.PINJAMAN_PETUGAS.JASA,
  ROUTES.PETUGAS.PINJAMAN_PETUGAS.PELUNASAN_ANGGOTA,
  ROUTES.PETUGAS.ASURANSI,
  ROUTES.PETUGAS.LAPORAN,
];

export const routeSimpanan = [
  { name: "Pengambilan Simpanan", href: ROUTES.SIMPANAN.PENGAMBILAN_SIMPANAN },
  { name: "Pendaftaran Simpanan", href: ROUTES.SIMPANAN.PENDAFTARAN_SIMPANAN },
  { name: "Wajib", href: ROUTES.SIMPANAN.WAJIB },
  {
    name: "Sukamana",
    href: ROUTES.SIMPANAN.SUKAMANA,
  },
  { name: "Lebaran", href: ROUTES.SIMPANAN.LEBARAN },
  { name: "Qurban", href: ROUTES.SIMPANAN.QURBAN },
  { name: "Ulin Bareng", href: ROUTES.SIMPANAN.UBAR },
];

export const routePinjaman = [
  { name: "Pengajuan Pinjaman", href: ROUTES.PINJAMAN.AJUAN_PINJAMAN },
  { name: "Pelunasan Pinjaman", href: ROUTES.PINJAMAN.PELUNASAN },
  { name: "Produktif", href: ROUTES.PINJAMAN.PRODUKTIF },
  { name: "Barang", href: ROUTES.PINJAMAN.BARANG },
];

export const routeDataMaster = [
  { name: "Karyawan Yayasan", href: ROUTES.PETUGAS.DATA_MASTER.MASTER },
  { name: "Anggota Koperasi", href: ROUTES.PETUGAS.DATA_MASTER.ANGGOTA },
  { name: "Jabatan", href: ROUTES.PETUGAS.DATA_MASTER.JABATAN },
  { name: "Unit Kerja", href: ROUTES.PETUGAS.DATA_MASTER.UNIT_KERJA },
];

export const routeSimpananPetugas = [
  {
    name: "Simpanan Anggota",
    href: ROUTES.PETUGAS.SIMPANAN_PETUGAS.TOTAL_SIMPANAN,
  },
  {
    name: "Simpanan Berjangka",
    href: ROUTES.PETUGAS.SIMPANAN_PETUGAS.BERJANGKA,
  },
  {
    name: "Pengambilan Simpanan",
    href: ROUTES.PETUGAS.SIMPANAN_PETUGAS.PENGAMBILAN,
  },
];

export const routePinjamanPetugas = [
  {
    name: "Asuransi Pinjaman",
    href: ROUTES.PETUGAS.ASURANSI,
  },
  {
    name: "Pelunasan Pinjaman Anggota",
    href: ROUTES.PETUGAS.PINJAMAN_PETUGAS.PELUNASAN_ANGGOTA,
  },
  {
    name: "Pinjaman Produktif",
    href: ROUTES.PETUGAS.PINJAMAN_PETUGAS.JASA,
  },
  {
    name: "Pinjaman Barang",
    href: ROUTES.PETUGAS.PINJAMAN_PETUGAS.BARANG,
  },
];

export const routeLainyaPetugas = [
  {
    name: "Potongan Gaji",
    href: ROUTES.PETUGAS.POTONGAN_GAJI,
  },
  {
    name: "Laporan",
    href: ROUTES.PETUGAS.LAPORAN,
  },
  {
    name: "Pengunduran Anggota",
    href: ROUTES.PETUGAS.PENGUNDURAN.PENGUNDURAN_ANGGOTA,
  },
];

export const routeNav = [{ name: "Dashboard", href: DEFAULT_LOGIN_REDIRECT }];

export const gender = [
  {
    name: "Laki-Laki",
    value: "Laki-Laki",
  },
  {
    name: "Perempuan",
    value: "Perempuan",
  },
];

export const bank = [
  {
    name: "BCA",
    value: "BCA",
  },
  {
    name: "BNI",
    value: "BNI",
  },
  {
    name: "BJB",
    value: "BJB",
  },
  {
    name: "MANDIRI",
    value: "MANDIRI",
  },
  {
    name: "BTN",
    value: "BTN",
  },
  {
    name: "BRI",
    value: "BRI",
  },
  {
    name: "BSI",
    value: "BSI",
  },
  {
    name: "BTPN",
    value: "BTPN",
  },
  {
    name: "CIMB NIAGA",
    value: "CIMB NIAGA",
  },
  {
    name: "PANIN BANK",
    value: "PANIN BANK",
  },
];

export const pekerjaan = [
  {
    name: "Tetap",
    value: "TETAP",
  },
  {
    name: "Honorer",
    value: "HONORER",
  },
  {
    name: "Kontrak",
    value: "KONTRAK",
  },
];

export const jenisPendaftaran = [
  {
    name: "Lebaran",
    value: "simpanan-lebaran",
  },
  {
    name: "Qurban",
    value: "simpanan-qurban",
  },
  {
    name: "Ulin Bareng",
    value: "simpanan-ubar",
  },
];

export const jenisPelunasanPinjaman = [
  {
    name: "Transfer",
    value: "TRANSFER",
  },
  {
    name: "Bayar Tunai",
    value: "CASH",
  },
];

export const jenisPengambilan = [
  {
    name: "Simpanan Sukamana",
    value: "MANASUKA",
  },
  {
    name: "Simpanan Lebaran",
    value: "LEBARAN",
  },
  {
    name: "Simpanan Qurban",
    value: "QURBAN",
  },
];

export const jenisPinjaman = [
  {
    name: "Pinjaman Produktif",
    value: "JASA",
  },
  {
    name: "Pinjaman Barang",
    value: "BARANG",
  },
];

export const statusPinjaman = [
  {
    name: "Approved",
    value: "APPROVED",
  },
  {
    name: "Completed",
    value: "COMPLETED",
  },
];

export const jenisLaporanSimpanan = [
  {
    name: "Laporan Simpanan Wajib & Sukamana",
    value: "laporan-simpanan-wajib-sukamana",
  },
  {
    name: "Laporan Simpanan Lebaran",
    value: "laporan-simpanan-lebaran",
  },
  {
    name: "Laporan Simpanan Qurban",
    value: "laporan-simpanan-qurban",
  },
  {
    name: "Laporan Simpanan Ubar",
    value: "laporan-simpanan-ubar",
  },
];

export const years = ["2022", "2023", "2024", "2025", "2026", "2027"];
export const months = [
  {
    title: "Januari",
    value: "01",
  },
  {
    title: "Februari",
    value: "02",
  },
  {
    title: "Maret",
    value: "03",
  },
  {
    title: "April",
    value: "04",
  },
  {
    title: "Mei",
    value: "05",
  },
  {
    title: "Juni",
    value: "06",
  },
  {
    title: "Juli",
    value: "07",
  },
  {
    title: "Agustus",
    value: "08",
  },
  {
    title: "September",
    value: "09",
  },
  {
    title: "Oktober",
    value: "10",
  },
  {
    title: "November",
    value: "11",
  },
  {
    title: "Desember",
    value: "12",
  },
];

export const columnsPotonganGaji: TColumnLaporan[] = [
  { header: "No Anggota", value: "anggotaId" },
  { header: "Nama", value: "nama" },
  { header: "Unit Garapan", value: "unitGarapan" },
  { header: "Simpanan Wajib", value: "simpananWajib" },
  { header: "Simpanan Sukamana", value: "simpananManasuka" },
  { header: "Simpanan Lebaran", value: "simpananLebaran" },
  { header: "Simpanan Qurban", value: "simpananQurban" },
  { header: "Simpanan Ubar", value: "simpananUbar" },
  { header: "No Pinjaman Produktif", value: "noPinjamanJasa" },
  { header: "Angsuran Produktif Ke", value: "AngsuranKeJasa" },
  { header: "Angsuran Produktif Dari", value: "AngsuranDariJasa" },
  { header: "Jumlah Angsuran Produktif", value: "jumlahAngsuranJasa" },
  { header: "No Pinjaman Barang", value: "noPinjamanBarang" },
  { header: "Angsuran Barang Ke", value: "AngsuranKeBarang" },
  { header: "Angsuran Barang Dari", value: "AngsuranDariBarang" },
  { header: "Jumlah Angsuran Barang", value: "jumlahAngsuranBarang" },
  { header: "Total Potongan", value: "total" },
];

export const columnsExcelPendaftarSimpananBerjangka: TColumnLaporan[] = [
  { header: "No Anggota", value: "anggota.noAnggota" },
  { header: "Nama", value: "anggota.nama" },
  { header: "Unit Garapan", value: "anggota.unitKerja.namaUnitKerja" },
  { header: "Jumlah Simpanan", value: "jumlahPilihan" },
];

export const columnsExcelAsuransi: TColumnLaporan[] = [
  { header: "No Asuransi", value: "noAsuransi" },
  { header: "Nama", value: "pinjaman.anggota.nama" },
  { header: "Unit Garapan", value: "pinjaman.anggota.unitKerja.namaUnitKerja" },
  { header: "Tanggal Lahir", value: "pinjaman.anggota.tanggalLahir" },
  { header: "Usia", value: "usiaAsuransi" },
  { header: "Mulai Asuransi", value: "tanggalAsuransi" },
  { header: "Akhir Asuransi", value: "tanggalAkhirAsuransi" },
  { header: "TH", value: "masaAsuransiTH" },
  { header: "BL", value: "masaAsuransiBL" },
  { header: "JK", value: "masaAsuransiJK" },
  { header: "UP", value: "pinjaman.ajuanPinjaman" },
  { header: "Total Premi", value: "premi" },
];

export const columnsExcelSimpananAnggota: TColumnLaporan[] = [
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "nama" },
  { header: "Unit Garapan", value: "unitKerja" },
  { header: "Simpanan Wajib", value: "wajib" },
  { header: "Simpanan Sukamana", value: "manasuka" },
  { header: "Simpanan Lebaran", value: "lebaran" },
  { header: "Simpanan Qurban", value: "qurban" },
  { header: "Simpanan Ubar", value: "ubar" },
  { header: "Total Pengambilan", value: "totalPengambilan" },
  { header: "Saldo", value: "total" },
];

export const columnsExcelSimpananBerjangka: TColumnLaporan[] = [
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "nama" },
  { header: "Unit Garapan", value: "unitKerja" },
  { header: "Jenis Simpanan", value: "jenisSimpanan" },
  { header: "Total", value: "totalSimpanan" },
];

export const columnsExcelLaporanPinjaman: TColumnLaporan[] = [
  { header: "No Anggota", value: "noAnggota" },
  { header: "Nama", value: "nama" },
  { header: "Unit Garapan", value: "namaUnitKerja" },
  { header: "No Pinjaman", value: "noPinjaman" },
  { header: "Tanggal", value: "tanggalPinjaman" },
  { header: "Angsuran Ke", value: "waktuPengembalian" },
  { header: "Jumlah Pinjaman", value: "ajuanPinjaman" },
  { header: "Akad", value: "akad" },
  { header: "Pokok Masuk", value: "pokokMasuk" },
  { header: "Jasa Masuk", value: "jasaMasuk" },
  { header: "Sisa Pokok", value: "sisaPokok" },
];
