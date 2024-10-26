import FromStatus from "@/components/auth/form-status";
import FormJabatan from "@/components/jabatan/form-jabatan";
import TableWrapping from "@/components/table/table-wrapping";
import { columnJabatan } from "@/lib/columns/column-jabatan";
import { getJabatan } from "@/lib/data/jabatan";
import React from "react";

export default async function Jabatan() {
  const jabatan = await getJabatan();

  if (!jabatan) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Jabatan</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Jabatan</div>
      <TableWrapping
        header="Data Jabatan"
        description="Data yang terdaftar sebagai jabatan dalam yayasan al ghifari"
        searchBy="namaJabatan"
        labelSearch="nama jabatan"
        data={jabatan}
        columns={columnJabatan}
      >
        <FormJabatan />
      </TableWrapping>
    </div>
  );
}
