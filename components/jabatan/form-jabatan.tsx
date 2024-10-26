"use client";

import React, { useTransition } from "react";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { JabatanSchema } from "@/lib/schema/jabatan-schema";
import ModalWrapper from "../modal/modal-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { addJabatan } from "@/lib/action/jabatan";

export default function FormJabatan() {
  const { toast } = useToast();
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof JabatanSchema>>({
    resolver: zodResolver(JabatanSchema),
    defaultValues: {
      namaJabatan: "",
    },
  });

  const onSubmit = (values: z.infer<typeof JabatanSchema>) => {
    startTranssition(() => {
      addJabatan(values).then((data) => {
        if (data?.ok) {
          form.reset();
        }
        toast({
          variant: data?.ok ? "default" : "destructive",
          title: data?.ok ? "SUCCESS" : "FAILED",
          description: data?.message,
        });
      });
    });
  };

  return (
    <ModalWrapper
      buttonLabel="Tambah Data"
      title="Tambah Data Jabatan"
      desc="Menambahkan data baru pada jabatan yayasan al ghifari"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="namaJabatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Jabatan</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
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
