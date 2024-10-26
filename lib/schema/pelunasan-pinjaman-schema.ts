import * as z from "zod";

const enumJenisPelunasanPinjaman = ["TRANSFER", "CASH"] as const;
const typeImage = ["image/png", "image/jpg", "image/jpeg"];

const inputFilePic = z
  .custom<File>()
  .refine((file) => {
    return !!file && typeImage.includes(file.type);
  }, "file harus berupa image")
  .refine((file) => {
    return !!file && file.size < 1024 * 1024 * 2;
  }, "ukuran maksimal file 2MB");

export const PelunasanPinjamanSchema = (limit: number) =>
  z.object({
    pinjamanId: z
      .string()
      .min(5, "harus berisi setidaknya 5 karakter")
      .max(15, "paling banyak 15 karakter"),
    angsuranKePelunasanPinjaman: z.number(),
    sudahDibayarkan: z.number().min(0, "tidak boleh kurang dari 0"),
    buktiPelunasanPinjaman: inputFilePic,
    jenisPelunasanPinjaman: z.enum(enumJenisPelunasanPinjaman),
    jumlahPelunasanPinjaman: z.union([z.string(), z.number()]).refine(
      (val) => {
        const num = typeof val === "string" ? parseFloat(val) : val;
        return num === limit;
      },
      {
        message: "jumlah Pelunasan tidak sesuai.",
      },
    ),
  });

export type PelunasanPinjamanSchemaType = z.infer<
  ReturnType<typeof PelunasanPinjamanSchema>
>;

export const cekPelunasanSchema = z.object({
  pinjamanId: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(15, "paling banyak 15 karakter"),
});
