import React from "react";
import { Users } from "lucide-react";
import FromStatus from "@/components/auth/form-status";
import FormSettingSimpananBerjangka from "@/components/pendaftaran-simpanan/form-setting-simpanan-berjangka";
import FormSimpananBerjangka from "@/components/pendaftaran-simpanan/form-simpanan-berjangka";
import TableWrapping from "@/components/table/table-wrapping";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnSimpananBerjangka } from "@/lib/columns/column-simpanan-berjangka";
import {
  getSimpananBerjangkaPetugas,
  getTotalPendaftaranSimpananValue,
} from "@/lib/data/simpanan";

export default async function SimpananBerjangka() {
  const [total, listPendaftaranSimpanan] = await Promise.all([
    getTotalPendaftaranSimpananValue(),
    getSimpananBerjangkaPetugas(),
  ]);

  if (!listPendaftaranSimpanan.ok || !total) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Simpanan Berjangka</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Simpanan Berjangka</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendaftar Simpanan Lebaran
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total.lebaran?.total ? total.lebaran?.total : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {total.lebaran?.nama ? total.lebaran?.nama : null}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendaftar Simpanan Qurban
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total.qurban?.total ? total.qurban?.total : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {total.qurban?.nama ? total.qurban?.nama : null}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendaftar Simpanan Ubar
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total.ubar?.total ? total.ubar?.total : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {total.ubar?.nama ? total.ubar?.nama : null}
            </p>
          </CardContent>
        </Card>
      </div>
      {listPendaftaranSimpanan && listPendaftaranSimpanan.value && (
        <TableWrapping
          header="Settings Simpanan Berjangka"
          description="Pengaturan pendaftaran simpanan berjangka bagi anggota, mencakup jenis simpanan, jangka waktu, dan tanggal penutupan. Petugas dapat melihat anggota terdaftar"
          searchBy="namaPendaftaran"
          labelSearch="nama pendaftaran"
          data={listPendaftaranSimpanan.value}
          columns={columnSimpananBerjangka}
        >
          <FormSettingSimpananBerjangka />
        </TableWrapping>
      )}

      {listPendaftaranSimpanan && listPendaftaranSimpanan.value ? (
        <FormSimpananBerjangka data={listPendaftaranSimpanan.value} />
      ) : null}
    </div>
  );
}
