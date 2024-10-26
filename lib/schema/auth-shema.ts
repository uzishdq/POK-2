import * as z from "zod";

export const email = z
  .string({
    required_error: "tidak boleh kosong",
  })
  .min(5, "harus berisi setidaknya 5 karakter")
  .max(50, "paling banyak 50 karakter")
  .refine((email) => !/\s/.test(email), {
    message: "tidak boleh menggandung spasi",
  });

const password = z
  .string({
    required_error: "tidak boleh kosong",
  })
  .min(6, "harus berisi setidaknya 6 karakter")
  .max(50, "paling banyak 50 karakter");

export const RegisterSchema = z
  .object({
    nik: z
      .string({
        required_error: "tidak boleh kosong",
      })
      .min(8, "harus berisi setidaknya 8 karakter")
      .max(20, "paling banyak 20 karakter"),
    email: email,
    password: password,
    confirmPassword: z
      .string({
        required_error: "tidak boleh kosong",
      })
      .min(6, "harus berisi setidaknya 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password tidak sama !",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: email,
  password: password,
});

export const verifUserSchema = z.object({
  nik: z
    .string({
      required_error: "tidak boleh kosong",
    })
    .min(8, "harus berisi setidaknya 8 karakter")
    .max(20, "paling banyak 20 karakter"),
  email: email,
});

export const resetPasswordSchema = z
  .object({
    email: email,
    password: password,
    confirmPassword: z
      .string({ required_error: "tidak boleh kosong" })
      .min(6, "harus berisi setidaknya 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password tidak sama !",
    path: ["confirmPassword"],
  });
