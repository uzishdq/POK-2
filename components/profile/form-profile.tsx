"use client";
import React, { useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProfileSchema } from "@/lib/schema/profile-shema";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DEFAULT_LOGIN_REDIRECT, bank, gender, pekerjaan } from "@/lib/constan";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import InputCurrency from "../ui/input-currency";
import { TAnggota } from "@/types/anggota";
import { useToast } from "../ui/use-toast";
import { updateProfile } from "@/lib/action/profile";
import { TJabatan } from "@/types/jabatan";
import { TUnitKerja } from "@/types/unit-kerja";

interface IFromProfile {
  data: TAnggota;
  jabatan: TJabatan[] | null;
  unitKerja: TUnitKerja[] | null;
}

export default function FormProfile({
  data,
  jabatan,
  unitKerja,
}: IFromProfile) {
  const { toast } = useToast();
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      nik: data.nik ? data.nik : "",
      nip: data.nip ? data.nip : "",
      nama: data.nama,
      tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : undefined,
      tempatLahir: data.tempatLahir ? data.tempatLahir : "",
      jenisKelamin: data.jenisKelamin,
      alamat: data.alamat ? data.alamat : "",
      noTelp: data.noTelp ? data.noTelp : "",
      statusPekerjaan: data.statusPekerjaan,
      namaBank: data.namaBank ? data.namaBank : "",
      noRek: data.noRek ? data.noRek : "",
      pilManasuka: data.pilManasuka ? data.pilManasuka : undefined,
      jabatanId: data.jabatanId,
      unitKerjaId: data.unitKerjaId,
    },
  });

  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    startTranssition(() => {
      updateProfile(data.noAnggota, values).then((data) => {
        toast({
          variant: data?.ok ? "default" : "destructive",
          title: data?.ok ? "SUCCESS" : "FAILED",
          description: data?.message,
        });
      });
    });
  };

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Data Anggota</CardTitle>
        <CardDescription>
          Pastikan data Anda sudah benar. Jika sudah sesuai, tidak perlu
          mengedit atau mengubahnya.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nik"
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
                  name="nip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIP {"(Nomor Induk Pegawai)"}</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Tidak wajib untuk mengisi nomor induk pegawai.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nama"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jabatanId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jabatan Anda" />
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
                  name="unitKerjaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Kerja</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Unit Kerja Anda" />
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
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tempatLahir"
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
                  name="tanggalLahir"
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
                                  <span>Masukkan Tanggal Lahir Anda</span>
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jenisKelamin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis Kelamin Anda" />
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
                  name="statusPekerjaan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Pekerjaan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Status Pekerjaan Anda" />
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

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Silakan isi alamat Anda di sini"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-x-4 space-y-4">
              <Button type="submit" disabled={isPending}>
                {isPending && "Sedang Proses..."}
                {!isPending && "Simpan"}
              </Button>
              <Button variant="secondary" asChild>
                <Link href={DEFAULT_LOGIN_REDIRECT}>Kembali</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
