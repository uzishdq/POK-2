"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { TAsuransi } from "@/types/asuransi";
import { formatDatebyMonth, formatToIDR } from "../helper";
import { ArrowUpDown } from "lucide-react";

export const columnAsuransi: ColumnDef<TAsuransi>[] = [
  {
    accessorFn: (row) => row.pinjaman.anggota.nama,
    id: "nama",
    enableHiding: false,
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.pinjaman.anggota.nama}</div>
    ),
  },
  {
    accessorFn: (row) => row.pinjaman.anggota.unitKerja.namaUnitKerja,
    id: "namaUnitKerja",
    enableHiding: false,
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.pinjaman.anggota.unitKerja.namaUnitKerja}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.pinjaman.ajuanPinjaman,
    id: "tanggalLahir",
    header: "Tanggal Lahir",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDatebyMonth(row.original.pinjaman.anggota.tanggalLahir)}
      </div>
    ),
  },
  {
    accessorKey: "usiaAsuransi",
    enableHiding: false,
    header: "Usia",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("usiaAsuransi")}</div>
    ),
  },
  {
    accessorKey: "pinjamanId",
    header: "No Pinjaman",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("pinjamanId")}</div>
    ),
  },
  {
    accessorKey: "tanggalAsuransi",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
        >
          Tanggal Awal Asuransi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formatDate = formatDatebyMonth(row.getValue("tanggalAsuransi"));
      return <div className="capitalize">{formatDate}</div>;
    },
  },
  {
    accessorKey: "tanggalAkhirAsuransi",
    header: "Tanggal Akhir Asuransi",
    cell: ({ row }) => {
      const formatDate = formatDatebyMonth(
        row.getValue("tanggalAkhirAsuransi"),
      );
      return <div className="capitalize">{formatDate}</div>;
    },
  },
  {
    accessorKey: "masaAsuransiTH",
    header: "TH",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("masaAsuransiTH")}</div>
    ),
  },
  {
    accessorKey: "masaAsuransiBL",
    header: "BL",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("masaAsuransiBL")}</div>
    ),
  },
  {
    accessorKey: "masaAsuransiJK",
    header: "JK",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("masaAsuransiJK")}</div>
    ),
  },
  {
    accessorFn: (row) => row.pinjaman.ajuanPinjaman,
    id: "up",
    enableHiding: false,
    header: "UP",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.original.pinjaman.ajuanPinjaman)}
      </div>
    ),
  },
  {
    accessorKey: "premi",
    enableHiding: false,
    header: () => <div className="text-right">Jumlah Premi</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("premi"));
      return <div className="text-right font-semibold">{formatted}</div>;
    },
  },
];
