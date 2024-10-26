import { TSimpanan } from "@/types/simpanan";
import { jenisPendaftaran } from "./constan";
import {
  formatDatebyMonth,
  formatToIDR,
  generateJenisPendaftaranSimpanan,
  ICalculatePelunasanPinjaman,
} from "./helper";
import { TListAngsuranPinjaman, TSplitAngsuran } from "@/types/pinjaman";

export interface ITemplatePengambilanSimpanan {
  name: string;
  unitGarapan: string;
  noPengambilanSimpanan: string;
  tanggalPengambilanSimpanan: Date;
  jenisPengambilanSimpanan: string;
  jumlahPengambilanSimpanan: number;
  statusPengambilanSimpanan: string;
}
export interface ITemplatePengambilanSimpananPetugas
  extends ITemplatePengambilanSimpanan {
  namaPetugas: string;
  role: string;
}
export interface ITemplatePengajuanPinjaman {
  name: string;
  unitGarapan: string;
  jenisPinjaman: string;
  noPinjaman: string;
  tanggalPinjaman: Date;
  waktuPengembalian: number;
  ajuanPinjaman: number;
  tujuanPinjaman: string;
  statusPinjaman: string;
}
export interface ITemplatePengajuanPinjamanPetugas
  extends ITemplatePengajuanPinjaman {
  namaPetugas: string;
  role: string;
}
export interface ITemplatePengumumamPendaftaranSimpanan {
  name: string;
  namaPendaftaran: string;
  jenisPendaftaran: string;
  tanggalAwalSimpanan: Date;
  tanggalAkhirSimpanan: Date;
  tanggalTutupPendaftaran: Date;
  createdAt: Date;
}
export interface ITemplatePotonganGajiSimpanan {
  nama: string;
  simpanan: TSimpanan[];
}
export interface ITemplatePotonganGajiAngsuran {
  nama: string;
  angsuran: TSplitAngsuran[];
}
export interface ITemplatePelunasanPinjaman {
  name: string;
  unitGarapan: string;
  noPelunasanPinjaman: string;
  tanggalPelunasanPinjaman: Date;
  pinjamanId: string;
  jenisPelunasanPinjaman: "TRANSFER" | "CASH";
  jumlahPelunasanPinjaman: number;
  statusPelunasanPinjaman: "PENDING" | "APPROVED" | "REJECTED";
  angsuranKe: number;
  angsuranDari: number;
  sudahDibayarkan: number;
  ajuanPinjaman: number;
}
export interface ITemplatePelunasanPinjamanPetugas
  extends ITemplatePelunasanPinjaman {
  namaPetugas: string;
  role: string;
}

export const templatePengambilanSimpanan = (
  props: ITemplatePengambilanSimpanan,
) => {
  return `*Pemberitahuan Pengambilan Simpanan*
  
_Assalamualaikum_,
${props.name} 

Pengambilan simpanan Anda telah berhasil diajukan :

- Nomor Transaksi: ${props.noPengambilanSimpanan}
- Tanggal: ${formatDatebyMonth(props.tanggalPengambilanSimpanan)}
- Jenis Simpanan: ${props.jenisPengambilanSimpanan}
- Jumlah Penarikan: ${formatToIDR(props.jumlahPengambilanSimpanan)}

Status Pengambilan: *${props.statusPengambilanSimpanan}*

Terima kasih telah mempercayakan layanan kami. Proses memperlukan 3-5 hari kerja. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengambilanSimpananApproved = (
  props: ITemplatePengambilanSimpanan,
) => {
  return `*Pemberitahuan Pengambilan Simpanan*
  
_Assalamualaikum_,
${props.name} 

Kami dengan senang hati menginformasikan bahwa pengambilan simpanan Anda telah berhasil diproses :

- Nomor Transaksi: ${props.noPengambilanSimpanan}
- Tanggal: ${formatDatebyMonth(props.tanggalPengambilanSimpanan)}
- Jenis Simpanan: ${props.jenisPengambilanSimpanan}
- Jumlah Penarikan: ${formatToIDR(props.jumlahPengambilanSimpanan)}

Status Pengambilan: *${props.statusPengambilanSimpanan}*

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengambilanSimpananRejected = (
  props: ITemplatePengambilanSimpanan,
) => {
  return `*Pemberitahuan Pengambilan Simpanan*
  
_Assalamualaikum_,
${props.name} 

Mohon Maaf, Kami menginformasikan bahwa pengambilan simpanan Anda telah gagal diproses :

- Nomor Transaksi: ${props.noPengambilanSimpanan}
- Tanggal: ${formatDatebyMonth(props.tanggalPengambilanSimpanan)}
- Jenis Simpanan: ${props.jenisPengambilanSimpanan}
- Jumlah Penarikan: ${formatToIDR(props.jumlahPengambilanSimpanan)}

Status Pengambilan: *${props.statusPengambilanSimpanan}*

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengambilanSimpananPetugas = (
  props: ITemplatePengambilanSimpananPetugas,
) => {
  return `*Pemberitahuan Pengambilan Simpanan Anggota*

_Assalamualaikum_,
${props.namaPetugas} - ${props.role}

Kami ingin memberitahukan bahwa permohonan pengambilan simpanan anggota telah diajukan. Detail pengambilan simpanan:

Nama: ${props.name}
Unit Garapan : ${props.unitGarapan}

- Nomor Transaksi: ${props.noPengambilanSimpanan}
- Tanggal: ${formatDatebyMonth(props.tanggalPengambilanSimpanan)}
- Jenis Simpanan: ${props.jenisPengambilanSimpanan}
- Jumlah Penarikan: ${formatToIDR(props.jumlahPengambilanSimpanan)}

Harap segera meninjau dan memproses permohonan ini sesuai dengan prosedur yang berlaku. Terimakasih

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengajuanPinjaman = (
  props: ITemplatePengajuanPinjaman,
) => {
  return `*Pemberitahuan Pengajuan Pinjaman*

_Assalamualaikum_, 
${props.name} 

Kami dengan senang hati menginformasikan bahwa pengajuan pinjaman Anda telah berhasil diajukan :

- No Pinjaman: ${props.noPinjaman}
- Jenis Pinjaman : ${props.jenisPinjaman === "JASA" ? "PRODUKTIF" : "BARANG"}
- Tanggal: ${formatDatebyMonth(props.tanggalPinjaman)}
- Waktu Pengembalian: ${props.waktuPengembalian} Bulan
- Jumlah: ${formatToIDR(props.ajuanPinjaman)}
- Tujuan: ${props.tujuanPinjaman}

Status Pinjaman : *${props.statusPinjaman}*

Terima kasih telah mempercayakan layanan kami. Proses memperlukan 3-5 hari kerja. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengajuanPinjamanApproved = (
  props: ITemplatePengajuanPinjaman,
) => {
  return `*Pemberitahuan Pengajuan Pinjaman*

_Assalamualaikum_, 
${props.name} 

Kami dengan senang hati menginformasikan bahwa pengajuan pinjaman Anda telah berhasil diproses :

- No Pinjaman: ${props.noPinjaman}
- Jenis Pinjaman : ${props.jenisPinjaman === "JASA" ? "PRODUKTIF" : "BARANG"}
- Tanggal: ${formatDatebyMonth(props.tanggalPinjaman)}
- Waktu Pengembalian: ${props.waktuPengembalian} Bulan
- Jumlah: ${formatToIDR(props.ajuanPinjaman)}
- Tujuan: ${props.tujuanPinjaman}

Status Pinjaman : *${props.statusPinjaman}*

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengajuanPinjamanRejected = (
  props: ITemplatePengajuanPinjaman,
) => {
  return `*Pemberitahuan Pengajuan Pinjaman*

_Assalamualaikum_, 
${props.name} 

Mohon Maaf, Kami menginformasikan bahwa pengajuan pinjaman Anda telah gagal diproses :

- No Pinjaman: ${props.noPinjaman}
- Jenis Pinjaman : ${props.jenisPinjaman === "JASA" ? "PRODUKTIF" : "BARANG"}
- Tanggal: ${formatDatebyMonth(props.tanggalPinjaman)}
- Waktu Pengembalian: ${props.waktuPengembalian} Bulan
- Jumlah: ${formatToIDR(props.ajuanPinjaman)}
- Tujuan: ${props.tujuanPinjaman}

Status Pinjaman : *${props.statusPinjaman}*

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengajuanPinjamanPetugas = (
  props: ITemplatePengajuanPinjamanPetugas,
) => {
  return `*Pemberitahuan Pengajuan Pinjaman Anggota*

_Assalamualaikum_, 
${props.namaPetugas} - ${props.role}

Kami ingin memberitahukan bahwa permohonan Pinjaman anggota telah diajukan. Detail Pinjaman Anggota:

Nama: ${props.name}
Unit Garapan: ${props.unitGarapan}
Jenis Pinjaman: ${props.jenisPinjaman === "JASA" ? "PRODUKTIF" : "BARANG"}

- No Pinjaman: ${props.noPinjaman}
- Tanggal: ${formatDatebyMonth(props.tanggalPinjaman)}
- Waktu Pengembalian: ${props.waktuPengembalian} Bulan
- Jumlah: ${formatToIDR(props.ajuanPinjaman)}
- Tujuan: ${props.tujuanPinjaman}

Harap segera meninjau dan memproses permohonan ini sesuai dengan prosedur yang berlaku. Terimakasih

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengumumamPendaftaranSimpanan = (
  props: ITemplatePengumumamPendaftaranSimpanan,
) => {
  return `*Pemberitahuan Pendaftaran Simpanan ${generateJenisPendaftaranSimpanan(props.jenisPendaftaran)}*

_Assalamualaikum_,
Kepada Yth,
Bapak/Ibu ${props.name}
Anggota Koperasi Karyawan Yayasan Al Ghifari
Di tempat

Dengan Hormat,

Kami dengan senang hati mengumumkan bahwa dibukanya pendaftaran simpanan ${generateJenisPendaftaranSimpanan(props.jenisPendaftaran)} bagi seluruh anggota koperasi. Adapun rincian informasi terkait pendaftaran simpanan adalah sebagai berikut:

Jenis Simpanan : *Simpanan Berjangka ${generateJenisPendaftaranSimpanan(props.jenisPendaftaran)}*

- Waktu Pendaftaran : ${formatDatebyMonth(props.createdAt)} s/d ${formatDatebyMonth(props.tanggalTutupPendaftaran)}
- Jangka Waktu Simpanan : ${formatDatebyMonth(props.tanggalAwalSimpanan)} s/d ${formatDatebyMonth(props.tanggalAkhirSimpanan)}

Silakan mendaftar di aplikasi POK melalui halaman pendaftaran simpanan.Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePotonganGajiSimpanan = (
  props: ITemplatePotonganGajiSimpanan,
) => {
  return `*Pemberitahuan Simpanan*

_Assalamualaikum_, 
${props.nama} 

Kami senang memberitahu bahwa simpanan anda telah berhasil masuk. Detail transaksi dapat dilihat di bawah ini:
${props.simpanan
  .map(
    (item) => `
Simpanan *${item.jenisSimpanan}* :
- No.Simpanan: ${item.noSimpanan} 
- Tanggal: ${formatDatebyMonth(item.tanggalSimpanan)}
- Jumlah: ${formatToIDR(item.jumlahSimpanan)}`,
  )
  .join("\n")}

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePotonganGajiAngsuran = (
  props: ITemplatePotonganGajiAngsuran,
) => {
  return `*Pemberitahuan Angsuran Pinjaman*

_Assalamualaikum_, 
${props.nama} 

Kami ingin memberitahu bahwa angsuran pinjaman anda telah berhasil masuk. Detail transaksi dapat dilihat di bawah ini:
${props.angsuran
  .map(
    (item) => `
No Pinjaman: ${item.pinjamanId}
Pinjaman: *${item.jenisPinjaman === "JASA" ? "PRODUKTIF" : "BARANG"}*
- No.Angsuran: ${item.noAngsuranPinjaman} 
- Tanggal: ${formatDatebyMonth(item.tanggalAngsuranPinjaman)}
- Angsuran Ke: ${item.angsuranPinjamanKe} Dari: ${item.angsuranPinjamanDari}
- Jumlah Angsuran: ${formatToIDR(item.jumlahAngsuranPinjaman)}

Status Pinjaman: *${item.statusAngsuranPinjaman}*
`,
  )
  .join("\n")}

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePelunasanPinjaman = (
  props: ITemplatePelunasanPinjaman,
) => {
  return `*Pemberitahuan Pelunasan Pinjaman*
  
_Assalamualaikum_, 
${props.name}

Kami dengan senang hati menginformasikan bahwa pengajuan pelunasan pinjaman Anda telah berhasil diajukan :

Pinjaman:
- No Pinjaman: ${props.pinjamanId}
- Waktu Pengembalian: ${props.angsuranDari} Bulan
- Jumlah: ${formatToIDR(props.ajuanPinjaman)}
- Angsuran Pinjaman : ${props.angsuranKe} / ${props.angsuranDari} Bulan 
- Jumlah yang Sudah Dibayarkan: ${formatToIDR(props.sudahDibayarkan)}

Pelunasan Pinjaman: 
- Nomor Transaksi: ${props.noPelunasanPinjaman}
- Tanggal: ${formatDatebyMonth(props.tanggalPelunasanPinjaman)}
- Jumlah Pelunasan: ${formatToIDR(props.jumlahPelunasanPinjaman)}
- Metode Pembayaran: ${props.jenisPelunasanPinjaman}

Status Pelunasan : *${props.statusPelunasanPinjaman}*

Terima kasih telah mempercayakan layanan kami. Proses memperlukan 3-5 hari kerja. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePelunasanPinjamanRejected = (
  props: ITemplatePelunasanPinjaman,
) => {
  return `*Pemberitahuan Pelunasan Pinjaman*

_Assalamualaikum_, 
${props.name}

Mohon Maaf, Kami menginformasikan bahwa pengajuan pelunasan pinjaman Anda telah gagal diproses :

Pinjaman:
- No Pinjaman: ${props.pinjamanId}
- Waktu Pengembalian: ${props.angsuranDari} Bulan
- Jumlah: ${formatToIDR(props.ajuanPinjaman)}
- Angsuran Pinjaman : ${props.angsuranKe} / ${props.angsuranDari} Bulan 
- Jumlah yang Sudah Dibayarkan: ${formatToIDR(props.sudahDibayarkan)}

Pelunasan Pinjaman: 
- Nomor Transaksi: ${props.noPelunasanPinjaman}
- Tanggal: ${formatDatebyMonth(props.tanggalPelunasanPinjaman)}
- Jumlah Pelunasan: ${formatToIDR(props.jumlahPelunasanPinjaman)}
- Metode Pembayaran: ${props.jenisPelunasanPinjaman}

Status Pelunasan : *${props.statusPelunasanPinjaman}*

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePelunasanPinjamanApproved = (
  props: ITemplatePelunasanPinjaman,
) => {
  return `*Pemberitahuan Pelunasan Pinjaman*

_Assalamualaikum_, 
${props.name}

Kami dengan senang hati menginformasikan bahwa pengajuan pelunasan pinjaman Anda telah berhasil diproses :

Pinjaman:
- No Pinjaman: ${props.pinjamanId}
- Waktu Pengembalian: ${props.angsuranDari} Bulan
- Jumlah: ${formatToIDR(props.ajuanPinjaman)}
- Angsuran Pinjaman : ${props.angsuranKe} / ${props.angsuranDari} Bulan 
- Jumlah yang Sudah Dibayarkan: ${formatToIDR(props.sudahDibayarkan)}

Pelunasan Pinjaman: 
- Nomor Transaksi: ${props.noPelunasanPinjaman}
- Tanggal: ${formatDatebyMonth(props.tanggalPelunasanPinjaman)}
- Jumlah Pelunasan: ${formatToIDR(props.jumlahPelunasanPinjaman)}
- Metode Pembayaran: ${props.jenisPelunasanPinjaman}

Status Pelunasan : *${props.statusPelunasanPinjaman}*

Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export interface ITemplateAngsuranPelunasanPinjaman {
  nama: string;
  angsuran: TListAngsuranPinjaman;
}

export const templateAngsuranPelunasanPinjaman = (
  props: ITemplateAngsuranPelunasanPinjaman,
) => {
  return `*Pemberitahuan Angsuran Pinjaman*

  _Assalamualaikum_, 
  ${props.nama} 
  
  Kami ingin memberitahu bahwa angsuran pinjaman anda telah berhasil masuk. Detail transaksi dapat dilihat di bawah ini:

  No Pinjaman: ${props.angsuran.pinjamanId}
  - No.Angsuran: ${props.angsuran.noAngsuranPinjaman} 
  - Tanggal: ${formatDatebyMonth(props.angsuran.tanggalAngsuranPinjaman)}
  - Angsuran Ke: ${props.angsuran.angsuranPinjamanKe} Dari: ${props.angsuran.angsuranPinjamanDari}
  - Jumlah Angsuran: ${formatToIDR(props.angsuran.jumlahAngsuranPinjaman)}
  
  Status Pinjaman: *${props.angsuran.statusAngsuranPinjaman}*
   
  Terima kasih telah mempercayakan layanan kami. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.
  
  Hormat kami,  
  KOPKAR YAG 2024`;
};

export const templatePelunasanPinjamanPetugas = (
  props: ITemplatePelunasanPinjamanPetugas,
) => {
  return `*Pemberitahuan Pelunasan Pinjaman Anggota*

_Assalamualaikum_, 
${props.namaPetugas} - ${props.role}

Kami ingin memberitahukan bahwa permohonan Pelunasan Pinjaman anggota telah diajukan. Detail Pelunasan Anggota:

Nama: ${props.name}
Unit Garapan: ${props.unitGarapan}
Jenis Pinjaman: jenisPinjaman

Pinjaman:
- No Pinjaman: ${props.pinjamanId}
- Waktu Pengembalian: ${props.angsuranDari} Bulan
- Jumlah:${formatToIDR(props.ajuanPinjaman)} 
- Angsuran Pinjaman : ${props.angsuranKe} / ${props.angsuranDari} Bulan 
- Jumlah yang Sudah Dibayarkan: ${props.sudahDibayarkan}

Pelunasan Pinjaman:
- Nomor Transaksi: ${props.noPelunasanPinjaman} 
- Tanggal: ${formatDatebyMonth(props.tanggalPelunasanPinjaman)}
- Jumlah Pelunasan: ${props.jumlahPelunasanPinjaman}

Harap segera meninjau dan memproses permohonan ini sesuai dengan prosedur yang berlaku. Terimakasih

Hormat kami,  
KOPKAR YAG 2024`;
};

export interface ITemplatePengunduranAnggota {
  nama: string;
  unitGarapan: string;
  tanggalPengunduran: Date;
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
}

export interface ITemplatePengunduranPetugas
  extends ITemplatePengunduranAnggota {
  namaPetugas: string;
  role: string;
}

export const templatePengunduranAnggota = (
  props: ITemplatePengunduranAnggota,
) => {
  return `*Pemberitahuan Pengunduran Anggota*

_Assalamualaikum_, 
${props.nama}

Kami ingin menginformasikan bahwa permohonan pengunduran diri Anda telah diajukan. Berikut adalah rincian pengunduran diri Anda:
- Tanggal Pengunduran: ${formatDatebyMonth(props.tanggalPengunduran)}
- Alasan Pengunduran: ${props.keterangan}

Berikut semua kewajiban dan hak Anda:

Simpanan:
- Wajib: ${formatToIDR(props.wajib)}
- Sukamana: ${formatToIDR(props.sukamana)}
- Lebaran: ${formatToIDR(props.lebaran)}
- Qurban: ${formatToIDR(props.qurban)}
- Ubar: ${formatToIDR(props.ubar)}

Pinjaman Produktif:
- No Pinjaman: ${props.pinjamanJasa ? props.pinjamanJasa.noPinjaman : "-"}
- Angsuran: ${props.pinjamanJasa ? props.pinjamanJasa.angsuranKe : "-"} / ${props.pinjamanJasa ? props.pinjamanJasa.angsuranDari : "-"} Bulan
- Sudah dibayarkan: ${formatToIDR(props.pinjamanJasa ? props.pinjamanJasa.sudahDibayarkan : 0)}
- Jumlah Pelunasan: ${formatToIDR(props.pinjamanJasa ? props.pinjamanJasa.jumlahPelunasan : 0)}

Pinjaman Barang:
- No Pinjaman: ${props.pinjamanBarang ? props.pinjamanBarang.noPinjaman : "-"}
- Angsuran: ${props.pinjamanBarang ? props.pinjamanBarang.angsuranKe : "-"} / ${props.pinjamanBarang ? props.pinjamanBarang.angsuranDari : "-"} Bulan
- Sudah dibayarkan: ${formatToIDR(props.pinjamanBarang ? props.pinjamanBarang.sudahDibayarkan : 0)}
- Jumlah Pelunasan: ${formatToIDR(props.pinjamanBarang ? props.pinjamanBarang.jumlahPelunasan : 0)}

Total Keseluruhan:
- Administrasi: ${formatToIDR(props.biaya)}
- Jumlah Simpanan: ${formatToIDR(props.totalKotor)}
- Pelunasan Pinjaman Produktif: ${formatToIDR(props.pinjamanJasa ? props.pinjamanJasa.jumlahPelunasan : 0)}
- Pelunasan Pinjaman Barang: ${formatToIDR(props.pinjamanBarang ? props.pinjamanBarang.jumlahPelunasan : 0)}
- Jumlah Bersih: ${formatToIDR(props.totalBersih)}

Terima kasih telah mempercayakan layanan kami. Proses memperlukan 3-5 hari kerja. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,  
KOPKAR YAG 2024`;
};

export const templatePengunduranAnggotaApproved = (
  props: ITemplatePengunduranAnggota,
) => {
  return `*Pemberitahuan Pengunduran Anggota*

_Assalamualaikum_, 
${props.nama}

Kami menginformasikan bahwa permohonan pengunduran diri Anda telah kami terima dan disetujui. Tanggal efektif pengunduran diri Anda adalah *${formatDatebyMonth(props.tanggalPengunduran)}*. Terima kasih atas kontribusi Anda selama ini.

Hormat kami,
KOPKAR YAG 2024`;
};

export const templatePengunduranAnggotaRejected = (
  props: ITemplatePengunduranAnggota,
) => {
  return `*Pemberitahuan Pengunduran Anggota*

_Assalamualaikum_, 
${props.nama}

Mohon maaf, permohonan pengunduran diri Anda tidak dapat kami terima saat ini. Untuk pertanyaan atau informasi tambahan, hubungi petugas koperasi.

Hormat kami,
KOPKAR YAG 2024`;
};

export const templatePengunduranPetugas = (
  props: ITemplatePengunduranPetugas,
) => {
  return `*Pemberitahuan Pengunduran Anggota*

_Assalamualaikum_, 
${props.namaPetugas} - ${props.role}

Kami ingin memberitahukan bahwa permohonan pengunduran anggota telah diajukan. Berikut adalah rincian pengunduran diri Anggota:
- Nama: ${props.nama}
- Tanggal Pengunduran: ${formatDatebyMonth(props.tanggalPengunduran)}
- Alasan Pengunduran: ${props.keterangan}

Berikut semua kewajiban dan hak Anda:

Simpanan:
- Wajib: ${formatToIDR(props.wajib)}
- Sukamana: ${formatToIDR(props.sukamana)}
- Lebaran: ${formatToIDR(props.lebaran)}
- Qurban: ${formatToIDR(props.qurban)}
- Ubar: ${formatToIDR(props.ubar)}

Pinjaman Produktif:
- No Pinjaman: ${props.pinjamanJasa ? props.pinjamanJasa.noPinjaman : "-"}
- Angsuran: ${props.pinjamanJasa ? props.pinjamanJasa.angsuranKe : "-"} / ${props.pinjamanJasa ? props.pinjamanJasa.angsuranDari : "-"} Bulan
- Sudah dibayarkan: ${formatToIDR(props.pinjamanJasa ? props.pinjamanJasa.sudahDibayarkan : 0)}
- Jumlah Pelunasan: ${formatToIDR(props.pinjamanJasa ? props.pinjamanJasa.jumlahPelunasan : 0)}

Pinjaman Barang:
- No Pinjaman: ${props.pinjamanBarang ? props.pinjamanBarang.noPinjaman : "-"}
- Angsuran: ${props.pinjamanBarang ? props.pinjamanBarang.angsuranKe : "-"} / ${props.pinjamanBarang ? props.pinjamanBarang.angsuranDari : "-"} Bulan
- Sudah dibayarkan: ${formatToIDR(props.pinjamanBarang ? props.pinjamanBarang.sudahDibayarkan : 0)}
- Jumlah Pelunasan: ${formatToIDR(props.pinjamanBarang ? props.pinjamanBarang.jumlahPelunasan : 0)}

Total Keseluruhan:
- Administrasi: ${formatToIDR(props.biaya)}
- Jumlah Simpanan: ${formatToIDR(props.totalKotor)}
- Pelunasan Pinjaman Produktif: ${formatToIDR(props.pinjamanJasa ? props.pinjamanJasa.jumlahPelunasan : 0)}
- Pelunasan Pinjaman Barang: ${formatToIDR(props.pinjamanBarang ? props.pinjamanBarang.jumlahPelunasan : 0)}
- Jumlah Bersih: ${formatToIDR(props.totalBersih)}

Harap segera meninjau dan memproses permohonan ini sesuai dengan prosedur yang berlaku. Terimakasih

Hormat kami,  
KOPKAR YAG 2024`;
};
