"use server";
import * as z from "zod";
import { LoginSchema } from "../schema/auth-shema";
import { signIn } from "next-auth/react";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const validateValues = LoginSchema.safeParse(values);

    if (!validateValues.success) {
      return {
        ok: false,
        message: "invalid field!",
      };
    }
    const { email, password } = validateValues.data;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      return {
        ok: false,
        message: "gagal login",
      };
    } else {
      return {
        ok: true,
        message: "berhasil login",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message:
        "Telah terjadi kesalahan ketika melakukan proses login, silahkan coba lagi nanti.",
    };
  }
};
