"use client";
import { Button } from "@/components/ui/button";
import { TListAngsuranPinjaman, TListPinjamanId } from "@/types/pinjaman";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, ReceiptText } from "lucide-react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TableWrapping from "@/components/table/table-wrapping";
import { columnDetailAngsuran } from "./column-detail-angsuran";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const columnPinjaman: ColumnDef<TListPinjamanId>[] = [
  {
    accessorKey: "noPinjaman",
    enableHiding: false,
    header: "No Pinjaman Produktif",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjaman")}</div>
    ),
  },
  {
    accessorKey: "tujuanPinjaman",
    header: "Tujuan Pinjaman",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tujuanPinjaman")}</div>
    ),
  },
  {
    accessorKey: "tanggalPinjaman",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalPinjaman"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisPinjaman",
    header: "Jenis",
    cell: ({ row }) => {
      const jenis =
        row.getValue("jenisPinjaman") === "JASA" ? "PRODUKTIF" : "BARANG";

      return <Badge variant="outline">{jenis}</Badge>;
    },
  },
  {
    accessorKey: "ajuanPinjaman",
    enableHiding: false,
    header: "Jumlah Pinjaman",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("ajuanPinjaman"));
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "waktuPengembalian",
    enableHiding: false,
    header: "Waktu Pengembalian",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("waktuPengembalian")} Bulan
      </div>
    ),
  },
  {
    accessorKey: "statusPinjaman",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">{row.getValue("statusPinjaman")}</Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const angsuran = row.original.AngsuranPinjaman;
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
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DetailAngsuran value={angsuran} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columnPinjamanPending: ColumnDef<TListPinjamanId>[] = [
  {
    accessorKey: "noPinjaman",
    enableHiding: false,
    header: "No Pinjaman Produktif",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjaman")}</div>
    ),
  },
  {
    accessorKey: "tujuanPinjaman",
    header: "Tujuan Pinjaman",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tujuanPinjaman")}</div>
    ),
  },
  {
    accessorKey: "tanggalPinjaman",
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
      const formattedDate = formatDatebyMonth(row.getValue("tanggalPinjaman"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisPinjaman",
    header: "Jenis",
    cell: ({ row }) => {
      const jenis =
        row.getValue("jenisPinjaman") === "JASA" ? "PRODUKTIF" : "BARANG";
      return <Badge variant="outline">{jenis}</Badge>;
    },
  },
  {
    accessorKey: "ajuanPinjaman",
    enableHiding: false,
    header: "Jumlah Pinjaman",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("ajuanPinjaman"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "waktuPengembalian",
    enableHiding: false,
    header: "Waktu Pengembalian",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("waktuPengembalian")} Bulan
      </div>
    ),
  },
  {
    accessorKey: "jumlahPenghasilan",
    header: "Penghasilan",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahPenghasilan"));

      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusPinjaman",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">{row.getValue("statusPinjaman")}</Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const strukGaji = row.original.strukGaji;
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
            <DropdownMenuItem>
              <Button size="sm" variant="link">
                <Link
                  href={strukGaji}
                  target="_blank"
                  className="flex items-center justify-center gap-2"
                >
                  <ReceiptText className="h-4 w-4" />
                  <span>struk gaji</span>
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TAngsuran = {
  value: TListAngsuranPinjaman[];
};

function DetailAngsuran({ value }: TAngsuran) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-full">
          Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full">
        <ScrollArea>
          <TableWrapping
            header="Detail Angsuran"
            description="Data Angsuran Pinjaman"
            searchBy="noAngsuranPinjaman"
            labelSearch="no angsuran"
            data={value}
            columns={columnDetailAngsuran}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
