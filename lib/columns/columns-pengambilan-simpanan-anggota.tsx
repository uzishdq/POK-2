"use client";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import { formatDatebyMonth, formatToIDR } from "../helper";
import { TPengambilanSimpananAnggota } from "@/types/simpanan";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ApprovedPengambilanSimpanan,
  RejectedPengambilanSimpanan,
} from "../action/simpanan";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ROUTES } from "../constan";
import { Badge } from "@/components/ui/badge";

export const columnPengambilanSimpananAnggota: ColumnDef<TPengambilanSimpananAnggota>[] =
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
        <div className="capitalize">
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
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const dataRows = row.original;

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
                <DialogEdit value={dataRows} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={ROUTES.PETUGAS.SIMPANAN_PETUGAS.STRUK_PENGAMBILAN(
                    row.original.noPengambilanSimpanan,
                  )}
                  target="_blank"
                >
                  Bukti Pembayaran Kas/Bank
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

type TDialog = {
  value: TPengambilanSimpananAnggota;
};

function DialogEdit({ value }: TDialog) {
  const data = [
    {
      field: "Nama",
      value: value.anggota.nama,
    },
    {
      field: "Unit Kerja",
      value: value.anggota.unitKerja.namaUnitKerja,
    },
    {
      field: "Bank",
      value: value.anggota.namaBank,
    },
    {
      field: "No Rekening",
      value: value.anggota.noRek,
    },
    {
      field: "Jumlah",
      value: formatToIDR(value.jumlahPengambilanSimpanan),
    },
    {
      field: "Jenis Simpanan",
      value: value.jenisPengambilanSimpanan,
    },
  ];
  const [isPending, startTranssition] = useTransition();

  const onApproved = (id: string) => {
    startTranssition(() => {
      ApprovedPengambilanSimpanan(id).then((data) => {
        toast({
          variant: data?.ok ? "default" : "destructive",
          title: data?.ok ? "SUCCESS" : "FAILED",
          description: data?.message,
        });
      });
    });
  };

  const onReject = (id: string) => {
    startTranssition(() => {
      RejectedPengambilanSimpanan(id).then((data) => {
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
        <Button size="icon" variant="ghost" className="w-full">
          Option
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Options Pengambilan Simpanan</DialogTitle>
          <DialogDescription>
            Pilih Setujui untuk menyetujui pengambilan simpanan atau Tolak untuk
            menolak pengambilan simpanan sesuai dengan kebijakan dan persyaratan
            yang berlaku.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <table>
            <tbody>
              {data.map((data, index) => (
                <tr key={index}>
                  <td>{data.field}</td>
                  <td>:</td>
                  <td>{data.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter className="gap-2">
          {value && value.statusPengambilanSimpanan === "REJECTED" ? (
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Batal
              </Button>
            </DialogClose>
          ) : (
            <>
              <Button
                type="submit"
                variant="destructive"
                onClick={() => onReject(value.noPengambilanSimpanan)}
                disabled={isPending}
              >
                {isPending && "Sedang Proses..."}
                {!isPending && "Tolak"}
              </Button>
              <Button
                type="submit"
                onClick={() => onApproved(value.noPengambilanSimpanan)}
                disabled={isPending}
              >
                {isPending && "Sedang Proses..."}
                {!isPending && "Setujui"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
