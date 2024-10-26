import FromStatus from "@/components/auth/form-status";
import { ChartPinjamanPetugas } from "@/components/chart/chart-pinjaman-petugas";
import { ChartSimpananPetugas } from "@/components/chart/chart-simpanan-petugas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTotalAnggota } from "@/lib/data/anggota";
import {
  getCountPinjamanBarangValue,
  getCountPinjamanJasaValue,
} from "@/lib/data/pinjaman";
import { getAllSimpananAnggota } from "@/lib/data/simpanan";
import { formatToIDR } from "@/lib/helper";
import { Banknote, Users, Wallet } from "lucide-react";
import React from "react";

export default async function Petugas() {
  const [totalSimpanan, totalAnggota, totalPinjamanJasa, totalPinjamanBarang] =
    await Promise.all([
      getAllSimpananAnggota(),
      getTotalAnggota(),
      getCountPinjamanJasaValue(),
      getCountPinjamanBarangValue(),
    ]);

  if (
    !totalSimpanan.ok ||
    !totalAnggota.ok ||
    !totalPinjamanJasa ||
    !totalPinjamanBarang
  ) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Dashboard Petugas</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Dashboard Petugas</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Simpanan Anggota
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(totalSimpanan.value?.totalBalance ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              pengambilan simpanan :{" "}
              {formatToIDR(totalSimpanan.value?.totalPengambilan ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pinjaman Produktif
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPinjamanJasa.approved}
            </div>
            <p className="text-xs text-muted-foreground">
              pending : {totalPinjamanJasa.pending} berjalan :{" "}
              {totalPinjamanJasa.approved} selesai :{" "}
              {totalPinjamanJasa.completed}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pinjaman Barang
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPinjamanBarang.approved}
            </div>
            <p className="text-xs text-muted-foreground">
              pending: {totalPinjamanBarang.pending} berjalan :{" "}
              {totalPinjamanBarang.approved} selesai :{" "}
              {totalPinjamanBarang.completed}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jumlah Anggota
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAnggota.value?.anggotaAktif}
            </div>
            <p className="text-xs text-muted-foreground">
              mengundurkan diri : {totalAnggota.value?.anggotaTidakAktif}
            </p>
          </CardContent>
        </Card>
      </div>
      <ChartSimpananPetugas value={totalSimpanan.value} />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <ChartPinjamanPetugas
          title="Pinjaman Produktif"
          value={totalPinjamanJasa}
        />
        <ChartPinjamanPetugas
          title="Pinjaman Barang"
          value={totalPinjamanBarang}
        />
      </div>
    </div>
  );
}
