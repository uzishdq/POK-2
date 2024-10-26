import CobaKirimWa from "@/components/coba/coba-kirim-wa";
import TableWrapping from "@/components/table/table-wrapping";
import { columnSimpananBerjangkaAnggota } from "@/lib/columns/column-simpanan-berjangka";
import { getSimpananBerjangka } from "@/lib/data/simpanan";
import React from "react";

export default async function CobaWa() {
  const data = await getSimpananBerjangka("simpanan-lebaran");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Coba</div>
      {data && data.value && (
        <TableWrapping
          header="List Pendaftaran Simpanan Berjangka"
          description="Data yang merupakan setting untuk pendaftaran simpanan berjangka pada anggota"
          searchBy="nama"
          labelSearch="nama"
          data={data.value}
          columns={columnSimpananBerjangkaAnggota}
        />
      )}
    </div>
  );
}
