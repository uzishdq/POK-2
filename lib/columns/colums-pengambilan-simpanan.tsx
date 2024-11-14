"use client";
import { Button } from "@/components/ui/button";
import { TPengambilanSimpanan } from "@/types/simpanan";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatDatebyMonth, formatToIDR } from "../helper";
import { Badge } from "@/components/ui/badge";

export const columnPengambilanSimpanan: ColumnDef<TPengambilanSimpanan>[] = [
  {
    accessorKey: "noPengambilanSimpanan",
    header: "No Pengambilan Simpanan",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPengambilanSimpanan")}</div>
    ),
  },
  {
    accessorKey: "tanggalPengambilanSimpanan",
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
      const formattedDate = formatDatebyMonth(
        row.getValue("tanggalPengambilanSimpanan"),
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisPengambilanSimpanan",
    header: "Jenis",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("jenisPengambilanSimpanan") === "MANASUKA"
          ? "SUKAMANA"
          : row.getValue("jenisPengambilanSimpanan")}
      </Badge>
    ),
  },
  {
    accessorKey: "statusPengambilanSimpanan",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue("statusPengambilanSimpanan")}
      </Badge>
    ),
  },
  {
    accessorKey: "jumlahPengambilanSimpanan",
    enableHiding: false,
    header: () => <div className="text-right">Jumlah</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahPengambilanSimpanan"));
      return <div className="text-right font-semibold">{formatted}</div>;
    },
  },
];
