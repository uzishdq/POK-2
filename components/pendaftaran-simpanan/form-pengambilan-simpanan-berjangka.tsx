"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SimpananBerjangkaSchema } from "@/lib/schema/setting-pendaftaran-simpanan-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useToast } from "../ui/use-toast";
import { addPengambilanSimpananBerjangka } from "@/lib/action/simpanan";
import { Input } from "../ui/input";
import { TSimpananBerjangkaById } from "@/types/simpanan";

interface IFormPengambilanSimpananBerjangka {
  data: TSimpananBerjangkaById;
}

export default function FormPengambilanSimpananBerjangka({
  data,
}: IFormPengambilanSimpananBerjangka) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SimpananBerjangkaSchema>>({
    resolver: zodResolver(SimpananBerjangkaSchema),
    defaultValues: {
      noPendaftaran: data.noPendaftaran,
    },
  });

  const onSubmit = async (values: z.infer<typeof SimpananBerjangkaSchema>) => {
    return await addPengambilanSimpananBerjangka(values).then((data) => {
      toast({
        variant: data.ok ? "default" : "destructive",
        title: data.ok ? "SUCCESS" : "FAILED",
        description: data.message,
      });
    });
  };

  if (data.statusPendaftaran !== "OPEN") return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form pengambilan {data.namaPendaftaran}</CardTitle>
        <CardDescription className="text-justify">
          Formulir ini digunakan untuk pengambilan {data.namaPendaftaran}{" "}
          berjangka anggota
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4" hidden>
              <FormField
                control={form.control}
                name="noPendaftaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No.Pendaftaran</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Sedang Proses..."
                : "Pengambilan Simpanan Berjangka"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
