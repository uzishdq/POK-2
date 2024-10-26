"use client";
import { RegisterSchema } from "@/lib/schema/auth-shema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CardWrapperAuth from "../card-wrapper-auth";
import { ROUTES } from "@/lib/constan";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FromStatus from "../form-status";
import { useRouter } from "next/navigation";
import { register } from "@/lib/action/register";
import ButtonLoading from "@/components/button-loading";

export default function FormRegister() {
  const [message, setMessage] = useState<string | undefined>("");
  const [status, setStatus] = useState<boolean | undefined>(false);

  const router = useRouter();
  const [isPending, startTranssition] = useTransition();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      nik: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTranssition(() => {
      register(values).then((data) => {
        setStatus(data?.ok);
        setMessage(data?.message);
        if (data?.ok) {
          form.reset();
          setTimeout(() => {
            router.push(ROUTES.LOGIN);
          }, 1000);
        }
      });
    });
  };
  return (
    <CardWrapperAuth
      backButtonLabel="sudah jadi anggota?"
      backButtonHref={ROUTES.LOGIN}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FromStatus status={status} message={message} />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No.KTP / NIP {"(nomor induk pegawai)"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="328981****" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                      placeholder="**********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="**********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!isPending ? (
            <Button type="submit" className="w-full" disabled={isPending}>
              Daftar
            </Button>
          ) : (
            <ButtonLoading className="w-full" />
          )}
        </form>
      </Form>
    </CardWrapperAuth>
  );
}
