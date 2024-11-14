"use client";

import React from "react";
import * as z from "zod";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { laporanPinjamanSchema } from "@/lib/schema/laporan-pinjaman-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import {
  columnsExcelLaporanPinjaman,
  jenisPinjaman,
  statusPinjaman,
} from "@/lib/constan";
import { Button } from "../ui/button";
import { getLaporanPinjaman } from "@/lib/data/laporan";
import { TLaporanPinjaman } from "@/types/laporan";
import TableWrapping from "../table/table-wrapping";
import { columnLaporanPinjaman } from "@/lib/columns/column-laporan";
import ExportExcell from "./export-excell";

export default function FormLaporanPinjaman() {
  const { toast } = useToast();
  const [laporanPinjaman, setLaporanPinjaman] = React.useState<
    TLaporanPinjaman[] | null
  >(null);

  const form = useForm<z.infer<typeof laporanPinjamanSchema>>({
    resolver: zodResolver(laporanPinjamanSchema),
    defaultValues: {
      jenisPinjaman: undefined,
      statusPinjaman: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof laporanPinjamanSchema>) => {
    return await getLaporanPinjaman(values).then((data) => {
      toast({
        variant: data.ok ? "default" : "destructive",
        title: data.ok ? "SUCCESS" : "FAILED",
        description: data.message,
      });
      if (data.ok) {
        form.reset();
        setLaporanPinjaman(data.value);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">LAPORAN PINJAMAN</CardTitle>
      </CardHeader>
      <CardContent>
        {laporanPinjaman ? (
          <div className="space-y-4">
            <TableWrapping
              header="Laporan Pinjaman Anggota"
              description="Laporan ini berisi informasi lengkap mengenai pinjaman yang dimiliki oleh anggota"
              searchBy="nama"
              labelSearch="nama"
              data={laporanPinjaman}
              columns={columnLaporanPinjaman}
            >
              <ExportExcell
                data={laporanPinjaman}
                columns={columnsExcelLaporanPinjaman}
                title="LAPORAN PINJAMAN"
                fileName="LAPORAN PINJAMAN"
                buttonLabel="Download"
              />
            </TableWrapping>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setLaporanPinjaman(null);
              }}
            >
              Reset
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jenisPinjaman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Laporan Pinjaman</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis Laporan Pinjaman" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jenisPinjaman.map((item, index) => (
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
                  name="statusPinjaman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Laporan Pinjaman</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Status Laporan Pinjaman" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusPinjaman.map((item, index) => (
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
                  {form.formState.isSubmitting ? "Loading..." : "Cari Data"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
