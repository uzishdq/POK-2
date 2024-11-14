"use client";

import { TLaporanPinjaman, TLaporanSimpanan } from "@/types/laporan";
import { ColumnDef } from "@tanstack/react-table";
import { formatDatebyMonth, formatToIDR } from "../helper";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { TDetailSimpananBerjangka } from "@/types/simpanan";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TableWrapping from "@/components/table/table-wrapping";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columnLaporanPinjaman: ColumnDef<TLaporanPinjaman>[] = [
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
    accessorKey: "namaUnitKerja",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "noPinjaman",
    enableHiding: false,
    header: "No Pinjaman",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjaman")}</div>
    ),
  },
  {
    accessorKey: "tanggalPinjaman",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDatebyMonth(row.getValue("tanggalPinjaman"))}
      </div>
    ),
  },
  {
    accessorKey: "waktuPengembalian",
    enableHiding: false,
    header: "Angsuran Ke",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("waktuPengembalian")}</div>
    ),
  },
  {
    accessorKey: "ajuanPinjaman",
    enableHiding: false,
    header: "Jumlah Pinjaman",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("ajuanPinjaman"))}
      </div>
    ),
  },
  // {
  //   accessorKey: "jumlahAngsuran",
  //   enableHiding: false,
  //   header: "Jumlah Cicilan",
  //   cell: ({ row }) => (
  //     <div className="capitalize">
  //       {formatToIDR(row.getValue("jumlahAngsuran"))}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "akad",
    enableHiding: false,
    header: "Akad",
    cell: ({ row }) => (
      <div className="capitalize">{formatToIDR(row.getValue("akad"))}</div>
    ),
  },
  {
    accessorKey: "pokokMasuk",
    enableHiding: false,
    header: "Pokok Masuk",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("pokokMasuk"))}
      </div>
    ),
  },
  {
    accessorKey: "jasaMasuk",
    enableHiding: false,
    header: "Jasa Masuk",
    cell: ({ row }) => (
      <div className="capitalize">{formatToIDR(row.getValue("jasaMasuk"))}</div>
    ),
  },
  {
    accessorKey: "sisaPokok",
    enableHiding: false,
    header: "Sisa Pokok",
    cell: ({ row }) => (
      <div className="capitalize">{formatToIDR(row.getValue("sisaPokok"))}</div>
    ),
  },
];

export const columnLaporanSimpanan: ColumnDef<TLaporanSimpanan>[] = [
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
    accessorKey: "namaUnitKerja",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "jumlahSimpanan",
    enableHiding: false,
    header: "Total Simpanan",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahSimpanan"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "jumlahSimpananWajib",
    enableHiding: false,
    header: "Simpanan Wajib",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahSimpananWajib"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "jumlahSimpananSukamana",
    enableHiding: false,
    header: "Simpanan Sukamana",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahSimpananSukamana"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "pengambilanSimpanan",
    enableHiding: false,
    header: "Pengambilan Simpanan",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("pengambilanSimpanan"));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "saldoSimpanan",
    enableHiding: false,
    header: "Saldo Simpanan",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("saldoSimpanan"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
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
              <DetailLaporanSimpanan value={row.original.simpanan} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const columnDetailLaporanSimpanan: ColumnDef<TDetailSimpananBerjangka>[] = [
  {
    accessorKey: "bulan",
    header: "Bulan",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("bulan")}</div>
    ),
  },
  {
    accessorKey: "total",
    enableHiding: false,
    header: "Jumlah Simpanan",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("total"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
];

interface IDetailLaporanSimpanan {
  value: TDetailSimpananBerjangka[];
}

function DetailLaporanSimpanan({ value }: IDetailLaporanSimpanan) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-full">
          Detail Laporan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full">
        <ScrollArea>
          <TableWrapping
            header="Detail Simpanan Berjangka"
            description=""
            searchBy="bulan"
            labelSearch="Bulan / Tahun"
            data={value}
            columns={columnDetailLaporanSimpanan}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
