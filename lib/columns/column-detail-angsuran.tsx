"use client";
import { TListAngsuranPinjaman } from "@/types/pinjaman";
import { ColumnDef } from "@tanstack/react-table";
import { formatDatebyMonth, formatToIDR, getStatusColor } from "../helper";
import { cn } from "../utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columnDetailAngsuran: ColumnDef<TListAngsuranPinjaman>[] = [
  {
    accessorKey: "noAngsuranPinjaman",
    enableHiding: false,
    header: "No Angsuran",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAngsuranPinjaman")}</div>
    ),
  },
  {
    accessorKey: "tanggalAngsuranPinjaman",
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
        row.getValue("tanggalAngsuranPinjaman"),
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "pinjamanId",
    enableHiding: false,
    header: "No Pinjaman",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("pinjamanId")}</div>
    ),
  },
  {
    accessorKey: "angsuranPinjamanKe",
    header: "Angsuran Ke - Dari",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.angsuranPinjamanKe} - {row.original.angsuranPinjamanDari}
      </div>
    ),
  },
  {
    accessorKey: "statusAngsuranPinjaman",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {row.getValue("statusAngsuranPinjaman")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "jumlahAngsuranPinjaman",
    enableHiding: false,
    header: "Jumlah Angsuran",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahAngsuranPinjaman"));
      return <div className="text-right font-semibold">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const angsuran = row.original.noAngsuranPinjaman;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Struk Angsuran</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
