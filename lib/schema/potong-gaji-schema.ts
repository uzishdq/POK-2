import * as z from "zod";

const typeExcell = [
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const inputFile = z
  .custom<File>()
  .refine((file) => {
    return !!file && typeExcell.includes(file.type);
  }, "file harus berupa excell")
  .refine((file) => {
    return !!file && file.size < 1024 * 1024 * 5;
  }, "ukuran maksimal file 5MB");

export const InputPotongGajiSchema = z.object({
  file: inputFile,
});

const StringOrNumberOrNull = z.union([z.string(), z.number(), z.null()]);

export const JsonPotongGajiSchema = z.array(
  z
    .object({
      anggotaId: z.string(),
      nama: z.string(),
      unitGarapan: z.string(),
      simpananWajib: z.number().nullable(),
      simpananManasuka: z.number().nullable(),
      simpananLebaran: z.number().nullable(),
      simpananQurban: z.number().nullable(),
      simpananUbar: z.number().nullable(),
      noPinjamanJasa: z.string().nullable(),
      AngsuranKeJasa: StringOrNumberOrNull,
      AngsuranDariJasa: StringOrNumberOrNull,
      jumlahAngsuranJasa: StringOrNumberOrNull,
      noPinjamanBarang: z.string().nullable(),
      AngsuranKeBarang: StringOrNumberOrNull,
      AngsuranDariBarang: StringOrNumberOrNull,
      jumlahAngsuranBarang: StringOrNumberOrNull,
      total: z.number().nullable(),
    })
    .refine(
      (data) => {
        const validatePair = (
          start: number | string | null,
          after: number | string | null,
        ): boolean => {
          if (start === null || after === null) return true;
          if (start === "-" || after === "-") return true;

          const startValue =
            typeof start === "string" ? parseFloat(start) : start;
          const afterValue =
            typeof after === "string" ? parseFloat(after) : after;

          return startValue <= afterValue;
        };

        return (
          validatePair(data.AngsuranKeJasa, data.AngsuranDariJasa) &&
          validatePair(data.AngsuranKeBarang, data.AngsuranDariBarang)
        );
      },
      {
        message: "angsuran ke tidak boleh lebih dari angsuran dari",
        path: ["AngsuranKeJasa", "AngsuranKeBarang"],
      },
    ),
);
