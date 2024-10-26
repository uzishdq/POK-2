import FromStatus from "@/components/auth/form-status";
import TableWrapping from "@/components/table/table-wrapping";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  columnPinjaman,
  columnPinjamanPending,
} from "@/lib/columns/column-pinjaman";
import { getListPinjamanById, getMaxPinjamanById } from "@/lib/data/pinjaman";
import { formatToIDR } from "@/lib/helper";
import { getSesi } from "@/lib/session";
import { TListPinjamanId } from "@/types/pinjaman";
import { Banknote } from "lucide-react";
import React from "react";

export default async function PinjamanBarang() {
  const session = await getSesi();

  if (session?.user && session.user.id) {
    const [pinjamanBarang, maxPinjaman] = await Promise.all([
      getListPinjamanById(session?.user.id, "BARANG"),
      getMaxPinjamanById(session.user.id, "BARANG"),
    ]);

    if (!pinjamanBarang.ok) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Pinjaman Barang</div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }

    const { approvedPinjaman, pendingPinjaman, completedPinjaman } =
      pinjamanBarang.value?.reduce(
        (acc, item) => {
          if (item.statusPinjaman === "APPROVED") {
            acc.approvedPinjaman.push(item);
          } else if (item.statusPinjaman === "PENDING") {
            acc.pendingPinjaman.push(item);
          } else if (item.statusPinjaman === "COMPLETED") {
            acc.completedPinjaman.push(item);
          }
          return acc;
        },
        {
          approvedPinjaman: [] as TListPinjamanId[],
          pendingPinjaman: [] as TListPinjamanId[],
          completedPinjaman: [] as TListPinjamanId[],
        },
      ) || {};

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pinjaman Barang</div>
        <div className="grid gap-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pinjaman Barang Terbaru
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatToIDR(
                  maxPinjaman.value?.ajuanPinjaman
                    ? maxPinjaman.value?.ajuanPinjaman
                    : 0,
                )}
              </div>
              {maxPinjaman.value && maxPinjaman.value.AngsuranPinjaman && (
                <p className="text-sm text-muted-foreground">
                  Status : {maxPinjaman.value?.statusPinjaman}. Angsuran :{" "}
                  {maxPinjaman.value?.AngsuranPinjaman[0].angsuranPinjamanKe}{" "}
                  dari{" "}
                  {maxPinjaman.value?.AngsuranPinjaman[0].angsuranPinjamanDari}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        {pendingPinjaman && (
          <TableWrapping
            header="Pengajuan Pinjaman Barang"
            description="Data pengajuan pinjaman barang menunggu 3-5 hari kerja untuk persetujuan pinjaman"
            searchBy="tujuanPinjaman"
            labelSearch="tujuan pinjaman"
            data={pendingPinjaman}
            columns={columnPinjamanPending}
          />
        )}
        {approvedPinjaman && (
          <TableWrapping
            header="Pinjaman Barang yang Sedang Berjalan"
            description="Data pinjaman barang yang telah di setujui, saat ini sedang proses pelunasan"
            searchBy="tujuanPinjaman"
            labelSearch="tujuan pinjaman"
            data={approvedPinjaman}
            columns={columnPinjaman}
          />
        )}
        {completedPinjaman && (
          <TableWrapping
            header="Riwayat Pinjaman Barang"
            description="Data pinjaman barang yang sudah selesai, telah menyelesaikan seluruh kewajiban pembayaran sesuai dengan perjanjian pinjaman"
            searchBy="noPinjaman"
            labelSearch="no pinjaman"
            data={completedPinjaman}
            columns={columnPinjaman}
          />
        )}
      </div>
    );
  }
}
