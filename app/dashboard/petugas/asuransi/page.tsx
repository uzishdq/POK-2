import FromStatus from "@/components/auth/form-status";
import ExportExcell from "@/components/laporan/export-excell";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import { columnAsuransi } from "@/lib/columns/column-asuransi";
import { columnsExcelAsuransi } from "@/lib/constan";
import { getListAsuransi } from "@/lib/data/asuransi";
import React from "react";

export default async function Asuransi() {
  const data = await getListAsuransi();

  if (!data.ok) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Asuransi Pinjaman</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Asuransi Pinjaman</div>
      {data.value && (
        <TableWrappingDate
          header="List Asuransi Pinjaman"
          description="Data Asuransi Pinjaman Anggota setelah mengajukan pinjaman produktif"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalAsuransi"
          data={data.value}
          columns={columnAsuransi}
        >
          <ExportExcell
            data={data.value}
            columns={columnsExcelAsuransi}
            title="DAFTAR PESERTA ASURANSI JIWA KREDIT CICILAN BULANAN KOPERASI KARYAWAN YAYASAN GURUMINDA"
            fileName="DAFTAR PESERTA ASURANSI"
            buttonLabel="Download"
          />
        </TableWrappingDate>
      )}
    </div>
  );
}
