"use client";
import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  TListSimpananBerjangka,
  TSimpananBerjangkaValue,
} from "@/types/simpanan";
import { cekSimpananBerjangka } from "@/lib/action/simpanan";
import { columnSimpananBerjangkaAnggota } from "@/lib/columns/column-simpanan-berjangka";
import TableWrapping from "../table/table-wrapping";
import { useToast } from "../ui/use-toast";

// buat download untuk data simpanan berjangka anggota

interface IFormSimpananBerjangka {
  data: TListSimpananBerjangka[];
}

export default function FormSimpananBerjangka({
  data,
}: IFormSimpananBerjangka) {
  const { toast } = useToast();
  const [simpananBerjangka, setSimpananBerjangka] = React.useState<
    TSimpananBerjangkaValue[] | null
  >(null);

  const form = useForm<z.infer<typeof SimpananBerjangkaSchema>>({
    resolver: zodResolver(SimpananBerjangkaSchema),
    defaultValues: {
      jenisPendaftaran: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof SimpananBerjangkaSchema>) => {
    return await cekSimpananBerjangka(values).then((data) => {
      toast({
        variant: data.ok ? "default" : "destructive",
        title: data.ok ? "SUCCESS" : "FAILED",
        description: data.message,
      });
      if (data.ok) {
        setSimpananBerjangka(data.value);
      }
    });
  };

  return (
    <Card>
      {simpananBerjangka ? (
        <CardContent className="space-y-4 pt-6">
          <TableWrapping
            header="Simpanan Berjangka"
            description="Data simpanan berjangka anggota"
            searchBy="nama"
            labelSearch="nama"
            data={simpananBerjangka}
            columns={columnSimpananBerjangkaAnggota}
          />
          <Button type="submit" className="w-full">
            Pengambilan Simpanan Berjangka
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSimpananBerjangka(null);
            }}
          >
            Reset
          </Button>
        </CardContent>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Form Simpanan Berjangka Anggota</CardTitle>
            <CardDescription className="text-justify">
              Petugas diminta untuk memilih nama pendaftaran dari dropdown menu
              yang tersedia. Setelah memilih, tabel yang berisi informasi
              lengkap mengenai simpanan berjangka anggota akan ditampilkan.
              Tabel ini mencakup detail seperti nama anggota, jenis simpanan,
              jangka waktu, dan status simpanan, memudahkan petugas dalam
              melakukan pengecekan dan pengelolaan data simpanan berjangka.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="jenisPendaftaran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Pendaftaran</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="pilih nama pendaftaran" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data.map((item, index) => (
                              <SelectItem
                                key={index}
                                value={item.jenisPendaftaran}
                              >
                                {item.namaPendaftaran}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                  {form.formState.isSubmitting ? "Sedang Proses..." : "Cari"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  );
}
