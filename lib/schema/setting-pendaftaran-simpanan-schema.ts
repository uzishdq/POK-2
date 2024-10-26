import * as z from "zod";

const enumJenisPendaftaran = [
  "simpanan-lebaran",
  "simpanan-qurban",
  "simpanan-ubar",
] as const;

const NumberOrEmptyStringSchema = z.union([
  z.number(),
  z.string(),
  z.literal(""),
]);

export const SettingPendaftaranSchema = z.object({
  namaPendaftaran: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter"),
  jenisPendaftaran: z.enum(enumJenisPendaftaran, {
    message: "jenis simpanan diperlukan",
  }),
  date: z
    .object(
      {
        from: z.date().optional(),
        to: z.date().optional(),
      },
      { required_error: "tanggal diperlukan" },
    )
    .refine((date) => !!date.from && !!date.to, {
      message: "tanggal diperlukan",
    }),
  tanggalTutupPendaftaran: z.date(),
});

export const PendaftarSimpananSchema = z.object({
  anggotaId: z.string().min(2),
  pendaftaranId: z.number(),
  jumlahPilihan: NumberOrEmptyStringSchema.transform((val) =>
    typeof val === "string" ? Number(val.replace(/[^\d-]/g, "")) : val,
  ).refine((n) => (n >= 15000 && n <= 1000000) || n === 0, {
    message: "simpanan hanya di antara Rp 15.000 dan Rp 1.000.000",
  }),
});

export const SimpananBerjangkaSchema = z.object({
  jenisPendaftaran: z.enum(enumJenisPendaftaran, {
    message: "nama pendaftaran diperlukan",
  }),
});
