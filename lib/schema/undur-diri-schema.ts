import * as z from "zod";

const enumJenisUndurDiri = ["TRANSFER", "CASH"] as const;

const numberNotMinus = z.number().min(0, "tidak boleh kurang dari 0");

export const CekUndurDiriSchema = z.object({
  anggotaId: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(10, "paling banyak 10 karakter"),
  noUser: z.string().min(5, "harus berisi setidaknya 5 karakter"),
  keterangan: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter")
    .regex(/^[a-zA-Z0-9. ]*$/, "tidak boleh mengandung karakter spesial"),
});

export const UndurDiriSchema = z.object({
  anggotaId: z.string().min(5, "harus berisi setidaknya 5 karakter"),
  noUser: z.string().min(5, "harus berisi setidaknya 5 karakter"),
  keterangan: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter"),
  biayaPengunduranDiri: numberNotMinus,
  simpananWajibPengunduranDiri: numberNotMinus,
  simpananManasukaPengunduranDiri: numberNotMinus,
  simpananLebaranPengunduranDiri: numberNotMinus,
  simpananQurbanPengunduranDiri: numberNotMinus,
  simpananUbarPengunduranDiri: numberNotMinus,
  totalPengunduranDiri: numberNotMinus,
  totalDiterimaPengunduranDiri: numberNotMinus,
  jenisUndurDiri: z.enum(enumJenisUndurDiri),
});
