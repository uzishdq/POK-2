"use client";
import { Button } from "@/components/ui/button";
import { TSimpanan, TTotalBalance } from "@/types/simpanan";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatDatebyMonth, formatToIDR } from "../helper";
import { Badge } from "@/components/ui/badge";

export const columnSimpanan: ColumnDef<TSimpanan>[] = [
  {
    accessorKey: "noSimpanan",
    header: "No Simpanan",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noSimpanan")}</div>
    ),
  },
  {
    accessorKey: "tanggalSimpanan",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = formatDatebyMonth(row.getValue("tanggalSimpanan"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisSimpanan",
    header: "Jenis",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("jenisSimpanan")}</Badge>
    ),
  },
  {
    accessorKey: "jumlahSimpanan",
    enableHiding: false,
    header: () => <div className="text-right">Jumlah</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahSimpanan"));
      return <div className="text-right font-semibold">{formatted}</div>;
    },
  },
];

export const columnLaporanSimpanan: ColumnDef<TTotalBalance>[] = [
  {
    accessorKey: "noAnggota",
    enableHiding: false,
    header: "No Anggota",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAnggota")}</div>
    ),
  },
  {
    accessorKey: "nama",
    enableHiding: false,
    header: "Nama",
    cell: ({ row }) => <div className="capitalize">{row.getValue("nama")}</div>,
  },
  {
    accessorKey: "unitKerja",
    header: "Unit Garapan",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("unitKerja")}</div>
    ),
  },
  {
    accessorKey: "wajib",
    enableHiding: false,
    header: "Simpanan Wajib",
    cell: ({ row }) => (
      <div className="font-semibold">{formatToIDR(row.getValue("wajib"))}</div>
    ),
  },
  {
    accessorKey: "manasuka",
    enableHiding: false,
    header: "Simpanan Sukamana",
    cell: ({ row }) => (
      <div className="font-semibold">
        {formatToIDR(row.getValue("manasuka"))}
      </div>
    ),
  },
  {
    accessorKey: "lebaran",
    enableHiding: false,
    header: "Simpanan Lebaran",
    cell: ({ row }) => (
      <div className="font-semibold">
        {formatToIDR(row.getValue("lebaran"))}
      </div>
    ),
  },
  {
    accessorKey: "qurban",
    enableHiding: false,
    header: "Simpanan Qurban",
    cell: ({ row }) => (
      <div className="font-semibold">{formatToIDR(row.getValue("qurban"))}</div>
    ),
  },
  {
    accessorKey: "ubar",
    enableHiding: false,
    header: "Simpanan Ubar",
    cell: ({ row }) => (
      <div className="font-semibold">{formatToIDR(row.getValue("ubar"))}</div>
    ),
  },
  {
    accessorKey: "totalPengambilan",
    enableHiding: false,
    header: "Total Pengambilan",
    cell: ({ row }) => (
      <div className="font-semibold">
        {formatToIDR(row.getValue("totalPengambilan"))}
      </div>
    ),
  },
  {
    accessorKey: "total",
    enableHiding: false,
    header: "Saldo",
    cell: ({ row }) => (
      <div className="text-right font-semibold">
        {formatToIDR(row.getValue("total"))}
      </div>
    ),
  },
];
