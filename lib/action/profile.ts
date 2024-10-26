"use server";

import * as z from "zod";
import { ProfileSchema } from "../schema/profile-shema";
import prisma from "../prisma";
import { revalidateTag } from "next/cache";

export const updateProfile = async (
  noAnggota: string,
  values: z.infer<typeof ProfileSchema>,
) => {
  const validateValues = ProfileSchema.safeParse(values);

  if (!validateValues.success) {
    return { ok: false, message: "Invalid Field!" };
  }

  const updateProfile = await prisma.anggota.update({
    where: {
      noAnggota,
    },
    data: validateValues.data,
  });

  if (updateProfile) {
    revalidateTag("profile");
    revalidateTag("get-tanggal-lahir");
    revalidateTag("list-pinjaman-jasa");
    revalidateTag("list-pinjaman-barang");
    revalidateTag("list-pengambilan");
    revalidateTag("list-potongan-gaji");
    revalidateTag("list-anggota-koperasi");
    return { ok: true, message: "Data berhasil disimpan" };
  } else {
    return { ok: false, message: "Data gagal disimpan" };
  }
};
