"use client";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatDatebyMonth, formatToIDR, getStatusColor } from "../helper";
import { TPengambilanSimpananAnggota } from "@/types/simpanan";
import { Badge } from "@/components/ui/badge";

export const columnPengambilanSimpananAnggotaApproved: ColumnDef<TPengambilanSimpananAnggota>[] =
  [
    {
      accessorKey: "noPengambilanSimpanan",
      header: "No Pengambilan Simpanan",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("noPengambilanSimpanan")}
        </div>
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
        <div className="font-semibold capitalize">
          {row.getValue("statusPengambilanSimpanan")}
        </div>
      ),
    },
    {
      accessorKey: "jumlahPengambilanSimpanan",
      enableHiding: false,
      header: () => <div className="text-right">Jumlah</div>,
      cell: ({ row }) => {
        const formatted = formatToIDR(
          row.getValue("jumlahPengambilanSimpanan"),
        );
        return <div className="text-right font-semibold">{formatted}</div>;
      },
    },
  ];
