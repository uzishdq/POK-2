import * as z from "zod";
import { formatToIDR } from "../helper";

export const NumberOrEmptyStringSchema = z.union([
  z.number(),
  z.string(),
  z.literal(""),
]);

export const enumJenisSimpanan = [
  "MANASUKA",
  "LEBARAN",
  "QURBAN",
  "UBAR",
] as const;

export const PengambilanSimpananSchema = (limit: number, type: string) =>
  z.object({
    anggotaId: z.string().min(1),
    jenisPengambilanSimpanan: z.enum(enumJenisSimpanan, {
      message: "required",
    }),
    jumlahPengambilanSimpanan: NumberOrEmptyStringSchema.transform((val) =>
      typeof val === "string" ? Number(val.replace(/[^\d-]/g, "")) : val,
    ).refine((n) => n >= 50000 && n <= limit, {
      message:
        limit === 0
          ? `maaf anda tidak dapat melakukan penarikan simpanan ${type} karena saldo anda ${formatToIDR(limit)}`
          : limit <= 50000
            ? `maaf anda tidak dapat melakukan penarikan simpanan ${type} karena saldo anda ${formatToIDR(limit)} atau kurang dari Rp 50.000, coba jenis simpanan yang lain.`
            : `jumlah minimal penarikan simpanan ${type} Rp 50.000 dan maksimal ${formatToIDR(limit)}`,
    }),
  });

export type PengambilanSimpananSchemaType = z.infer<
  ReturnType<typeof PengambilanSimpananSchema>
>;

// export const LaporanSimpananSchema = z.object({
//   jenis: z.enum(enumJenisSimpanan, { message: "required" }),
//   startDate: z.date(),
//   endDate: z.date(),
// });
