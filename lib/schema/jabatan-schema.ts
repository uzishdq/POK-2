import * as z from "zod";

export const JabatanSchema = z.object({
  namaJabatan: z
    .string()
    .min(5, "harus berisi setidaknya 5 karakter")
    .max(100, "paling banyak 100 karakter"),
});
