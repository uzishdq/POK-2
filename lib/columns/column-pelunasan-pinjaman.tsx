"use client";

import {
  TListAngsuranPinjaman,
  TListPelunasanPinjaman,
  TOptionPelunasanPinjaman,
} from "@/types/pinjaman";
import { ColumnDef } from "@tanstack/react-table";
import { formatDatebyMonth, formatToIDR, getStatusColor } from "../helper";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "../utils";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TableWrapping from "@/components/table/table-wrapping";
import { columnDetailAngsuran } from "./column-detail-angsuran";
import { toast } from "@/components/ui/use-toast";
import {
  approvedPelunasanPinjaman,
  rejectPelunasanPinjaman,
} from "../action/pinjaman";

export const columsPelunasanPinjaman: ColumnDef<TListPelunasanPinjaman>[] = [
  {
    accessorKey: "noPelunasanPinjaman",
    enableHiding: false,
    header: "No Pelunasan Pinjaman",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPelunasanPinjaman")}</div>
    ),
  },
  {
    accessorFn: (row) => row.pinjaman.anggota.nama,
    id: "nama",
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.pinjaman.anggota.nama}</div>
    ),
  },
  {
    accessorFn: (row) => row.pinjaman.anggota.unitKerja.namaUnitKerja,
    id: "namaUnitKerja",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.pinjaman.anggota.unitKerja.namaUnitKerja}
      </div>
    ),
  },
  {
    accessorKey: "tanggalPelunasanPinjaman",
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
        row.getValue("tanggalPelunasanPinjaman"),
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jumlahPelunasanPinjaman",
    enableHiding: false,
    header: "Jumlah Pelunasan",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahPelunasanPinjaman"));

      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "jenisPelunasanPinjaman",
    header: "Metode Pelunasan",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("jenisPelunasanPinjaman")}</Badge>
    ),
  },
  {
    accessorKey: "buktiPelunasanPinjaman",
    header: "Bukti Pembayaran",
    cell: ({ row }) => (
      <Button size="sm" variant="link">
        <Link href={row.getValue("buktiPelunasanPinjaman")} target="_blank">
          <ReceiptText className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
  {
    accessorKey: "statusPelunasanPinjaman",
    header: "Status",
    cell: ({ row }) => {
      const status = getStatusColor(row.getValue("statusPelunasanPinjaman"));
      return (
        <div className={cn("capitalize", status)}>
          {row.getValue("statusPelunasanPinjaman")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const angsuran = row.original.pinjaman.AngsuranPinjaman;
      const isPending: boolean =
        row.original.statusPelunasanPinjaman === "PENDING";
      const dataOptions: TOptionPelunasanPinjaman = {
        noPelunasan: row.original.noPelunasanPinjaman,
        nama: row.original.pinjaman.anggota.nama,
        unitKerja: row.original.pinjaman.anggota.unitKerja.namaUnitKerja,
        pinjamanId: row.original.pinjamanId,
        angsuranKe: row.original.angsuranKePelunasanPinjaman,
        sudahDibayarkan: row.original.sudahDibayarkan,
        waktuPelunasan: row.original.pinjaman.waktuPengembalian,
        ajuanPinjaman: row.original.pinjaman.ajuanPinjaman,
        jenis: row.original.jenisPelunasanPinjaman,
        jumlahDibayar: row.original.jumlahPelunasanPinjaman,
      };
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
            {isPending && (
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DialogOption value={dataOptions} />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDetailAngsuran = {
  value: TListAngsuranPinjaman[];
};

function DetailAngsuran({ value }: TDetailAngsuran) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-full">
          Detail Angsuran
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
type TDialogOption = {
  value: TOptionPelunasanPinjaman;
};

function DialogOption(props: TDialogOption) {
  const dataAnggota = [
    {
      field: "Nama Pemohon",
      value: props.value.nama,
    },
    {
      field: "Unit Kerja",
      value: props.value.unitKerja,
    },
    {
      field: "Waktu Pengembalian",
      value: `${props.value.waktuPelunasan} Bulan`,
    },
    {
      field: "Jumlah Pinjaman",
      value: formatToIDR(props.value.ajuanPinjaman),
    },
    {
      field: "Metode Pelunasan",
      value: props.value.jenis,
    },
    {
      field: "Angsuran",
      value: `${props.value.angsuranKe}/${props.value.waktuPelunasan} Bulan`,
    },
    {
      field: "Sudah Dibayarkan",
      value: formatToIDR(props.value.sudahDibayarkan),
    },
  ];

  const [isPending, startTranssition] = useTransition();
  const onApproved = (id: string, pinjamanId: string, pelunasan: number) => {
    startTranssition(() => {
      approvedPelunasanPinjaman(id, pinjamanId, pelunasan).then((data) => {
        toast({
          variant: data?.ok ? "default" : "destructive",
          title: data?.ok ? "SUCCESS" : "FAILED",
          description: data?.message,
        });
      });
    });
  };

  const onRejected = (id: string, pinjamanId: string) => {
    startTranssition(() => {
      rejectPelunasanPinjaman(id, pinjamanId).then((data) => {
        toast({
          variant: data?.ok ? "default" : "destructive",
          title: data?.ok ? "SUCCESS" : "FAILED",
          description: data?.message,
        });
      });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-full">
          Option
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Options Pelunasan Pinjaman</DialogTitle>
          <DialogDescription>
            Pilih Setujui untuk menyetujui pelunasan pinjaman atau Tolak untuk
            menolak pelunasan pinjaman sesuai dengan kebijakan dan persyaratan
            yang berlaku.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>No.Pinjaman : {props.value.pinjamanId}</p>
          <table>
            <tbody>
              {dataAnggota.map((data, index) => (
                <tr key={index}>
                  <td>{data.field}</td>
                  <td>:</td>
                  <td>{data.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Jumlah Pelunasan : <b>{formatToIDR(props.value.jumlahDibayar)}</b>
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="submit"
            variant="destructive"
            onClick={() =>
              onRejected(props.value.noPelunasan, props.value.pinjamanId)
            }
            disabled={isPending}
          >
            {isPending && "Sedang Proses..."}
            {!isPending && "Tolak"}
          </Button>
          <Button
            type="submit"
            onClick={() =>
              onApproved(
                props.value.noPelunasan,
                props.value.pinjamanId,
                props.value.jumlahDibayar,
              )
            }
            disabled={isPending}
          >
            {isPending && "Sedang Proses..."}
            {!isPending && "Setujui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
