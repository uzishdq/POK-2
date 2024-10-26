"use client";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifUserSchema } from "@/lib/schema/auth-shema";
import CardWrapperAuth from "../card-wrapper-auth";
import { ROUTES } from "@/lib/constan";
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
import { Button } from "@/components/ui/button";
import ButtonLoading from "@/components/button-loading";
import FormPassword from "./form-password";
import { validUser } from "@/lib/action/reset-password";

export default function FormResetPassword() {
  const [message, setMessage] = useState<string | undefined>("");
  const [status, setStatus] = useState<boolean | undefined>(false);
  const [isVerif, setIsVerif] = useState<boolean | undefined>(false);
  const [user, setUser] = useState<string | undefined>(undefined);

  const [isPending, startTranssition] = useTransition();

  const formVerif = useForm<z.infer<typeof verifUserSchema>>({
    resolver: zodResolver(verifUserSchema),
    defaultValues: {
      nik: "",
      email: "",
    },
  });

  const onVerif = (values: z.infer<typeof verifUserSchema>) => {
    startTranssition(() => {
      validUser(values).then((data) => {
        setStatus(data?.ok);
        setMessage(data?.message);
        if (data.ok) {
          setIsVerif(true);
          setUser(data.value);
        }
      });
    });
  };

  return (
    <CardWrapperAuth backButtonLabel="Login ?" backButtonHref={ROUTES.LOGIN}>
      {!isVerif && !user ? (
        <Form {...formVerif}>
          <form
            onSubmit={formVerif.handleSubmit(onVerif)}
            className="space-y-4"
          >
            <FromStatus status={status} message={message} />
            <div className="space-y-4">
              <FormField
                control={formVerif.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      No.KTP / NIP {"(nomor induk pegawai)"}
                    </FormLabel>
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
                control={formVerif.control}
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
            {!isPending ? (
              <Button type="submit" className="w-full" disabled={isPending}>
                Verifikasi
              </Button>
            ) : (
              <ButtonLoading className="w-full" />
            )}
          </form>
        </Form>
      ) : (
        <FormPassword username={user} />
      )}
    </CardWrapperAuth>
  );
}
