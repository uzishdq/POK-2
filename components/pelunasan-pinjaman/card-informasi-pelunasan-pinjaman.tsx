import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { formatToIDR, ICalculatePelunasanPinjaman } from "@/lib/helper";
import { Separator } from "../ui/separator";

interface ICardInformasiPelunasanPinjaman {
  pelunasan: ICalculatePelunasanPinjaman;
}

export default function CardInformasiPelunasanPinjaman(
  props: ICardInformasiPelunasanPinjaman,
) {
  return (
    <Card>
      <CardHeader className="font-medium">
        Informasi Pelunasan Pinjaman
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex w-full">
            <p className="flex-1 text-left">No Pinjaman</p>
            <p className="w-4">:</p>
            <p className="flex-1">{props.pelunasan.noPinjaman}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Tujuan Pinjaman</p>
            <p className="w-4">:</p>
            <p className="flex-1">{props.pelunasan.tujuanPinjaman}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Jumlah Pinjaman</p>
            <p className="w-4">:</p>
            <p className="flex-1">
              {formatToIDR(props.pelunasan.ajuanPinjaman)}
            </p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Waktu Pengembalian</p>
            <p className="w-4">:</p>
            <p className="flex-1">{props.pelunasan.waktuPengembalian} Bulan</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Angsuran Pinjaman</p>
            <p className="w-4">:</p>
            <p className="flex-1">
              {props.pelunasan.angsuranKe} / {props.pelunasan.angsuranDari}{" "}
              Bulan
            </p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Jumlah yang Sudah Dibayarkan</p>
            <p className="w-4">:</p>
            <p className="flex-1">
              {formatToIDR(props.pelunasan.sudahDibayarkan)}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex w-full">
            <p className="flex-1 text-left font-bold">Biaya Penalti</p>
            <p className="w-4">:</p>
            <p className="flex-1 font-bold">
              {formatToIDR(props.pelunasan.admin)}
            </p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left font-bold">Jumlah Pelunasan</p>
            <p className="w-4">:</p>
            <p className="flex-1 font-bold">
              {formatToIDR(props.pelunasan.jumlahPelunasan)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
