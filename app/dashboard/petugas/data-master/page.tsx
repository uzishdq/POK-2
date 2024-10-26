import FromStatus from "@/components/auth/form-status";
import FormDataMaster from "@/components/data-master/form-data-master";
import TableWrapping from "@/components/table/table-wrapping";
import { columnMaster } from "@/lib/columns/colums-master";
import { getJabatan } from "@/lib/data/jabatan";
import { getListMaster } from "@/lib/data/master";
import { getUnitKerja } from "@/lib/data/unit-kerja";
import React from "react";

export default async function DataMaster() {
  const [data, jabatan, unitKerja] = await Promise.all([
    getListMaster(),
    getJabatan(),
    getUnitKerja(),
  ]);

  if (!data || (!jabatan && !unitKerja)) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Data Master</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Data Master</div>
      <TableWrapping
        header="Data Karyawan Yayasan Al Ghifari"
        description="Data yang terdaftar sebagai karyawan yayasan al ghifari"
        searchBy="namaMaster"
        labelSearch="nama"
        data={data}
        columns={columnMaster}
      >
        <FormDataMaster jabatan={jabatan} unitKerja={unitKerja} />
      </TableWrapping>
    </div>
  );
}
