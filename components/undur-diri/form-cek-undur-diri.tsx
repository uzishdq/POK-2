"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CekUndurDiriSchema } from "@/lib/schema/undur-diri-schema";
import { Button } from "../ui/button";
import FromStatus from "../auth/form-status";
import { Input } from "../ui/input";
import { TCekUndurDiri } from "@/types/simpanan";
import { cekUndurDiri } from "@/lib/action/undur-diri";
import FormUndurDiri from "./form-undur-diri";
import CardInformasiUndurDiri from "./card-informasi-undur-diri";

interface IFormCekUndurDiri {
  anggotaId: string;
  noUser: string;
}

export default function FormCekUndurDiri({
  anggotaId,
  noUser,
}: IFormCekUndurDiri) {
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);
  const [undurDiri, setUndurDiri] = React.useState<TCekUndurDiri | null>(null);

  const form = useForm<z.infer<typeof CekUndurDiriSchema>>({
    resolver: zodResolver(CekUndurDiriSchema),
    defaultValues: {
      anggotaId,
      noUser,
      keterangan: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CekUndurDiriSchema>) => {
    return await cekUndurDiri(values).then((data) => {
      setStatus(data.ok);
      setMessage(data.message);
      setUndurDiri(data.value);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          FORMULIR PERMOHONAN UNDUR DIRI KOPERASI KARYAWAN YAYASAN AL GHIFARI
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
        <>
          {undurDiri && undurDiri.isPass ? (
            <FormUndurDiri
              undurDiri={undurDiri}
              setUndurDiri={setUndurDiri}
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
                {undurDiri && !undurDiri.isPass && (
                  <CardInformasiUndurDiri undurDiri={undurDiri} />
                )}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="keterangan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alasan Mengundurkan Diri</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
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
                      : "Cek Pengunduran Diri"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          )}
        </>
      </CardContent>
    </Card>
  );
}
