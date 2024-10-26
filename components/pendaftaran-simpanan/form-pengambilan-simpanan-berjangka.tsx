"use client";
import { TListSimpananBerjangka } from "@/types/simpanan";
import React from "react";
import { Button } from "../ui/button";
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
import { useToast } from "../ui/use-toast";
import { addPengambilanSimpananBerjangka } from "@/lib/action/simpanan";

interface IFormPengambilanSimpananBerjangka {
  data: TListSimpananBerjangka[];
}

export default function FormPengambilanSimpananBerjangka({
  data,
}: IFormPengambilanSimpananBerjangka) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SimpananBerjangkaSchema>>({
    resolver: zodResolver(SimpananBerjangkaSchema),
    defaultValues: {
      jenisPendaftaran: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof SimpananBerjangkaSchema>) => {
    return await addPengambilanSimpananBerjangka(values).then((data) => {
      toast({
        variant: data.ok ? "default" : "destructive",
        title: data.ok ? "SUCCESS" : "FAILED",
        description: data.message,
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Pengambilan Simpanan Berjangka Anggota</CardTitle>
        <CardDescription className="text-justify">
          form untuk pengambilan simpanan berjangka anggota
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <SelectItem key={index} value={item.jenisPendaftaran}>
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
      <CardFooter></CardFooter>
    </Card>
  );
}
