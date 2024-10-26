import FromStatus from "@/components/auth/form-status";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnSimpanan } from "@/lib/columns/column-simpanan";
import { getSimpananById, getTotalSimpananById } from "@/lib/data/simpanan";
import { getSesi } from "@/lib/session";
import { Wallet } from "lucide-react";
import React from "react";

export default async function SimpananQurban() {
  const session = await getSesi();

  if (session?.user && session.user.id) {
    const [totalSimpananQurban, simpananQurban] = await Promise.all([
      getTotalSimpananById(session.user.id, "QURBAN"),
      getSimpananById(session.user.id, "QURBAN"),
    ]);
    const column = columnSimpanan;
    if (!totalSimpananQurban?.ok || !simpananQurban.ok) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Simpanan Qurban</div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Simpanan Qurban</div>
        <div className="grid gap-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Simpanan Qurban
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalSimpananQurban.value}
              </div>
            </CardContent>
          </Card>
        </div>
        {simpananQurban && simpananQurban.value && (
          <TableWrappingDate
            header="Data Simpanan Qurban"
            description="Berikut adalah riwayat simpanan qurban yang tercantum"
            searchBy="noSimpanan"
            labelSearch="no simpanan"
            input={true}
            filterDate="tanggalSimpanan"
            data={simpananQurban.value}
            columns={column}
          />
        )}
      </div>
    );
  }
}
