"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import InputCurrency from "../ui/input-currency";
import { Input } from "../ui/input";
import { PengajuanPinjamanSchema } from "@/lib/schema/pinjaman-schema";
import { addPinjaman, cekSyaratPinjaman } from "@/lib/action/pinjaman";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { jenisPinjaman } from "@/lib/constan";
import FromStatus from "../auth/form-status";
import CardInformasiBiayaPinjaman from "./card-informasi-biaya-pinjaman";
import { ICalculateAsuransi, isPassPinjaman } from "@/lib/helper";
import { TMaxPinjaman } from "@/types/pinjaman";

interface IFormPengajuanPinjaman {
  maxSimpanan: number;
  id: string;
  tanggalLahir: Date;
  pinjamanJasa: TMaxPinjaman | null;
  pinjamanBarang: TMaxPinjaman | null;
}

export default function FormPengajuanPinjaman({
  maxSimpanan,
  id,
  tanggalLahir,
  pinjamanJasa,
  pinjamanBarang,
}: IFormPengajuanPinjaman) {

  const [maxLimit, setMaxLimit] = React.useState(0);
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);
  const [asuransi, setAsuransi] = React.useState<ICalculateAsuransi | null>(
    null,
  );
  const [isPass, setIsPass] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const PengajuanPinjamanSchemaForm = PengajuanPinjamanSchema(maxLimit);
  const { toast } = useToast();

  const filterJenisPinjaman = jenisPinjaman.filter((jenis) => {
    if (pinjamanJasa !== null && jenis.value === "JASA") {
      return isPassPinjaman(
        pinjamanJasa.AngsuranPinjaman[0].angsuranPinjamanKe,
        pinjamanJasa.AngsuranPinjaman[0].angsuranPinjamanDari,
      );
    }
    if (pinjamanBarang !== null && jenis.value === "BARANG") {
      return false;
    }
    return true;
  });

  const form = useForm<z.infer<typeof PengajuanPinjamanSchemaForm>>({
    resolver: zodResolver(PengajuanPinjamanSchemaForm),
    defaultValues: {
      tujuanPinjaman: "",
      anggotaId: id,
      waktuPengembalian: 0,
    },
  });

  const pilihanPinjaman = form.watch("jenisPinjaman");
  useEffect(() => {
    let newMaxLimit = 0;
    switch (pilihanPinjaman) {
      case "JASA":
        newMaxLimit = maxSimpanan
          ? maxSimpanan > 50000000
            ? 50000000
            : maxSimpanan
          : 0;
        break;
      case "BARANG":
        newMaxLimit = maxSimpanan ? 750000 : 0;
        break;
      default:
        newMaxLimit = 0;
    }
    setMaxLimit(newMaxLimit);
  }, [pilihanPinjaman, maxSimpanan]);

  const onSubmit = async (
    values: z.infer<typeof PengajuanPinjamanSchemaForm>,
  ) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });

    return await cekSyaratPinjaman(
      maxLimit,
      formData,
      tanggalLahir,
      pinjamanJasa ? pinjamanJasa.noPinjaman : null,
    ).then((data) => {
      setStatus(data.ok);
      setMessage(data.message);
      setIsPass(data.ok);
      setIsLoading(false);
      if (data.ok) {
        setAsuransi(data.value);
        if (isPass) {
          setIsLoading(true);
          addPinjaman(maxLimit, formData, tanggalLahir).then((data) => {
            toast({
              variant: data?.ok ? "default" : "destructive",
              title: data?.ok ? "SUCCESS" : "FAILED",
              description: data?.message,
            });
            setIsLoading(false);
            if (data?.ok) {
              form.reset();
              setIsPass(false);
              setAsuransi(null);
              setStatus(data.ok);
              setMessage(data.message);
            }
          });
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          PERSYARATAN PINJAMAN KOPERASI KARYAWAN YAYASAN AL GHIFARI
        </CardTitle>
        <ul className="mt-3 list-decimal pl-4 pt-4 text-sm text-muted-foreground">
          <li className="mb-4 text-justify">
            Besaran pinjaman maksimal adalah 15 kali dari jumlah simpanan wajib
            dan manasuka, dengan catatan besaran pinjaman tidak boleh melebihi
            50 juta.
          </li>
          <li className="mb-4 text-justify">
            Besaran pinjaman yang dapat disetujui berdasarkan kemampuan angsuran
            masing-masing anggota perbulan dan ketentuan batasan minimum “Take
            Home Pay” (THP) <b>35%</b> dari Gaji Bersih.
          </li>
          <li className="mb-4 text-justify">Struk Gaji terakhir.</li>

          <li className="mb-2 text-justify">
            Biaya yang dikenakan sekali pada saat penarikan :
          </li>
          <ul className="list-disc pl-4">
            <li className="mb-2 text-justify">
              Biaya administrasi sebesar <b>1%</b> dari jumlah pinjaman.
            </li>
            <li className="mb-2 text-justify">
              Biaya premi asuransi jiwa, dihitung berdasarkan usia dan jangka
              waktu pinjaman.
            </li>
          </ul>
        </ul>
      </CardHeader>
      <CardContent>
        {maxSimpanan <= 0 ? (
          <FromStatus
            status={false}
            message="Anda tidak bisa mengajukan pinjaman karena saldo simpanan anda 0."
          />
        ) : pinjamanJasa === null || pinjamanBarang === null ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {pinjamanJasa ? (
                <FromStatus
                  status={isPassPinjaman(
                    pinjamanJasa.AngsuranPinjaman[0].angsuranPinjamanKe,
                    pinjamanJasa.AngsuranPinjaman[0].angsuranPinjamanDari,
                  )}
                  message={
                    isPassPinjaman(
                      pinjamanJasa.AngsuranPinjaman[0].angsuranPinjamanKe,
                      pinjamanJasa.AngsuranPinjaman[0].angsuranPinjamanDari,
                    )
                      ? "Anda dapat mengajukan pinjaman produktif karena angsuran mencapai atau lebih dari 50%. Jumlah diterima akan dikurangi dengan sisa pinjaman sebelumnya yang harus dilunasi."
                      : "Anda tidak dapat mengajukan pinjaman produktif karena memiliki pinjaman berjalan atau dalam proses pengajuan."
                  }
                />
              ) : pinjamanBarang ? (
                <FromStatus
                  status={false}
                  message="Anda tidak dapat mengajukan pinjaman barang karena memiliki pinjaman berjalan atau dalam proses pengajuan."
                />
              ) : null}
              {message && <FromStatus status={status} message={message} />}
              {isPass && asuransi ? (
                <CardInformasiBiayaPinjaman asuransi={asuransi} />
              ) : null}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jenisPinjaman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Pinjaman</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis Pinjaman" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filterJenisPinjaman.map((item, index) => (
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
                  name="tujuanPinjaman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tujuan Pinjaman</FormLabel>
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
                  name="waktuPengembalian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Pengembalian</FormLabel>
                      <FormControl>
                        <div className="flex w-full items-center space-x-2">
                          <Input {...field} type="number" />
                          <span>bulan</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="ajuanPinjaman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Besaran Pinjaman</FormLabel>
                      <FormControl>
                        <InputCurrency
                          name="ajuanPinjaman"
                          control={form.control}
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
                  name="strukGaji"
                  render={({ field: { value, ...fieldValues } }) => (
                    <FormItem>
                      <FormLabel>Struk Gaji</FormLabel>
                      <FormControl>
                        <Input
                          {...fieldValues}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            fieldValues.onChange(file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>jpg/jpeg/png & maks 2MB</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jumlahPenghasilan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Penghasilan Berdasarkan Struk Gaji</FormLabel>
                      <FormControl>
                        <InputCurrency
                          name="jumlahPenghasilan"
                          control={form.control}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="pt-4">
                {isPass ? (
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {!isLoading ? "Ajukan Pinjaman" : "Loading..."}
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {!isLoading ? "Cek Pengajuan Pinjaman" : "Loading..."}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        ) : (
          <FromStatus
            status={false}
            message="Anda memiliki pinjaman yang sedang berjalan atau dalam proses pengajuan. Harap selesaikan terlebih dahulu sebelum mengajukan pinjaman."
          />
        )}
      </CardContent>
    </Card>
  );
}
