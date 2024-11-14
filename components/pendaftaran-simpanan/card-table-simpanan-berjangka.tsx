import {
  TSimpananBerjangkaById,
  TSimpananBerjangkaValue,
} from "@/types/simpanan";
import React from "react";
import TableWrapping from "../table/table-wrapping";
import {
  formatDatebyMonth,
  generateColumnsExcellSimpananBerjangka,
  transformDataExcellSimpananBerjangka,
} from "@/lib/helper";
import { columnSimpananBerjangkaAnggota } from "@/lib/columns/column-simpanan-berjangka";
import ExportExcell from "../laporan/export-excell";

interface ICardTableSimpananBerjangka {
  data: TSimpananBerjangkaValue[];
  pendaftaran: TSimpananBerjangkaById;
}
export default function CardTableSimpananBerjangka({
  data,
  pendaftaran,
}: ICardTableSimpananBerjangka) {
  return (
    <TableWrapping
      header={`${pendaftaran.namaPendaftaran.toUpperCase()} ANGGOTA`}
      description={`Rentang Waktu Simpanan : ${formatDatebyMonth(pendaftaran.tanggalAwalSimpanan)} - ${formatDatebyMonth(pendaftaran.tanggalAkhirSimpanan)}, Status Simpanan : ${pendaftaran.statusPendaftaran}`}
      searchBy="nama"
      labelSearch="nama"
      data={data}
      columns={columnSimpananBerjangkaAnggota}
    >
      <ExportExcell
        data={transformDataExcellSimpananBerjangka(data)}
        columns={generateColumnsExcellSimpananBerjangka(
          pendaftaran.tanggalAwalSimpanan,
          pendaftaran.tanggalAkhirSimpanan,
        )}
        title={`${pendaftaran.namaPendaftaran.toUpperCase()} ANGGOTA Rentang Waktu Simpanan : ${formatDatebyMonth(pendaftaran.tanggalAwalSimpanan)} - ${formatDatebyMonth(pendaftaran.tanggalAkhirSimpanan)}, Status Simpanan : ${pendaftaran.statusPendaftaran}. Download `}
        fileName={`REKAP ${pendaftaran.namaPendaftaran.toUpperCase()}`}
        buttonLabel="Download"
      />
    </TableWrapping>
  );
}
