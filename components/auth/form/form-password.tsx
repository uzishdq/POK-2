"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { resetPasswordSchema } from "@/lib/schema/auth-shema";
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
import { resetPassword } from "@/lib/action/reset-password";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/constan";

interface IFormPassword {
  username: string | undefined;
}

export default function FormPassword({ username }: IFormPassword) {
  const router = useRouter();
  const [message, setMessage] = useState<string | undefined>("");
  const [status, setStatus] = useState<boolean | undefined>(false);

  const [isPending, startTranssition] = useTransition();

  const formPass = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: username,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    startTranssition(() => {
      resetPassword(values).then((data) => {
        setStatus(data.ok);
        setMessage(data.message);
        if (data.ok) {
          formPass.reset();
          setTimeout(() => {
            router.push(DEFAULT_LOGIN_REDIRECT);
          }, 2000);
        }
      });
    });
  };

  return (
    <Form {...formPass}>
      <form onSubmit={formPass.handleSubmit(onSubmit)} className="space-y-4">
        <FromStatus status={status} message={message} />
        <div className="space-y-4">
          <FormField
            control={formPass.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="**********" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={formPass.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="**********" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {!isPending ? (
          <Button type="submit" className="w-full" disabled={isPending}>
            Reset Password
          </Button>
        ) : (
          <ButtonLoading className="w-full" />
        )}
      </form>
    </Form>
  );
}
