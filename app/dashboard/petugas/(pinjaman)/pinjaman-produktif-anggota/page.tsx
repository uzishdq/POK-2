import FromStatus from "@/components/auth/form-status";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  columnPinjamanJasaAnggota,
  columnPinjamanJasaAnggotaPending,
} from "@/lib/columns/columns-pinjaman-jasa-anggota";
import {
  getCountPinjamanJasaValue,
  getListPinjamanJasa,
} from "@/lib/data/pinjaman";
import { TListPinjaman } from "@/types/pinjaman";
import { Banknote } from "lucide-react";
import React from "react";

export default async function PinjamanProduktifAnggota() {
  const [pinjamanJasa, count] = await Promise.all([
    getListPinjamanJasa(),
    getCountPinjamanJasaValue(),
  ]);
  if (!pinjamanJasa.ok || !count) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pinjaman Produktif Anggota</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }
  const { approvedPinjaman, pendingPinjaman, completedPinjaman } =
    pinjamanJasa.value?.reduce(
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
        approvedPinjaman: [] as TListPinjaman[],
        pendingPinjaman: [] as TListPinjaman[],
        completedPinjaman: [] as TListPinjaman[],
      },
    ) || {};

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Pinjaman Produktif Anggota</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Keseluruhan Pinjaman Produktif
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count.hasil}</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pinjaman Produktif Aktif
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {count.approved ? count.approved : 0}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pinjaman Produktif Pending
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {count.pending ? count.pending : 0}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pinjaman Produktif Selesai
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {count.completed ? count.completed : 0}
            </div>
          </CardContent>
        </Card>
      </div>
      {pendingPinjaman && (
        <TableWrappingDate
          header="Pengajuan Pinjaman Produktif Anggota"
          description="Data anggota yang telah mengajukan permohonan untuk mendapatkan pinjaman guna mendukung usaha atau kegiatan produktif mereka"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPinjaman"
          data={pendingPinjaman}
          columns={columnPinjamanJasaAnggotaPending}
        />
      )}
      {approvedPinjaman && (
        <TableWrappingDate
          header="Pinjaman Produktif Anggota yang Sedang Berjalan"
          description="Data pinjaman produktif anggota yang telah disetujui dan saat ini sedang dalam proses pelunasan oleh anggota"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPinjaman"
          data={approvedPinjaman}
          columns={columnPinjamanJasaAnggota}
        />
      )}
      {completedPinjaman && (
        <TableWrappingDate
          header="Riwayat Pinjaman Produktif Anggota"
          description="Data pinjaman produktif yang sudah lunas, di mana anggota telah menyelesaikan seluruh kewajiban pembayaran sesuai dengan perjanjian pinjaman"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPinjaman"
          data={completedPinjaman}
          columns={columnPinjamanJasaAnggota}
        />
      )}
    </div>
  );
}
