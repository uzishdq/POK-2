import FromStatus from "@/components/auth/form-status";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnSimpanan } from "@/lib/columns/column-simpanan";
import { getSimpananById, getTotalSimpananById } from "@/lib/data/simpanan";
import { getSesi } from "@/lib/session";
import { Wallet } from "lucide-react";
import React from "react";

export default async function SimpananUbar() {
  const session = await getSesi();
  if (session?.user && session.user.id) {
    const [totalSimpananUbar, simpananUbar] = await Promise.all([
      getTotalSimpananById(session.user.id, "UBAR"),
      getSimpananById(session.user.id, "UBAR"),
    ]);
    const column = columnSimpanan;
    if (!totalSimpananUbar?.ok || !simpananUbar.ok) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Simpanan Ulin Bareng</div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Simpanan Ulin Bareng</div>
        <div className="grid gap-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Simpanan Ulin Bareng
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalSimpananUbar.value}
              </div>
            </CardContent>
          </Card>
        </div>
        {simpananUbar && simpananUbar.value && (
          <TableWrappingDate
            header="Data Simpanan Ulin Bareng"
            description="Berikut adalah riwayat simpanan ulin bareng yang tercantum"
            searchBy="noSimpanan"
            labelSearch="no simpanan"
            input={true}
            filterDate="tanggalSimpanan"
            data={simpananUbar.value}
            columns={column}
          />
        )}
      </div>
    );
  }
}
