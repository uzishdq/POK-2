"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cekNotifWa, notifWa } from "@/lib/action/notifikasi";
import {
  ITemplatePengunduranAnggota,
  templatePengunduranAnggota,
} from "@/lib/template-notif";

interface INotiCekfWa {
  phone: string;
  template: string;
}

export default function CobaKirimWa() {
  const dataTemplate: ITemplatePengunduranAnggota = {
    nama: "testing",
    unitGarapan: "tidak ada data",
    tanggalPengunduran: new Date(),
    keterangan: "testing",
    wajib: 10000,
    sukamana: 500000,
    lebaran: 0,
    qurban: 0,
    ubar: 0,
    biaya: 25000,
    totalKotor: 25000,
    totalBersih: 500000,
    pinjamanJasa: null,
    pinjamanBarang: null,
  };
  const onSubmit = async () => {
    const data: INotiCekfWa = {
      phone: "08112349244",
      template: templatePengunduranAnggota(dataTemplate),
    };
    await notifWa(data);
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSubmit}>Deploy</Button>
      </CardFooter>
    </Card>
  );
}
