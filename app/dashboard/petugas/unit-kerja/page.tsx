import FromStatus from "@/components/auth/form-status";
import TableWrapping from "@/components/table/table-wrapping";
import FormUnitKerja from "@/components/unit-kerja/form-unit-kerja";
import { columnUnitKerja } from "@/lib/columns/column-unit-kerja";
import { getUnitKerja } from "@/lib/data/unit-kerja";
import React from "react";

export default async function UnitKerja() {
  const unitKerja = await getUnitKerja();
  const column = columnUnitKerja;

  if (!unitKerja) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Unit Kerja</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Unit Kerja</div>
      <TableWrapping
        header="Data Unit Kerja"
        description="Data yang terdaftar sebagai unit garapan / unit kerja dalam yayasan al ghifari"
        searchBy="namaUnitKerja"
        labelSearch="nama unit kerja"
        data={unitKerja}
        columns={column}
      >
        <FormUnitKerja />
      </TableWrapping>
    </div>
  );
}
