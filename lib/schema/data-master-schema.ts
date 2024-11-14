import * as z from "zod";

const enumJenisKelamin = ["Laki-Laki", "Perempuan"] as const;
const enumStatusPekerjaan = ["TETAP", "HONORER", "KONTRAK"] as const;
const NumberOrEmptyStringSchema = z.union([
  z.number(),
  z.string(),
  z.literal(""),
]);

export const DataMasterSchema = z.object({
  nipMaster: z
    .string()
    .min(8, "harus berisi setidaknya 8 karakter")
    .max(20, "paling banyak 20 karakter")
    .optional()
    .or(z.literal("")),
  nikMaster: z
    .string()
    .min(8, "harus berisi setidaknya 8 karakter")
    .max(20, "paling banyak 20 karakter"),
  namaMaster: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter")
    .regex(/^[a-zA-Z0-9. ]*$/, "tidak boleh mengandung karakter spesial"),
  tempatLahirMaster: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter")
    .regex(/^[a-zA-Z0-9. ]*$/, "tidak boleh mengandung karakter spesial"),
  tanggalLahirMaster: z.date(),
  jenisKelaminMaster: z.enum(enumJenisKelamin),
  alamatMaster: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter")
    .regex(/^[a-zA-Z0-9. ]*$/, "tidak boleh mengandung karakter spesial"),
  statusPekerjaanMaster: z.enum(enumStatusPekerjaan),
  unitKerjaMaster: NumberOrEmptyStringSchema.transform((val) =>
    typeof val === "string" ? Number(val) : val,
  ).refine((n) => n >= 1, {
    message: "tidak boleh kosong",
  }),
  jabatanMaster: NumberOrEmptyStringSchema.transform((val) =>
    typeof val === "string" ? Number(val) : val,
  ).refine((n) => n >= 1, {
    message: "tidak boleh kosong",
  }),
});
