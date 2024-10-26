"use client";

import React, { useState, useTransition } from "react";
import ModalWrapper from "../modal/modal-wrapper";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../ui/use-toast";
import { UnitKerjaSchema } from "@/lib/schema/unit-kerja-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { addUnitKerja } from "@/lib/action/unit-kerja";

export default function FormUnitKerja() {
  const { toast } = useToast();
  const [isPending, startTranssition] = useTransition();
  const form = useForm<z.infer<typeof UnitKerjaSchema>>({
    resolver: zodResolver(UnitKerjaSchema),
    defaultValues: {
      namaUnitKerja: "",
      alamatKantor: "",
    },
  });

  const onSubmit = (values: z.infer<typeof UnitKerjaSchema>) => {
    startTranssition(() => {
      addUnitKerja(values).then((data) => {
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
    <ModalWrapper
      buttonLabel="Tambah Data"
      title="Tambah Data Unit Kerja"
      desc="Menambahkan data baru pada unit kerja / unit garapan yayasan al ghifari"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="namaUnitKerja"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Unit Kerja</FormLabel>
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
              name="alamatKantor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Unit Kerja</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Silakan isi alamat unit kerja di sini"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending && "Sedang Proses..."}
              {!isPending && "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </ModalWrapper>
  );
}
