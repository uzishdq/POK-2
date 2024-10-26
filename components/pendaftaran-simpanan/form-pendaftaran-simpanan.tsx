"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { TPendaftaranSimpananCard } from "@/types/simpanan";
import { useToast } from "../ui/use-toast";
import { PendaftarSimpananSchema } from "@/lib/schema/setting-pendaftaran-simpanan-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import InputCurrency from "../ui/input-currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { addPendaftaranSimpanan } from "@/lib/action/simpanan";

// form masih belum ke reset

interface IFormPendaftaranSimpanan {
  value: TPendaftaranSimpananCard;
  anggotaId: string;
  title: string;
  type: string;
}

export default function FormPendaftaranSimpanan({
  value,
  anggotaId,
  title,
  type,
}: IFormPendaftaranSimpanan) {
  const { toast } = useToast();
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof PendaftarSimpananSchema>>({
    resolver: zodResolver(PendaftarSimpananSchema),
    defaultValues: {
      anggotaId,
      pendaftaranId: value.noPendaftaran,
    },
  });
  const onSubmit = (values: z.infer<typeof PendaftarSimpananSchema>) => {
    startTranssition(() => {
      addPendaftaranSimpanan(values).then((data) => {
        toast({
          variant: data?.ok ? "default" : "destructive",
          title: data?.ok ? "SUCCESS" : "FAILED",
          description: data?.message,
        });
        if (data?.ok) {
          form.reset();
        }
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="md:absolute w-full md:w-auto xl:w-auto bottom-0 right-0 mb-4 mr-4"
        >
          Daftar Simpanan {type.toUpperCase()}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto sm:max-w-[425px] h-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>contoh</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jumlahPilihan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilihan Simpanan {type} </FormLabel>
                    <FormControl>
                      <InputCurrency
                        name="jumlahPilihan"
                        control={form.control}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && "Sedang Proses..."}
                {!isPending && "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
