"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/schema/auth-shema";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CardWrapperAuth from "../card-wrapper-auth";
import { DEFAULT_LOGIN_REDIRECT, ROUTES } from "@/lib/constan";
import FromStatus from "../form-status";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ButtonLoading from "@/components/button-loading";

export default function FormLogin() {
  const router = useRouter();
  const [message, setMessage] = useState<string | undefined>("");
  const [status, setStatus] = useState<boolean | undefined>(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    return await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    })
      .then((data) => {
        if (data?.ok) {
          setStatus(data.ok);
          setMessage("login berhasil");
          form.reset();
          setTimeout(() => {
            router.push(DEFAULT_LOGIN_REDIRECT);
          }, 2000);
        } else {
          setStatus(false);
          setMessage("username / password tidak sesuai");
        }
      })
      .catch((err) => {
        setStatus(false);
        setMessage(
          "Telah terjadi kesalahan ketika melakukan proses login, silahkan coba lagi nanti.",
        );
        console.error(err);
      });
  };

  return (
    <CardWrapperAuth
      backButtonLabel="belum jadi anggota?"
      backButtonHref={ROUTES.DAFTAR}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FromStatus status={status} message={message} />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="**********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Link
            href={ROUTES.RESET_PASSWORD}
            className="ml-auto inline-block text-sm underline"
          >
            Lupa password?
          </Link>
          {!form.formState.isSubmitting ? (
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Login
            </Button>
          ) : (
            <ButtonLoading className="w-full" />
          )}
        </form>
      </Form>
    </CardWrapperAuth>
  );
}
