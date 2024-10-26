"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { InputPotongGajiSchema } from "@/lib/schema/potong-gaji-schema";
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
import { addPotongGaji } from "@/lib/action/potong-gaji";
import { useToast } from "../ui/use-toast";
import { ITransformData, transformData } from "@/lib/helper";

export default function ImportPotongGaji() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof InputPotongGajiSchema>>({
    resolver: zodResolver(InputPotongGajiSchema),
  });

  const onSubmit = async (values: z.infer<typeof InputPotongGajiSchema>) => {
    const file = values.file;
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const parsedData: ITransformData[] = XLSX.utils.sheet_to_json(worksheet);
    const dataJson = transformData(parsedData);

    return await addPotongGaji(dataJson).then((data) => {
      toast({
        variant: data?.ok ? "default" : "destructive",
        title: data?.ok ? "SUCCESS" : "FAILED",
        description: data?.message,
      });
      if (data.ok) {
        form.reset();
      }
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Input Potongan Gaji Anggota</CardTitle>
        <CardDescription>
          Harap masukkan data potongan gaji anggota secara lengkap dan akurat,
          dengan format file .xlsx / .xls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>File Potongan Gaji</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldValues}
                        type="file"
                        accept=".xlsx, .xls,"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          fieldValues.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>.xlsx / .xls & maks 5MB</FormDescription>
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
                  : "Input Potongan Gaji"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
