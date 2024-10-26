"use server";

import prisma from "@/lib/prisma";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { resetPasswordSchema, verifUserSchema } from "../schema/auth-shema";
import { getMasterbyNik } from "../data/master";
import { getUserbyEmail } from "../data/user";

export const validUser = async (values: z.infer<typeof verifUserSchema>) => {
  const validateValues = verifUserSchema.safeParse(values);

  if (!validateValues.success) {
    return { ok: false, message: "Invalid field!", value: undefined };
  }
  const { nik, email } = validateValues.data;

  const isMaster = await getMasterbyNik(nik);
  if (!isMaster) {
    return {
      ok: false,
      message: "no.ktp / nip tidak terdaftar",
      value: undefined,
    };
  }

  const isUser = await getUserbyEmail(email);
  if (!isUser) {
    return { ok: false, message: "username tidak ditemukan", value: undefined };
  }

  if (isMaster?.emailMaster === isUser?.email) {
    return {
      ok: true,
      message: "verifikasi berhasil, silahkan ganti password",
      value: isUser.email,
    };
  } else {
    return {
      ok: false,
      message: "verifikasi gagal: username tidak sesuai dengan no.ktp/nip.",
      value: undefined,
    };
  }
};

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>,
) => {
  const validateValues = resetPasswordSchema.safeParse(values);
  if (!validateValues.success) {
    return { ok: false, message: "Invalid field!" };
  }
  const { email, password } = validateValues.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const reset = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });

  if (reset) {
    return {
      ok: true,
      message: "reset password berhasil",
    };
  } else {
    return {
      ok: true,
      message: "reset password gagal",
    };
  }
};
