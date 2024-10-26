import FormLaporanSimpanan from "@/components/laporan/form-laporan-simpanan";
import React from "react";

export default function LaporanSimpanan() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Laporan Simpanan</div>
      <FormLaporanSimpanan />
    </div>
  );
}
