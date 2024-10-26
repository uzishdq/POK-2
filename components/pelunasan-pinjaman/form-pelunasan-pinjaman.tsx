"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { jenisPelunasanPinjaman } from "@/lib/constan";
import { Button } from "../ui/button";
import { ICalculatePelunasanPinjaman } from "@/lib/helper";
import FromStatus from "../auth/form-status";
import CardInformasiPelunasanPinjaman from "./card-informasi-pelunasan-pinjaman";
import { PelunasanPinjamanSchema } from "@/lib/schema/pelunasan-pinjaman-schema";
import { addPelunasanPinjaman } from "@/lib/action/pinjaman";

interface IFormPelunasanPinjaman {
  pelunasan: ICalculatePelunasanPinjaman;
  setPelunasan: React.Dispatch<
    React.SetStateAction<ICalculatePelunasanPinjaman | null>
  >;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setStatus: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function FormPelunasanPinjaman(props: IFormPelunasanPinjaman) {
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);

  const PelunasanPinjamanSchemaForm = PelunasanPinjamanSchema(
    props.pelunasan.jumlahPelunasan,
  );

  const form = useForm<z.infer<typeof PelunasanPinjamanSchemaForm>>({
    resolver: zodResolver(PelunasanPinjamanSchemaForm),
    defaultValues: {
      pinjamanId: props.pelunasan.noPinjaman,
      angsuranKePelunasanPinjaman: props.pelunasan.angsuranKe,
      sudahDibayarkan: props.pelunasan.sudahDibayarkan,
      buktiPelunasanPinjaman: undefined,
      jenisPelunasanPinjaman: "TRANSFER",
      jumlahPelunasanPinjaman: props.pelunasan.jumlahPelunasan,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof PelunasanPinjamanSchemaForm>,
  ) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });

    return await addPelunasanPinjaman(
      props.pelunasan.jumlahPelunasan,
      formData,
    ).then((data) => {
      setStatus(data.ok);
      setMessage(data.message);
      if (data.ok) {
        props.setStatus(data.ok);
        props.setMessage(data.message);
        props.setPelunasan(null);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {message && <FromStatus status={status} message={message} />}
        {props.pelunasan && (
          <CardInformasiPelunasanPinjaman pelunasan={props.pelunasan} />
        )}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="jenisPelunasanPinjaman"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cara Pembayaran</FormLabel>
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="buktiPelunasanPinjaman"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>Bukti Pelunasan / Transfer</FormLabel>
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
        <CardFooter className="pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Loading..."
              : "Ajukan Pelunasan Pinjaman"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
