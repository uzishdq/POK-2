"use client";
import { Button } from "@/components/ui/button";
import {
  TListAngsuranPinjaman,
  TListPinjaman,
  TOptionPinjaman,
} from "@/types/pinjaman";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, ReceiptText } from "lucide-react";
import { formatDatebyMonth, formatToIDR, getStatusColor } from "../helper";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "../utils";
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
import TableWrapping from "@/components/table/table-wrapping";
import { columnDetailAngsuran } from "./column-detail-angsuran";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTransition } from "react";
import { approvePinjaman, rejectPinjaman } from "../action/pinjaman";
import { toast } from "@/components/ui/use-toast";
import { ROUTES } from "../constan";
import { Badge } from "@/components/ui/badge";

//struk gaji masih error
export const columnPinjamanJasaAnggota: ColumnDef<TListPinjaman>[] = [
  {
    accessorKey: "noPinjaman",
    enableHiding: false,
    header: "No Pinjaman Produktif",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjaman")}</div>
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
    accessorKey: "statusPinjaman",
    header: "Status",
    cell: ({ row }) => {
      const status = getStatusColor(row.getValue("statusPinjaman"));
      return (
        <div className={cn("capitalize", status)}>
          {row.getValue("statusPinjaman")}
        </div>
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

export const columnPinjamanJasaAnggotaPending: ColumnDef<TListPinjaman>[] = [
  {
    accessorKey: "noPinjaman",
    header: "No Pinjaman Produktif",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjaman")}</div>
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
    accessorKey: "jumlahDiterima",
    enableHiding: false,
    header: "Jumlah Diterima",
    cell: ({ row }) => {
      const formatted = formatToIDR(row.getValue("jumlahDiterima"));
      return <div className="font-semibold">{formatted}</div>;
    },
  },
  {
    accessorKey: "strukGaji",
    header: "Struk Gaji",
    cell: ({ row }) => (
      <Button size="sm" variant="link">
        <Link href={row.getValue("strukGaji")} target="_blank">
          <ReceiptText className="h-4 w-4" />
        </Link>
      </Button>
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
      const status = getStatusColor(row.getValue("statusPinjaman"));
      return (
        <div className={cn("capitalize", status)}>
          {row.getValue("statusPinjaman")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const option = row.original.anggota;
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
              <DialogOption
                value={option}
                jumlah={row.original.jumlahDiterima}
                id={row.original.noPinjaman}
                alasan={row.original.tujuanPinjaman}
                jenis={row.original.jenisPinjaman}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={ROUTES.PETUGAS.PINJAMAN_PETUGAS.STRUK(
                  row.original.noPinjaman,
                )}
                target="_blank"
              >
                Surat Pengajuan Pinjaman
              </Link>
            </DropdownMenuItem>
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

type TOptions = {
  value: TOptionPinjaman;
  jumlah: number;
  id: string;
  alasan: string;
  jenis: "BARANG" | "JASA";
};

function DialogOption({ value, jumlah, id, alasan, jenis }: TOptions) {
  const dataAnggota = [
    {
      field: "Nama Pemohon",
      value: value.nama,
    },
    {
      field: "Unit Kerja",
      value: value.unitKerja.namaUnitKerja,
    },
    {
      field: "No Telp",
      value: value.noTelp,
    },
    {
      field: "Bank",
      value: value.namaBank,
    },
    {
      field: "No Rekening",
      value: value.noRek,
    },
  ];
  const [isPending, startTranssition] = useTransition();
  const onApproved = (
    id: string,
    anggotaId: string,
    jenis: "BARANG" | "JASA",
  ) => {
    startTranssition(() => {
      approvePinjaman(id, anggotaId, jenis).then((data) => {
        toast({
          variant: data?.ok ? "default" : "destructive",
          title: data?.ok ? "SUCCESS" : "FAILED",
          description: data?.message,
        });
      });
    });
  };

  const onRejected = (id: string) => {
    startTranssition(() => {
      rejectPinjaman(id).then((data) => {
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
          <DialogTitle>Options Pengajuan Pinjaman</DialogTitle>
          <DialogDescription>
            Pilih Setujui untuk menyetujui pengajuan pinjaman atau Tolak untuk
            menolak pengajuan pinjaman sesuai dengan kebijakan dan persyaratan
            yang berlaku.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Tujuan Pinjaman : {alasan}</p>
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
            Jumlah Diterima : <b>{formatToIDR(jumlah)}</b>
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="submit"
            variant="destructive"
            onClick={() => onRejected(id)}
            disabled={isPending}
          >
            {isPending && "Sedang Proses..."}
            {!isPending && "Tolak"}
          </Button>
          <Button
            type="submit"
            onClick={() => onApproved(id, value.noAnggota, jenis)}
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
