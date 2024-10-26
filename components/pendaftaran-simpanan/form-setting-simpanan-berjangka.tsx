"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "../modal/modal-wrapper";
import { useToast } from "../ui/use-toast";
import { SettingPendaftaranSchema } from "@/lib/schema/setting-pendaftaran-simpanan-schema";
import {
  Form,
  FormControl,
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
import { jenisPendaftaran } from "@/lib/constan";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DialogFooter } from "../ui/dialog";
import { addSettingSimpananBerjangka } from "@/lib/action/simpanan";

//range date belum responsive

export default function FormSettingSimpananBerjangka() {
  const { toast } = useToast();
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof SettingPendaftaranSchema>>({
    resolver: zodResolver(SettingPendaftaranSchema),
    defaultValues: {
      namaPendaftaran: "",
      date: {
        from: undefined,
        to: undefined,
      },
      tanggalTutupPendaftaran: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingPendaftaranSchema>) => {
    startTranssition(() => {
      addSettingSimpananBerjangka(values).then((data) => {
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
    <ModalWrapper
      buttonLabel="Tambah Data"
      title="Tambah Pendaftaran Simpanan"
      desc="Menambahkan data Pendaftaran Simpanan"
      className="h-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="namaPendaftaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pendaftaran</FormLabel>
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
              name="jenisPendaftaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Simpanan</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="pilih jenis simpanan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jenisPendaftaran.map((item, index) => (
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
                  <FormLabel>Rentang Tanggal Simpanan Berjangka</FormLabel>
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
                            <span>rentang waktu simpanan</span>
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
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tanggalTutupPendaftaran"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Tutup Pendaftaran</FormLabel>
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
                              <span>pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
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
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && "Sedang Proses..."}
              {!isPending && "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </ModalWrapper>
  );
}
