import FromStatus from "@/components/auth/form-status";
import ExportPDF from "@/components/export/export-to-pdf/exportPDF";
import PernyataanPengunduran from "@/components/surat/pernyataan-pengunduran";
import { getSuratPengunduran } from "@/lib/data/undur-diri";
import React from "react";

export default async function SuratPengunduranAnggota({
  params,
}: {
  params: { id: string };
}) {
  const data = await getSuratPengunduran(params.id);

  if (!data.ok) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  return (
    <div>
      {data && data.value ? (
        <ExportPDF>
          <PernyataanPengunduran data={data.value} />
        </ExportPDF>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <FromStatus status={false} message="Data Tidak Ditemukan" />
        </div>
      )}
    </div>
  );
}
