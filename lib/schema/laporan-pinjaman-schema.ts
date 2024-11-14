import * as z from "zod";

const enumStatusLaporanPinjaman = ["APPROVED", "COMPLETED"] as const;
const enumJenisPinjaman = ["BARANG", "JASA"] as const;

export const laporanPinjamanSchema = z.object({
  jenisPinjaman: z.enum(enumJenisPinjaman, {
    required_error: "Jenis laporan pinjaman harus diisi",
    invalid_type_error: "Jenis laporan pinjaman tidak valid",
  }),
  statusPinjaman: z.enum(enumStatusLaporanPinjaman, {
    required_error: "Status laporan pinjaman harus diisi",
    invalid_type_error: "Status laporan pinjaman tidak valid",
  }),
});
