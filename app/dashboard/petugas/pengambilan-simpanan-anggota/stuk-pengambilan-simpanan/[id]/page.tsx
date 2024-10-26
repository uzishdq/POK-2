import FromStatus from "@/components/auth/form-status";
import ExportPDF from "@/components/export/export-to-pdf/exportPDF";
import BuktiPengambilanSpanan from "@/components/struk/struk-simpanan/bukti-pengambilan-simpanan";
import { getStrukPengambilanSimpanan } from "@/lib/data/simpanan";
import React from "react";

export default async function StrukPengambilanSimpanan({
  params,
}: {
  params: { id: string };
}) {
  const data = await getStrukPengambilanSimpanan(params.id);

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
    <>
      {data && data.value ? (
        <ExportPDF>
          <BuktiPengambilanSpanan data={data.value} />
        </ExportPDF>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <FromStatus status={false} message="Data Tidak Ditemukan" />
        </div>
      )}
    </>
  );
}
