import FromStatus from "@/components/auth/form-status";
import ExportExcell from "@/components/laporan/export-excell";
import TableWrapping from "@/components/table/table-wrapping";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnLaporanSimpananAll } from "@/lib/columns/column-simpanan";
import { columnsExcelSimpananAnggota } from "@/lib/constan";
import {
  getAllSimpananAnggota,
  getListSimpananAnggota,
} from "@/lib/data/simpanan";
import { formatToIDR } from "@/lib/helper";
import { ArrowBigDownDash, Wallet } from "lucide-react";
import React from "react";

export default async function SimpananAnggota() {
  const [listSimpanan, total] = await Promise.all([
    getListSimpananAnggota(),
    getAllSimpananAnggota(),
  ]);

  if (!listSimpanan.ok || !total.ok) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Simpanan Anggota</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Simpanan Anggota</div>
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
              {formatToIDR(total.value?.totalBalance ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Simpanan Wajib
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.value?.wajib?.balance ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Simpanan Sukamana
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.value?.sukamana?.balance ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Simpanan Lebaran
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.value?.lebaran?.balance ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Simpanan Qurban
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.value?.qurban?.balance ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Simpanan Ubar
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.value?.ubar?.balance ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengambilan Simpanan
            </CardTitle>
            <ArrowBigDownDash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToIDR(total.value?.totalPengambilan ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      {listSimpanan && listSimpanan.value && (
        <TableWrapping
          header="Data Simpanan Anggota"
          description="Data simpanan anggota mencakup rincian simpanan seperti simpanan wajib, sukamana, lebaran, qurban, dan ubar, serta total pengambilan dan saldo simpanan"
          searchBy="nama"
          labelSearch="nama"
          data={listSimpanan.value}
          columns={columnLaporanSimpananAll}
        >
          <ExportExcell
            data={listSimpanan.value}
            columns={columnsExcelSimpananAnggota}
            title="SIMPANAN ANGGOTA PERIODE"
            fileName="SIMPANAN ANGGOTA"
            buttonLabel="Download"
          />
        </TableWrapping>
      )}
    </div>
  );
}
