import * as z from "zod";

const enumJenisKelamin = ["Laki-Laki", "Perempuan"] as const;
const enumStatusPekerjaan = ["TETAP", "HONORER", "KONTRAK"] as const;
const NumberOrEmptyStringSchema = z.union([
  z.number(),
  z.string(),
  z.literal(""),
]);

export const ProfileSchema = z.object({
  nik: z
    .string()
    .min(8, "harus berisi setidaknya 8 karakter")
    .max(20, "paling banyak 20 karakter"),
  nip: z
    .string()
    .min(8, "harus berisi setidaknya 8 karakter")
    .max(20)
    .optional()
    .or(z.literal("")),
  nama: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter")
    .regex(/^[a-zA-Z0-9., ]*$/, "tidak boleh mengandung karakter spesial"),
  tanggalLahir: z.date(),
  tempatLahir: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter")
    .regex(/^[a-zA-Z0-9.]*$/, "tidak boleh mengandung karakter spesial"),
  jenisKelamin: z.enum(enumJenisKelamin),
  alamat: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter")
    .regex(/^[a-zA-Z0-9. ]*$/, "tidak boleh mengandung karakter spesial"),
  noTelp: z
    .string()
    .min(10, { message: "harus terdiri dari setidaknya 10 karakter" })
    .max(15, { message: "tidak boleh lebih dari 15 karakter" })
    .refine((value) => value.startsWith("0"), {
      message: "Nomor telepon harus dimulai dengan angka 0",
    }),
  jabatanId: NumberOrEmptyStringSchema.transform((val) =>
    typeof val === "string" ? Number(val) : val,
  ).refine((n) => n >= 1, {
    message: "tidak boleh kosong",
  }),
  statusPekerjaan: z.enum(enumStatusPekerjaan),
  unitKerjaId: NumberOrEmptyStringSchema.transform((val) =>
    typeof val === "string" ? Number(val) : val,
  ).refine((n) => n >= 1, {
    message: "tidak boleh kosong",
  }),
  namaBank: z
    .string({ required_error: "tidak boleh kosong" })
    .min(2, "harus berisi setidaknya 2 karakter")
    .max(10, "paling banyak 10 karakter")
    .regex(/^[a-zA-Z0-9. ]*$/, "tidak boleh mengandung karakter spesial"),
  noRek: z
    .string()
    .min(10, { message: "harus terdiri dari setidaknya 10 karakter" })
    .max(20, { message: "tidak boleh lebih dari 20 karakter" })
    .regex(/^[^-]*$/, { message: "tidak boleh mengandung karakter -" }),
  pilManasuka: NumberOrEmptyStringSchema.transform((val) =>
    typeof val === "string" ? Number(val.replace(/[^\d-]/g, "")) : val,
  )
    .refine((n) => (n >= 15000 && n <= 750000) || n === 0, {
      message: "Simpanan sukamana hanya di antara Rp 15.000 dan Rp 750.000",
    })
    .optional(),
});
