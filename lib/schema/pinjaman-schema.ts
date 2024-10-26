import * as z from "zod";
import { NumberOrEmptyStringSchema } from "./simpanan-schema";
import { formatToIDR } from "../helper";

const enumJenisPinjaman = ["JASA", "BARANG"] as const;
const typeImage = ["image/png", "image/jpg", "image/jpeg"];

export const NumberStringSchema = z.union([z.string(), z.literal("")]);

const inputFilePic = z
  .custom<File>()
  .refine((file) => {
    return !!file && typeImage.includes(file.type);
  }, "file harus berupa image")
  .refine((file) => {
    return !!file && file.size < 1024 * 1024 * 2;
  }, "ukuran maksimal file 2MB");

export const PengajuanPinjamanSchema = (limit: number) =>
  z.object({
    anggotaId: z.string().min(1),
    tujuanPinjaman: z
      .string()
      .min(5, "harus berisi setidaknya 5 karakter")
      .max(40, "paling banyak 40 karakter"),
    waktuPengembalian: NumberStringSchema.transform((val) =>
      typeof val === "string" ? Number(val.replace(/[^\d-]/g, "")) : val,
    ).refine((n) => n >= 5 && n <= 36, {
      message: "waktu pengembalian antara 5 dan 36, bulan",
    }),
    jenisPinjaman: z.enum(enumJenisPinjaman),
    jumlahPenghasilan: NumberStringSchema.transform((val) =>
      typeof val === "string" ? Number(val.replace(/[^\d-]/g, "")) : val,
    ).refine((n) => n >= 50000 && n <= 20000000, {
      message:
        "penghasilan hanya dapat berada di antara Rp 50.000 dan Rp.20.000.000",
    }),
    ajuanPinjaman: NumberStringSchema.transform((val) =>
      typeof val === "string" ? Number(val.replace(/[^\d-]/g, "")) : val,
    ).refine((n) => n >= 50000 && n <= limit, {
      message:
        limit === 0
          ? "maaf anda tidak dapat melakukan pengajuan pinjaman karena saldo simpanan anda 0."
          : `besaran pinjaman anda hanya dapat berada di antara Rp 50.000 dan ${formatToIDR(limit)}`,
    }),
    strukGaji: inputFilePic,
  });

export type PengajuanPinjamanSchemaType = z.infer<
  ReturnType<typeof PengajuanPinjamanSchema>
>;
