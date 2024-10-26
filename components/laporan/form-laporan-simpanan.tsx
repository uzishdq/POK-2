"use client";

import React, { useTransition } from "react";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { laporanSimpananSchema } from "@/lib/schema/laporan-simpanan-schema";
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
  FormDescription,
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
import { jenisLaporanSimpanan } from "@/lib/constan";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

export default function FormLaporanSimpanan() {
  const { toast } = useToast();
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof laporanSimpananSchema>>({
    resolver: zodResolver(laporanSimpananSchema),
    defaultValues: {
      jenisLaporanSimpanan: undefined,
      date: {
        from: undefined,
        to: undefined,
      },
    },
  });
  const onSubmit = (values: z.infer<typeof laporanSimpananSchema>) => {
    console.log(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">EXPORT LAPORAN SIMPANAN</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jenisLaporanSimpanan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Laporan Simpanan</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Laporan Simpanan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jenisLaporanSimpanan.map((item, index) => (
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
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rentang Tanggal</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value.from && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pilih Tanggal</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value.from}
                            selected={{
                              from: field.value.from!,
                              to: field.value.to,
                            }}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      laporan simpanan wajib & berjangka harus isi rentang
                      tanggal
                    </FormDescription>
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
                {form.formState.isSubmitting ? "Loading..." : "Export Laporan"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}