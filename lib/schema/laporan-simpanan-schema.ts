import * as z from "zod";

const enumJenisLaporanSimpanan = [
  "laporan-simpanan-wajib-sukamana",
  "laporan-simpanan-lebaran",
  "laporan-simpanan-qurban",
  "laporan-simpanan-ubar",
] as const;

export const laporanSimpananSchema = z
  .object({
    jenisLaporanSimpanan: z.enum(enumJenisLaporanSimpanan, {
      required_error: "Jenis laporan simpanan harus diisi.",
      invalid_type_error: "Jenis laporan simpanan tidak valid.",
    }),
    date: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.jenisLaporanSimpanan === "laporan-simpanan-wajib-sukamana") {
        return !!data.date.from && !!data.date.to;
      } else {
        return true;
      }
    },
    {
      message:
        "Rentang Tanggal harus diisi untuk laporan simpanan wajib sukamana.",
      path: ["date"],
    },
  );
