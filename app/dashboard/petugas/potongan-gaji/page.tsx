import FromStatus from "@/components/auth/form-status";
import ExportExcell from "@/components/laporan/export-excell";
import ImportPotongGaji from "@/components/potong-gaji/import-potong-gaji";
import TableWrapping from "@/components/table/table-wrapping";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import {
  columnPotonganGaji,
  columnPotonganGajiApproved,
} from "@/lib/columns/column-potongan-gaji";
import { columnsPotonganGaji } from "@/lib/constan";
import {
  getListPotonganGaji,
  getListPotonganGajiApproved,
} from "@/lib/data/potong-gaji";
import React from "react";

export default async function PotonganGaji() {
  const [data, approved] = await Promise.all([
    getListPotonganGaji(),
    getListPotonganGajiApproved(),
  ]);

  if (!approved.ok) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Potongan Gaji Anggota</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Potongan Gaji Anggota</div>
      <TableWrapping
        header="Data Potongan Gaji Anggota"
        description="Data potongan gaji anggota mencakup rincian potongan seperti simpanan dan angsuran pinjaman"
        searchBy="nama"
        labelSearch="nama"
        columns={columnPotonganGaji}
        data={data}
      >
        <ExportExcell
          data={data}
          columns={columnsPotonganGaji}
          title="REKAP POTONGAN GAJI"
          fileName="REKAP POTONGAN GAJI"
          buttonLabel="Download"
        />
      </TableWrapping>
      <ImportPotongGaji />
      {approved && approved.value && (
        <TableWrappingDate
          header="Riwayat Potongan Gaji Anggota"
          description="Data potongan gaji anggota sudah berhasil diinput"
          searchBy="namaPotongGaji"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPotonganGaji"
          columns={columnPotonganGajiApproved}
          data={approved.value}
        />
      )}
    </div>
  );
}
