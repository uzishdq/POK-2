import FromStatus from "@/components/auth/form-status";
import ExportPDF from "@/components/export/export-to-pdf/exportPDF";
import PernyataanPinjaman from "@/components/struk/struk-pinjaman/pernyataan-pinjaman";
import StrukPinjaman from "@/components/struk/struk-pinjaman/struk-pinjaman";
import SyaratPinjaman from "@/components/struk/struk-pinjaman/syarat-pinjaman";
import { getStrukPinjamanAdmin } from "@/lib/data/pinjaman";
import React from "react";

export default async function SuratPermohonanPinjaman({
  params,
}: {
  params: { id: string };
}) {
  const data = await getStrukPinjamanAdmin(params.id);

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
          <SyaratPinjaman />
          <StrukPinjaman data={data.value} />
          {data.value.jenisPinjaman === "JASA" ? (
            <PernyataanPinjaman data={data.value} />
          ) : null}
        </ExportPDF>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <FromStatus status={false} message="Data Tidak Ditemukan" />
        </div>
      )}
    </div>
  );
}
