"use client";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import { formatDatebyMonth, formatToIDR } from "../helper";
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
import { Badge } from "@/components/ui/badge";
import { TListUndurDiri } from "@/types/undur-diri";
import { IOptionUndurDiri } from "../action/undur-diri";
import Link from "next/link";
import { ROUTES } from "../constan";

export const columnPengunduranAnggota: ColumnDef<TListUndurDiri>[] = [
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
    accessorKey: "tanggalPengunduran",
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
        row.getValue("tanggalPengunduran"),
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "simpananWajibPengunduranDiri",
    enableHiding: false,
    header: () => <div className="text-right">Simpanan Wajib</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(
        row.getValue("simpananWajibPengunduranDiri"),
      );
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananManasukaPengunduranDiri",
    enableHiding: false,
    header: () => <div className="text-right">Simpanan Sukamana</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(
        row.getValue("simpananManasukaPengunduranDiri"),
      );
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananLebaranPengunduranDiri",
    enableHiding: false,
    header: () => <div className="text-right">Simpanan Lebaran</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(
        row.getValue("simpananLebaranPengunduranDiri"),
      );
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananQurbanPengunduranDiri",
    enableHiding: false,
    header: () => <div className="text-right">Simpanan Qurban</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(
        row.getValue("simpananQurbanPengunduranDiri"),
      );
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "simpananUbarPengunduranDiri",
    enableHiding: false,
    header: () => <div className="text-right">Simpanan Ubar</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(
        row.getValue("simpananUbarPengunduranDiri"),
      );
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalDiterimaPengunduranDiri",
    enableHiding: false,
    header: () => <div className="text-right font-semibold">Total Bersih</div>,
    cell: ({ row }) => {
      const formatted = formatToIDR(
        row.getValue("totalDiterimaPengunduranDiri"),
      );
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusPengunduranDiri",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("statusPengunduranDiri")}</Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const isPending: boolean =
        row.original.statusPengunduranDiri === "PENDING";
      const dataOptions: TListUndurDiri = row.original;
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
            {isPending ? (
              <>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DialogOption value={dataOptions} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href={ROUTES.PETUGAS.PENGUNDURAN.SURAT_PENGUNDURAN(
                      row.original.noPengunduran,
                    )}
                    target="_blank"
                  >
                    Surat Pengunduran
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DetailPengunduran value={dataOptions} />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TListUndurDiri;
};

function DetailPengunduran(props: TDialog) {
  const dataAnggota = [
    {
      field: "Nama Pemohon",
      value: props.value.anggota.nama,
    },
    {
      field: "Unit Kerja",
      value: props.value.anggota.unitKerja.namaUnitKerja,
    },
    {
      field: "Simpanan Wajib",
      value: formatToIDR(props.value.simpananWajibPengunduranDiri),
    },
    {
      field: "Simpanan Sukamana",
      value: formatToIDR(props.value.simpananManasukaPengunduranDiri),
    },
    {
      field: "Simpanan Lebaran",
      value: formatToIDR(props.value.simpananLebaranPengunduranDiri),
    },
    {
      field: "Simpanan Qurban",
      value: formatToIDR(props.value.simpananQurbanPengunduranDiri),
    },
    {
      field: "Simpanan Ubar",
      value: formatToIDR(props.value.simpananUbarPengunduranDiri),
    },
    {
      field: "Total Simpanan",
      value: formatToIDR(props.value.totalPengunduranDiri),
    },
    {
      field: "Administrasi",
      value: formatToIDR(props.value.biayaPengunduranDiri),
    },
    {
      field: "Metode Pelunasan",
      value: props.value.jenisUndurDiri,
    },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-full">
          Option
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Pengunduran Anggota</DialogTitle>
          <DialogDescription>
            Berikut Detail pengunduran anggota
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            Total Bersih :{" "}
            <b>{formatToIDR(props.value.totalDiterimaPengunduranDiri)}</b>
          </p>
          <p>
            Status : <b>{props.value.statusPengunduranDiri}</b>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DialogOption(props: TDialog) {
  const dataAnggota = [
    {
      field: "Nama Pemohon",
      value: props.value.anggota.nama,
    },
    {
      field: "Unit Kerja",
      value: props.value.anggota.unitKerja.namaUnitKerja,
    },
    {
      field: "Simpanan Wajib",
      value: formatToIDR(props.value.simpananWajibPengunduranDiri),
    },
    {
      field: "Simpanan Sukamana",
      value: formatToIDR(props.value.simpananManasukaPengunduranDiri),
    },
    {
      field: "Simpanan Lebaran",
      value: formatToIDR(props.value.simpananLebaranPengunduranDiri),
    },
    {
      field: "Simpanan Qurban",
      value: formatToIDR(props.value.simpananQurbanPengunduranDiri),
    },
    {
      field: "Simpanan Ubar",
      value: formatToIDR(props.value.simpananUbarPengunduranDiri),
    },
    {
      field: "Total Simpanan",
      value: formatToIDR(props.value.totalPengunduranDiri),
    },
    {
      field: "Administrasi",
      value: formatToIDR(props.value.biayaPengunduranDiri),
    },
    {
      field: "Metode Pelunasan",
      value: props.value.jenisUndurDiri,
    },
  ];

  const dataOptions: IOptionUndurDiri = {
    noPengunduran: props.value.noPengunduran,
    anggotaId: props.value.anggotaId,
    noUser: props.value.noUser,
  };

  const [isPending, startTranssition] = useTransition();
  const onApproved = (values: IOptionUndurDiri) => {
    console.log(values);
  };

  const onRejected = (values: IOptionUndurDiri) => {
    console.log(values);
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
          <DialogTitle>Options Pengunduran Anggota</DialogTitle>
          <DialogDescription>
            Pilih Setujui untuk menyetujui pengunduran anggota atau Tolak untuk
            menolak pengunduran anggota sesuai dengan kebijakan dan persyaratan
            yang berlaku.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            Total Bersih :{" "}
            <b>{formatToIDR(props.value.totalDiterimaPengunduranDiri)}</b>
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="submit"
            variant="destructive"
            onClick={() => onRejected(dataOptions)}
            disabled={isPending}
          >
            {isPending && "Sedang Proses..."}
            {!isPending && "Tolak"}
          </Button>
          <Button
            type="submit"
            onClick={() => onApproved(dataOptions)}
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
