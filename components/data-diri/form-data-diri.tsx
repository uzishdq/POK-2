"use client";
import { DataDiriSchema } from "@/lib/schema/data-diri-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { LABEL, PICTURES, ROUTES, bank } from "@/lib/constan";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import InputCurrency from "../ui/input-currency";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import FromStatus from "../auth/form-status";
import { updateDataDiri } from "@/lib/action/data-diri";
import { useRouter } from "next/navigation";

export default function FormDataDiri() {
  const [message, setMessage] = useState<string | undefined>("");
  const [status, setStatus] = useState<boolean | undefined>(false);

  const router = useRouter();
  const [isPending, startTranssition] = useTransition();
  const form = useForm<z.infer<typeof DataDiriSchema>>({
    resolver: zodResolver(DataDiriSchema),
    defaultValues: {
      noTelp: "",
      namaBank: "",
      noRek: "",
      pilManasuka: 0,
    },
  });
  const onSubmit = (values: z.infer<typeof DataDiriSchema>) => {
    startTranssition(() => {
      updateDataDiri(values).then((data) => {
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
    <Card className="shadow-md">
      <CardHeader className="items-center justify-center text-center">
        <Image
          src={PICTURES.LOGO}
          height={100}
          width={100}
          alt="logo koperasi"
          loading="lazy"
        />
        <CardTitle className="text-3xl">{LABEL.CARD.HEADER}</CardTitle>
        <CardDescription>{LABEL.CARD.DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FromStatus status={status} message={message} />
            <div className="flex items-center gap-x-2 rounded-md text-sm">
              <h2 className="text-base font-semibold">
                Formulir Informasi Rekening Bank, Kontak dan Pilihan Simpanan
                Sukamana :
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="namaBank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Bank</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Bank Anda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bank.map((item, index) => (
                            <SelectItem key={index} value={item.value}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="noRek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Rekening</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="noTelp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Telp</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="pilManasuka"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilihan Simpanan Sukamana</FormLabel>
                      <FormControl>
                        <InputCurrency
                          name="pilManasuka"
                          control={form.control}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Tidak wajib untuk mengisi pilihan simpanan sukamana.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-4">
              <Button type="submit" disabled={isPending} className="w-full">
                Simpan
              </Button>
              <Button
                variant="secondary"
                onClick={() => signOut()}
                className="w-full"
              >
                Kembali
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
