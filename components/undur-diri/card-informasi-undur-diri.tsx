import { TCekUndurDiri } from "@/types/simpanan";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { formatToIDR } from "@/lib/helper";
import { Separator } from "../ui/separator";

interface ICardInformasiUndurDiri {
  undurDiri: TCekUndurDiri;
}
export default function CardInformasiUndurDiri(props: ICardInformasiUndurDiri) {
  return (
    <Card>
      <CardHeader className="font-medium">
        Informasi Pengunduran Diri Anggota
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex w-full">
            <p className="flex-1 text-left">Simpanan Wajib</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.undurDiri.wajib)}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Simpanan Sukamana</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.undurDiri.sukamana)}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Simpanan Lebaran</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.undurDiri.lebaran)}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Simpanan Qurban</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.undurDiri.qurban)}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Simpanan Ubar</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.undurDiri.ubar)}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left">Total Simpanan Kotor</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.undurDiri.totalKotor)}</p>
          </div>
        </div>
        {props.undurDiri.pinjamanJasa ? (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="flex w-full">
                <p className="flex-1 text-left">No Pinjaman Jasa</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {props.undurDiri.pinjamanJasa.noPinjaman}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left">Jumlah</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {formatToIDR(props.undurDiri.pinjamanJasa.ajuanPinjaman)}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left">Angsuran Jasa</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {props.undurDiri.pinjamanJasa.angsuranKe} /{" "}
                  {props.undurDiri.pinjamanJasa.angsuranDari}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left">Dibayarkan</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {formatToIDR(props.undurDiri.pinjamanJasa.sudahDibayarkan)}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left">Biaya Penalti</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {formatToIDR(props.undurDiri.pinjamanJasa.admin)}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left font-bold">Total Pelunasan</p>
                <p className="w-4">:</p>
                <p className="flex-1 font-bold">
                  {formatToIDR(props.undurDiri.pinjamanJasa.jumlahPelunasan)}
                </p>
              </div>
            </div>
          </>
        ) : null}
        {props.undurDiri.pinjamanBarang ? (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="flex w-full">
                <p className="flex-1 text-left">No Pinjaman Barang</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {props.undurDiri.pinjamanBarang.noPinjaman}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left">Jumlah</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {formatToIDR(props.undurDiri.pinjamanBarang.ajuanPinjaman)}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left">Angsuran Barang</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {props.undurDiri.pinjamanBarang.angsuranKe} /{" "}
                  {props.undurDiri.pinjamanBarang.angsuranDari}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left">Dibayarkan</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {formatToIDR(props.undurDiri.pinjamanBarang.sudahDibayarkan)}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left">Biaya Penalti</p>
                <p className="w-4">:</p>
                <p className="flex-1">
                  {formatToIDR(props.undurDiri.pinjamanBarang.admin)}
                </p>
              </div>
              <div className="flex w-full">
                <p className="flex-1 text-left font-bold">Total Pelunasan</p>
                <p className="w-4">:</p>
                <p className="flex-1 font-bold">
                  {formatToIDR(props.undurDiri.pinjamanBarang.jumlahPelunasan)}
                </p>
              </div>
            </div>
          </>
        ) : null}
        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex w-full">
            <p className="flex-1 text-left">Biaya Admin</p>
            <p className="w-4">:</p>
            <p className="flex-1">{formatToIDR(props.undurDiri.biaya)}</p>
          </div>
          <div className="flex w-full">
            <p className="flex-1 text-left font-bold">Total Simpanan Bersih</p>
            <p className="w-4">:</p>
            <p className="flex-1 font-bold">
              {formatToIDR(props.undurDiri.totalBersih)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
