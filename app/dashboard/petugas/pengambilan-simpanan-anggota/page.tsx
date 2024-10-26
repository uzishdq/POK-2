import FromStatus from "@/components/auth/form-status";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnPengambilanSimpananAnggotaApproved } from "@/lib/columns/column-pengambilan-simpanan-anggota-approved";
import { columnPengambilanSimpananAnggota } from "@/lib/columns/columns-pengambilan-simpanan-anggota";
import {
  getPengambilanSimpananAnggota,
  getPengambilanSimpananApprovedAnggota,
  getTotalPengambilanSimpananValueAnggota,
} from "@/lib/data/simpanan";
import { formatToIDR } from "@/lib/helper";
import { ArrowBigDownDash, Banknote } from "lucide-react";
import React from "react";

export default async function PengambilanSimpananAnggota() {
  const [total, pengambilanSimpananPending, pengambilanSimpananApproved] =
    await Promise.all([
      getTotalPengambilanSimpananValueAnggota(),
      getPengambilanSimpananAnggota(),
      getPengambilanSimpananApprovedAnggota(),
    ]);

  const columnPending = columnPengambilanSimpananAnggota;
  const columnApproved = columnPengambilanSimpananAnggotaApproved;

  if (
    !total ||
    !pengambilanSimpananPending.ok ||
    !pengambilanSimpananApproved.ok
  ) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pengambilan Simpanan Anggota</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Pengambilan Simpanan Anggota</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengambilan Simpanan Anggota
            </CardTitle>
            <ArrowBigDownDash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatToIDR(total.hasil)}</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pengambilan Simpanan Sukamana Anggota
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.sukamana)}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pengambilan Simpanan Lebaran Anggota
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.lebaran)}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pengambilan Simpanan Qurban Anggota
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.qurban)}
            </div>
          </CardContent>
        </Card>
      </div>
      {pengambilanSimpananPending.value && (
        <TableWrappingDate
          header="Data Pengajuan Pengambilan Simpanan Anggota"
          description="Data anggota yang mengajukan atau ditolak pengambilan simpanan"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPengambilanSimpanan"
          data={pengambilanSimpananPending.value}
          columns={columnPending}
        />
      )}
      {pengambilanSimpananApproved.value && (
        <TableWrappingDate
          header="Data Pengambilan Simpanan Anggota"
          description="Data anggota pengambilan simapanan yang diterima"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPengambilanSimpanan"
          data={pengambilanSimpananApproved.value}
          columns={columnApproved}
        />
      )}
    </div>
  );
}
