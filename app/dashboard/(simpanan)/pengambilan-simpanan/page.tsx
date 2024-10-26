import FromStatus from "@/components/auth/form-status";
import FormPengambilanSimpanan from "@/components/pengambilan-simpanan/form-pengambilan-simpanan";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnPengambilanSimpanan } from "@/lib/columns/colums-pengambilan-simpanan";
import { getMaxPinjamanById } from "@/lib/data/pinjaman";
import {
  getPengambilanSimpananById,
  getPengambilanSimpananValueById,
  getTotalPengambilanSimpananValueById,
} from "@/lib/data/simpanan";
import { formatToIDR } from "@/lib/helper";
import { getSesi } from "@/lib/session";
import { ArrowBigDownDash, Banknote } from "lucide-react";
import React from "react";

export default async function PengambilanSimpanan() {
  const session = await getSesi();

  if (session?.user && session.user.id) {
    const [maxSimpanan, maxPinjamanJasa, pengambilanSimpanan, total] =
      await Promise.all([
        getPengambilanSimpananValueById(session.user.id),
        getMaxPinjamanById(session.user.id, "JASA"),
        getPengambilanSimpananById(session.user.id),
        getTotalPengambilanSimpananValueById(session.user.id),
      ]);

    const column = columnPengambilanSimpanan;

    if (
      !maxSimpanan ||
      !maxPinjamanJasa.ok ||
      !pengambilanSimpanan.ok ||
      !total
    ) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Pengambilan Simpanan</div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pengambilan Simpanan</div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pengambilan Simpanan
              </CardTitle>
              <ArrowBigDownDash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatToIDR(total.hasil)}
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pengambilan Simpanan Sukamana
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
                Pengambilan Simpanan Lebaran
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
                Pengambilan Simpanan Qurban
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
        {pengambilanSimpanan && pengambilanSimpanan.value && (
          <TableWrappingDate
            header="Data Pengambilan Simpanan"
            description="Data yang masuk dalam pengambilan simpanan"
            searchBy="noPengambilanSimpanan"
            labelSearch="no pengambilan simpanan"
            input={true}
            filterDate="tanggalPengambilanSimpanan"
            data={pengambilanSimpanan.value}
            columns={column}
          >
            <FormPengambilanSimpanan
              id={session.user.id}
              maxSimpanan={maxSimpanan}
              maxPinjamanJasa={maxPinjamanJasa.value}
            />
          </TableWrappingDate>
        )}
      </div>
    );
  }
}
