import FromStatus from "@/components/auth/form-status";
import ChartPinjamanAnggota from "@/components/chart/chart-pinjaman-anggota";
import ChartSimpananAnggota from "@/components/chart/chart-simpanan-anggota";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getChartPinjamanAnggota,
  getMaxPinjamanById,
} from "@/lib/data/pinjaman";
import { getAllSimpananbyId, getChartSimpananById } from "@/lib/data/simpanan";
import { formatToIDR } from "@/lib/helper";
import { getSesi } from "@/lib/session";
import { Activity, Banknote, Wallet } from "lucide-react";
import React from "react";

export default async function Dashboard() {
  const session = await getSesi();

  if (session?.user && session.user.id) {
    const [
      totalSimpanan,
      pinjamanJasa,
      pinjamanBarang,
      chartSimpanan,
      chartPinjaman,
    ] = await Promise.all([
      getAllSimpananbyId(session.user.id),
      getMaxPinjamanById(session.user.id, "JASA"),
      getMaxPinjamanById(session.user.id, "BARANG"),
      getChartSimpananById(session.user.id),
      getChartPinjamanAnggota(session.user.id),
    ]);

    if (
      !totalSimpanan.ok ||
      !pinjamanJasa.ok ||
      !pinjamanBarang.ok ||
      !chartSimpanan.value ||
      !chartPinjaman.ok
    ) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Dashboard</div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Dashboard</div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Simpanan
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatToIDR(totalSimpanan.value ?? 0)}
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pinjaman Produktif
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatToIDR(
                  pinjamanJasa.value?.ajuanPinjaman
                    ? pinjamanJasa.value?.ajuanPinjaman
                    : 0,
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {pinjamanJasa.value
                  ? `angsuran : ${pinjamanJasa.value.AngsuranPinjaman[0].angsuranPinjamanKe} / ${pinjamanJasa.value.AngsuranPinjaman[0].angsuranPinjamanDari} bulan`
                  : null}
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pinjaman Barang
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatToIDR(
                  pinjamanBarang.value?.ajuanPinjaman
                    ? pinjamanBarang.value?.ajuanPinjaman
                    : 0,
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {pinjamanBarang.value
                  ? `angsuran : ${pinjamanBarang.value.AngsuranPinjaman[0].angsuranPinjamanKe} / ${pinjamanBarang.value.AngsuranPinjaman[0].angsuranPinjamanDari} bulan`
                  : null}
              </p>
            </CardContent>
          </Card>
        </div>
        <ChartSimpananAnggota value={chartSimpanan.value} />
        <ChartPinjamanAnggota data={chartPinjaman.value} />
      </div>
    );
  }
}
