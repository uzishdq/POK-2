import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ICalculateAsuransi, formatToIDR } from "@/lib/helper";
import { Separator } from "../ui/separator";

interface ICardInformasiBiayaPinjaman {
  asuransi: ICalculateAsuransi;
}

export default function CardInformasiBiayaPinjaman(
  props: ICardInformasiBiayaPinjaman,
) {
  return (
    <Card>
      <CardHeader className="font-medium">Informasi Biaya Pinjaman</CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex w-full">
            <p className="flex-1 text-left">Biaya Premi</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.asuransi.totalPremi!)}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Biaya Admin</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.asuransi.admin!)}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex w-full">
            <p className="flex-1 text-left">Jumlah Pelunasan</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.asuransi.pelunasan!)}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex w-full font-semibold">
            <p className="flex-1 text-left">Jumlah Diterima</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.asuransi.receive!)}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Angsuran Per-bulan</p>
            <p className="w-4">:</p>
            <p className="flex-1">
              {formatToIDR(props.asuransi.monthlyInstallment!)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
