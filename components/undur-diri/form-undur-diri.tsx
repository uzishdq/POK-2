"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UndurDiriSchema } from "@/lib/schema/undur-diri-schema";
import { jenisPelunasanPinjaman } from "@/lib/constan";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { TCekUndurDiri } from "@/types/simpanan";
import FromStatus from "../auth/form-status";
import CardInformasiUndurDiri from "./card-informasi-undur-diri";
import { addUndurDiri } from "@/lib/action/undur-diri";

interface IFormUndurDiri {
  undurDiri: TCekUndurDiri;
  setUndurDiri: React.Dispatch<React.SetStateAction<TCekUndurDiri | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setStatus: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function FormUndurDiri(props: IFormUndurDiri) {
  const form = useForm<z.infer<typeof UndurDiriSchema>>({
    resolver: zodResolver(UndurDiriSchema),
    defaultValues: {
      anggotaId: props.undurDiri.anggotaId,
      noUser: props.undurDiri.noUser,
      keterangan: props.undurDiri.keterangan,
      biayaPengunduranDiri: props.undurDiri.biaya,
      simpananWajibPengunduranDiri: props.undurDiri.wajib,
      simpananManasukaPengunduranDiri: props.undurDiri.sukamana,
      simpananLebaranPengunduranDiri: props.undurDiri.lebaran,
      simpananQurbanPengunduranDiri: props.undurDiri.ubar,
      simpananUbarPengunduranDiri: props.undurDiri.ubar,
      totalPengunduranDiri: props.undurDiri.totalKotor,
      totalDiterimaPengunduranDiri: props.undurDiri.totalBersih,
    },
  });

  const onSubmit = async (values: z.infer<typeof UndurDiriSchema>) => {
    return await addUndurDiri(values).then((data) => {
      props.setStatus(data.ok);
      props.setMessage(data.message);
      if (data.ok) {
        props.setUndurDiri(null);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {props.undurDiri && (
          <CardInformasiUndurDiri undurDiri={props.undurDiri} />
        )}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="jenisUndurDiri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hak-hak sebagai anggota dibayarkan secara</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Cara Pembayaran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jenisPelunasanPinjaman.map((item, index) => (
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
        <CardFooter className="pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Loading..."
              : "Ajukan Pengunduran Diri"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
