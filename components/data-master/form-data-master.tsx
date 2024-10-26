"use client";
import React, { useState, useTransition } from "react";
import ModalWrapper from "../modal/modal-wrapper";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataMasterSchema } from "@/lib/schema/data-master-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { gender, pekerjaan } from "@/lib/constan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { TJabatan } from "@/types/jabatan";
import { TUnitKerja } from "@/types/unit-kerja";
import { addMaster } from "@/lib/action/master";

interface IFormDataMaster {
  jabatan: TJabatan[] | null;
  unitKerja: TUnitKerja[] | null;
}

export default function FormDataMaster({
  jabatan,
  unitKerja,
}: IFormDataMaster) {
  const { toast } = useToast();
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof DataMasterSchema>>({
    resolver: zodResolver(DataMasterSchema),
    defaultValues: {
      nipMaster: "",
      nikMaster: "",
      namaMaster: "",
      tempatLahirMaster: "",
      tanggalLahirMaster: undefined,
      alamatMaster: "",
      jenisKelaminMaster: undefined,
      statusPekerjaanMaster: undefined,
      jabatanMaster: undefined,
      unitKerjaMaster: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof DataMasterSchema>) => {
    startTranssition(() => {
      addMaster(values).then((data) => {
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
      title="Tambah Data Master"
      desc="Menambahkan data baru pada untuk karyawan yayasan al ghifari"
      className="h-5/6"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nipMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP {"(Nomor Induk Pegawai)"}</FormLabel>
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
              name="nikMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No.KTP</FormLabel>
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
              name="namaMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
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
              name="tempatLahirMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
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
              name="tanggalLahirMaster"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PP")
                            ) : (
                              <span>Masukkan Tanggal Lahir</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          fromYear={1960}
                          toYear={2030}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="jenisKelaminMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gender.map((item, index) => (
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
              name="alamatMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Silakan isi alamat di sini"
                      className="resize-none"
                      {...field}
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
              name="statusPekerjaanMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Pekerjaan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status Pekerjaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pekerjaan.map((item, index) => (
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
              name="jabatanMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jabatan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jabatan
                        ? jabatan.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.noJabatan.toString()}
                            >
                              {item.namaJabatan}
                            </SelectItem>
                          ))
                        : null}
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
              name="unitKerjaMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Kerja</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Unit Kerja" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitKerja
                        ? unitKerja.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.noUnitKerja.toString()}
                            >
                              {item.namaUnitKerja}
                            </SelectItem>
                          ))
                        : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Kembali
              </Button>
            </DialogClose>
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
