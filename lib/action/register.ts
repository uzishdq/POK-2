"use server";

import prisma from "@/lib/prisma";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "../schema/auth-shema";
import { getMasterbyNik } from "../data/master";
import { getUserbyEmail } from "../data/user";
import { revalidateTag } from "next/cache";

async function generateCustomID() {
  const maxIDResult = await prisma.anggota.aggregate({
    _max: {
      noAnggota: true,
    },
  });

  const maxID = maxIDResult._max.noAnggota || "A-000";
  const currentNumber = parseInt(maxID.split("-")[1], 10);
  const nextNumber = currentNumber + 1;
  const nextID = `A-${nextNumber.toString().padStart(3, "0")}`;

  return nextID;
}
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateValues = RegisterSchema.safeParse(values);

  if (!validateValues.success) {
    return { ok: false, message: "Invalid field!" };
  }
  const { nik, email, password } = validateValues.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const isMaster = await getMasterbyNik(nik);
  if (!isMaster) {
    return {
      ok: false,
      message: "no.ktp / nip tidak terdaftar",
    };
  }
  if (isMaster?.emailMaster !== null) {
    return { ok: false, message: "no.ktp / nip sudah terpakai" };
  }

  const isUser = await getUserbyEmail(email);
  if (isUser) {
    return { ok: false, message: "username sudah terpakai" };
  }

  const updateMasterEmail = await prisma.master.update({
    where: { idMaster: isMaster.idMaster },
    data: {
      emailMaster: email,
    },
  });

  if (updateMasterEmail) {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    if (user) {
      const customId = await generateCustomID();
      const newAnggota = await prisma.anggota.create({
        data: {
          noAnggota: customId,
          nik: isMaster.nikMaster,
          nip: isMaster.nipMaster,
          nama: isMaster.namaMaster,
          tanggalLahir: isMaster.tanggalLahirMaster,
          tempatLahir: isMaster.tempatLahirMaster,
          jenisKelamin: isMaster.jenisKelaminMaster,
          alamat: isMaster.alamatMaster,
          statusPekerjaan: isMaster.statusPekerjaanMaster,
          jabatanId: isMaster.jabatanMaster,
          unitKerjaId: isMaster.unitKerjaMaster,
          userEmail: email,
        },
      });

      if (newAnggota) {
        revalidateTag("list-potongan-gaji");
        revalidateTag("list-anggota-koperasi");
        revalidateTag("total-anggota-koperasi");
        return {
          ok: true,
          message: "registrasi berhasil",
        };
      }
    }
  }
};
