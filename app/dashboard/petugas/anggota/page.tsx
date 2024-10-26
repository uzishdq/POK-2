import FromStatus from "@/components/auth/form-status";
import TableWrapping from "@/components/table/table-wrapping";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnAnggota } from "@/lib/columns/colums-master";
import { getListAnggota, getTotalAnggota } from "@/lib/data/anggota";
import { TListAnggota } from "@/types/anggota";
import { UserCheck, UserMinus } from "lucide-react";
import React from "react";

export default async function AnggotaPetugas() {
  const [total, data] = await Promise.all([
    getTotalAnggota(),
    getListAnggota(),
  ]);

  if (!data.ok) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Anggota Koperasi</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  const { active, notActive } =
    data.value?.reduce(
      (acc, item) => {
        if (item.statusAnggota === "ACTIVE") {
          acc.active.push(item);
        } else if (item.statusAnggota === "NOTACTIVE") {
          acc.notActive.push(item);
        }
        return acc;
      },
      {
        active: [] as TListAnggota[],
        notActive: [] as TListAnggota[],
      },
    ) || {};

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Anggota Koperasi</div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Anggota Aktif
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total.value?.anggotaAktif}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Anggota Tidak Aktif
            </CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total.value?.anggotaTidakAktif}
            </div>
          </CardContent>
        </Card>
      </div>
      {active && (
        <TableWrapping
          header="Anggota Koperasi Aktif"
          description="Data anggota yang saat ini aktif di Koperasi Karyawan Yayasan Al Ghifari"
          searchBy="nama"
          labelSearch="nama"
          data={active}
          columns={columnAnggota}
        />
      )}
      {notActive && (
        <TableWrapping
          header="Anggota Koperasi Mengundurkan Diri"
          description="Data anggota yang telah mengundurkan diri dari Koperasi Karyawan Yayasan Al Ghifari"
          searchBy="nama"
          labelSearch="nama"
          data={notActive}
          columns={columnAnggota}
        />
      )}
    </div>
  );
}
