"use client";
import { TPendaftar } from "@/types/simpanan";
import { ColumnDef } from "@tanstack/react-table";
import { formatToIDR } from "../helper";

export const columnListPendaftar: ColumnDef<TPendaftar>[] = [
  {
    accessorFn: (row) => row.anggota.noAnggota,
    id: "No Anggota",
    header: "No Anggota",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.anggota.noAnggota}</div>
    ),
  },
  {
    accessorFn: (row) => row.anggota.nama,
    id: "nama",
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.anggota.nama}</div>
    ),
  },
  {
    accessorFn: (row) => row.anggota.unitKerja.namaUnitKerja,
    id: "namaUnitKerja",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.anggota.unitKerja.namaUnitKerja}
      </div>
    ),
  },
  {
    accessorKey: "jumlahPilihan",
    enableHiding: false,
    header: "Jumlah Simpanan",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahPilihan"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
];
