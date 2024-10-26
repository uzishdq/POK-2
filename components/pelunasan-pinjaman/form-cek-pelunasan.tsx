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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cekPelunasanSchema } from "@/lib/schema/pelunasan-pinjaman-schema";
import FromStatus from "../auth/form-status";
import { TPelunasanPinjaman } from "@/types/pinjaman";
import { ICalculatePelunasanPinjaman } from "@/lib/helper";
import { cekPelunasanPinjaman } from "@/lib/action/pinjaman";
import FormPelunasanPinjaman from "./form-pelunasan-pinjaman";

interface IFormCekPelunasan {
  noPinjaman: TPelunasanPinjaman[] | null;
}

export default function FormCekPelunasan({ noPinjaman }: IFormCekPelunasan) {
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);
  const [pelunasan, setPelunasan] =
    React.useState<ICalculatePelunasanPinjaman | null>(null);
  const form = useForm<z.infer<typeof cekPelunasanSchema>>({
    resolver: zodResolver(cekPelunasanSchema),
    defaultValues: {
      pinjamanId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof cekPelunasanSchema>) => {
    return await cekPelunasanPinjaman(values).then((data) => {
      setStatus(data.ok);
      setMessage(data.message);
      if (data.ok) {
        setPelunasan(data.value);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          PELUNASAN PINJAMAN KOPERASI KARYAWAN YAYASAN AL GHIFARI
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
        {!noPinjaman?.length ? (
          <FromStatus
            status={false}
            message="Maaf, untuk sekarang anda tidak mempunyai pinjaman"
          />
        ) : (
          <>
            {pelunasan ? (
              <FormPelunasanPinjaman
                pelunasan={pelunasan}
                setPelunasan={setPelunasan}
                setMessage={setMessage}
                setStatus={setStatus}
              />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {message && <FromStatus status={status} message={message} />}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pinjamanId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No Pinjaman</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih No Pinjaman" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {noPinjaman.map((item, index) => (
                                <SelectItem key={index} value={item.noPinjaman}>
                                  {item.noPinjaman}
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
                        : "Cek Pelunasan Pinjaman"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
