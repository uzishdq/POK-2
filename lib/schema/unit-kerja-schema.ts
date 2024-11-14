import * as z from "zod";

export const UnitKerjaSchema = z.object({
  namaUnitKerja: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(50, "paling banyak 50 karakter")
    .regex(/^[a-zA-Z0-9. ]*$/, "tidak boleh mengandung karakter spesial"),
  alamatKantor: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(250, "paling banyak 250 karakter")
    .regex(/^[a-zA-Z0-9. ]*$/, "tidak boleh mengandung karakter spesial"),
});
