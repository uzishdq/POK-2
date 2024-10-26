"use server";

import * as z from "zod";
import { DataDiriSchema } from "../schema/data-diri-schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "../prisma";
import { formatToNumber } from "../helper";
import { revalidateTag } from "next/cache";

export const updateDataDiri = async (
  values: z.infer<typeof DataDiriSchema>,
) => {
  const session = await getServerSession(authOptions);
  const validateValues = DataDiriSchema.safeParse(values);

  if (!validateValues.success) {
    return { ok: false, message: "Invalid Field!" };
  }
  const { noRek, namaBank, noTelp, pilManasuka } = validateValues.data;
  const pilManasukaNumber = formatToNumber(pilManasuka);

  if (!session) {
    return { ok: false, message: "session telah berakhir" };
  }

  if (session.user.id && session.user.sub) {
    try {
      const updateAnggota = await prisma.anggota.update({
        where: {
          noAnggota: session.user.id,
        },
        data: {
          namaBank,
          noRek,
          noTelp,
          pilManasuka: pilManasukaNumber,
        },
      });
      if (updateAnggota) {
        const updateUser = await prisma.user.update({
          where: { id: session.user.sub },
          data: {
            statusUser: "APPROVED",
          },
        });
        if (updateUser) {
          revalidateTag("profile");
          revalidateTag("list-anggota-koperasi");
          revalidateTag("total-anggota-koperasi");
          return { ok: true, message: "data berhasil disimpan" };
        } else {
          return { ok: false, message: "data gagal disimpan" };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};
