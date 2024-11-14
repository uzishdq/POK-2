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
  TSimpananBerjangkaById,
  TSimpananBerjangkaValue,
} from "@/types/simpanan";
import { cekSimpananBerjangka } from "@/lib/action/simpanan";
import { useToast } from "../ui/use-toast";
import CardTableSimpananBerjangka from "./card-table-simpanan-berjangka";
import FormPengambilanSimpananBerjangka from "./form-pengambilan-simpanan-berjangka";

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
  const [pendaftaran, setPendaftaran] =
    React.useState<TSimpananBerjangkaById | null>(null);

  const form = useForm<z.infer<typeof SimpananBerjangkaSchema>>({
    resolver: zodResolver(SimpananBerjangkaSchema),
    defaultValues: {
      noPendaftaran: undefined,
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
        form.reset();
        setSimpananBerjangka(data.value);
        setPendaftaran(data.dataPendaftaran);
      }
    });
  };

  return (
    <Card>
      {simpananBerjangka && pendaftaran ? (
        <CardContent className="space-y-4 pt-6">
          <CardTableSimpananBerjangka
            data={simpananBerjangka}
            pendaftaran={pendaftaran}
          />
          {pendaftaran.statusPendaftaran === "OPEN" ? (
            <FormPengambilanSimpananBerjangka data={pendaftaran} />
          ) : null}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSimpananBerjangka(null);
              setPendaftaran(null);
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
              yang tersedia. Setelah memilih, tabel yang berisi mengenai
              simpanan berjangka anggota akan ditampilkan. Memudahkan petugas
              dalam melakukan pengecekan dan pengelolaan data simpanan
              berjangka.
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
                    name="noPendaftaran"
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
                                value={item.noPendaftaran.toString()}
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
