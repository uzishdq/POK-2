"use client";
import React, { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { jenisPengambilan } from "@/lib/constan";
import { useToast } from "../ui/use-toast";
import { PengambilanSimpananSchema } from "@/lib/schema/simpanan-schema";
import InputCurrency from "../ui/input-currency";
import { addPengambilanSimpanan } from "@/lib/action/simpanan";
import { TTotalSimpanan } from "@/types/simpanan";
import FromStatus from "../auth/form-status";
import { TMaxPinjaman } from "@/types/pinjaman";
import { calculatePercentage } from "@/lib/helper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus } from "lucide-react";

//pengambilan 1 kali simpanan qurban dan lebaran belum jalan

interface IFormPengambilanSimpanan {
  maxSimpanan: TTotalSimpanan;
  maxPinjamanJasa: TMaxPinjaman | null;
  id: string;
}

export default function FormPengambilanSimpanan({
  id,
  maxSimpanan,
  maxPinjamanJasa,
}: IFormPengambilanSimpanan) {
  const [maxLimit, setMaxLimit] = useState(0);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const PengambilanSimpananSchemaForm = PengambilanSimpananSchema(
    maxLimit,
    type,
  );

  const form = useForm<z.infer<typeof PengambilanSimpananSchemaForm>>({
    resolver: zodResolver(PengambilanSimpananSchemaForm),
    defaultValues: {
      anggotaId: id,
    },
  });

  const pilihanSimpanan = form.watch("jenisPengambilanSimpanan");

  useEffect(() => {
    let newMaxLimit = 0;
    let message = "Pengambilan simpanan sukamana hanya bisa 15%";
    let typeSimpanan = "";
    switch (pilihanSimpanan) {
      case "MANASUKA":
        typeSimpanan = "sukamana";
        if (maxPinjamanJasa && maxSimpanan.sukamana) {
          message = `Pengambilan simpanan sukamana hanya bisa 15%, karena anda memiliki atau dalam proses pengajuan pinjaman dengan no : ${maxPinjamanJasa.noPinjaman}`;
          const percentage = 15;
          newMaxLimit = calculatePercentage(maxSimpanan.sukamana, percentage);
        } else {
          newMaxLimit = maxSimpanan.sukamana ? maxSimpanan.sukamana : 0;
        }
        break;
      case "LEBARAN":
        typeSimpanan = "lebaran";
        newMaxLimit = maxSimpanan.lebaran ? maxSimpanan.lebaran : 0;
        break;
      case "QURBAN":
        typeSimpanan = "qurban";
        newMaxLimit = maxSimpanan.qurban ? maxSimpanan.qurban : 0;
        break;
      default:
        newMaxLimit = 0;
    }
    setMaxLimit(newMaxLimit);
    setMessage(message);
    setType(typeSimpanan);
  }, [pilihanSimpanan, maxPinjamanJasa, maxSimpanan]);

  const { toast } = useToast();
  const [isPending, startTranssition] = useTransition();

  const onSubmit = (values: z.infer<typeof PengambilanSimpananSchemaForm>) => {
    startTranssition(() => {
      addPengambilanSimpanan(maxLimit, values, type).then((data) => {
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
        <Button size="sm" className="ml-auto gap-1">
          <span className="hidden sm:inline md:inline">
            Ajuan Pengambilan Simpanan
          </span>
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            PERSYARATAN PENGAMBILAN SIMPANAN KOPERASI KARYAWAN YAYASAN AL
            GHIFARI
          </DialogTitle>

          <ul className="mt-3 list-decimal pl-4 pt-4 text-sm text-muted-foreground">
            <li className="mb-4 text-justify">
              Sesuai dengan kesepakatan yang telah disetujui, simpanan wajib
              tidak bisa diambil.
            </li>
            <li className="mb-4 text-justify">
              Jika Anda memiliki pinjaman atau dalam proses pengajuan pinjaman,
              simpanan sukamana hanya dapat diambil <b>15%</b> dari total
              keseluruhan.
            </li>
            <li className="mb-4 text-justify">
              Simpanan Lebaran & Qurban hanya dapat diambil <b>sekali</b> dalam
              satu periode.
            </li>
          </ul>
        </DialogHeader>
        {maxPinjamanJasa && <FromStatus status={true} message={message} />}
        {maxSimpanan &&
        maxSimpanan.lebaran == 0 &&
        maxSimpanan.qurban == 0 &&
        maxSimpanan.sukamana == 0 ? (
          <FromStatus
            status={false}
            message="Kami mohon maaf, Anda tidak dapat melakukan penarikan simpanan saat ini karena saldo anda 0. Silakan cek kembali saldo Anda atau hubungi petugas untuk informasi lebih lanjut. Terima kasih atas pengertiannya."
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jenisPengambilanSimpanan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Simpanan</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis Simpanan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jenisPengambilan.map((item, index) => (
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
                  name="jumlahPengambilanSimpanan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Pengambilan Simpanan</FormLabel>
                      <FormControl>
                        <InputCurrency
                          name="jumlahPengambilanSimpanan"
                          control={form.control}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && "Sedang Proses..."}
                  {!isPending && "Ajukan Pengambilan Simpanan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
