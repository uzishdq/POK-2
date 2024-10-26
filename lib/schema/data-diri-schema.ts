import * as z from "zod";
const NumberOrEmptyStringSchema = z.union([
  z.number(),
  z.string(),
  z.literal(""),
]);

export const DataDiriSchema = z.object({
  noTelp: z
    .string({
      required_error: "tidak boleh kosong",
    })
    .min(10, { message: "harus terdiri dari setidaknya 10 karakter" })
    .max(15, { message: "tidak boleh lebih dari 15 karakter" })
    .refine((value) => value.startsWith("0"), {
      message: "Nomor telepon harus dimulai dengan angka 0",
    }),
  namaBank: z
    .string({
      required_error: "tidak boleh kosong",
    })
    .min(1, "tidak boleh kosong")
    .max(20, "tidak boleh lebih dari 20 karakter"),
  noRek: z
    .string({
      required_error: "tidak boleh kosong",
    })
    .min(10, { message: "harus terdiri dari setidaknya 10 karakter" })
    .max(20, { message: "tidak boleh lebih dari 20 karakter" })
    .regex(/^[^-]*$/, { message: "tidak boleh mengandung karakter -" }),
  pilManasuka: NumberOrEmptyStringSchema.transform((val) =>
    typeof val === "string" ? Number(val.replace(/[^\d-]/g, "")) : val
  )
    .refine((n) => (n >= 15000 && n <= 750000) || n === 0, {
      message: "Simpanan sukamana hanya di antara Rp 15.000 dan Rp 750.000",
    })
    .optional(),
});
