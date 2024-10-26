"use client";

import { Button } from "@/components/ui/button";
import {
  TDetailSimpananBerjangka,
  TListSimpananBerjangka,
  TPendaftar,
  TSimpananBerjangka,
  TSimpananBerjangkaValue,
} from "@/types/simpanan";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatDatebyMonth, formatToIDR } from "../helper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  deleteSettingSimpananBerjangka,
  editSettingSimpananBerjangka,
} from "../action/simpanan";
import { SettingPendaftaranSchema } from "../schema/setting-pendaftaran-simpanan-schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  columnsExcelPendaftarSimpananBerjangka,
  jenisPendaftaran,
} from "../constan";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TableWrapping from "@/components/table/table-wrapping";
import { columnListPendaftar } from "./column-list-pendaftar";
import ExportExcell from "@/components/laporan/export-excell";

export const columnSimpananBerjangka: ColumnDef<TListSimpananBerjangka>[] = [
  {
    accessorKey: "namaPendaftaran",
    header: "Nama Pendaftaran",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaPendaftaran")}</div>
    ),
  },
  {
    accessorKey: "jenisPendaftaran",
    header: "Jenis ",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("jenisPendaftaran")}</div>
    ),
  },
  {
    accessorKey: "tanggalTutupPendaftaran",
    header: "Penutupan Pendaftaran",
    cell: ({ row }) => {
      const formattedDate = formatDatebyMonth(
        row.getValue("tanggalTutupPendaftaran"),
      );
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "tanggalAwalSimpanan",
    header: "Rentang Waktu Simpanan",
    cell: ({ row }) => {
      const formattedDate1 = formatDatebyMonth(
        row.getValue("tanggalAwalSimpanan"),
      );
      const formattedDate2 = formatDatebyMonth(
        row.original.tanggalAkhirSimpanan,
      );
      return (
        <div className="capitalize">
          {formattedDate1} - {formattedDate2}
        </div>
      );
    },
  },
  {
    accessorKey: "statusPendaftaran",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("statusPendaftaran")}</Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dataRows = row.original;
      const pendaftar = row.original.Pendaftar;
      const namaPendaftaran = row.original.namaPendaftaran;
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
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <DialogEdit value={dataRows} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DialogDelete value={dataRows} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <ListPendaftaran
                value={pendaftar}
                namaPendaftaran={namaPendaftaran}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TSimpananBerjangka;
};

function DialogEdit({ value }: TDialog) {
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof SettingPendaftaranSchema>>({
    resolver: zodResolver(SettingPendaftaranSchema),
    defaultValues: {
      namaPendaftaran: value.namaPendaftaran,
      tanggalTutupPendaftaran: new Date(value.tanggalTutupPendaftaran),
      date: {
        from: new Date(value.tanggalAwalSimpanan),
        to: new Date(value.tanggalAkhirSimpanan),
      },
      jenisPendaftaran: value.jenisPendaftaran,
    },
  });

  const onEdit = (values: z.infer<typeof SettingPendaftaranSchema>) => {
    startTranssition(() => {
      editSettingSimpananBerjangka(value.noPendaftaran, values).then((data) => {
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
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pendaftaran Simpanan</DialogTitle>
          <DialogDescription>
            Buat perubahan pada Pendaftaran Simpanan di sini. Klik simpan
            setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEdit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="namaPendaftaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pendaftaran</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jenisPendaftaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Simpanan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="pilih jenis simpanan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jenisPendaftaran.map((item, index) => (
                          <SelectItem key={index} value={item.value}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rentang Tanggal Simpanan Berjangka</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value.from && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value.from}
                            selected={{
                              from: field.value.from!,
                              to: field.value.to,
                            }}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="tanggalTutupPendaftaran"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Tutup Pendaftaran</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>pilih tanggal</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && "Sedang Proses..."}
                {!isPending && "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DialogDelete({ value }: TDialog) {
  const [isPending, startTranssition] = useTransition();

  const onDetele = (id: number) => {
    console.log(id);

    startTranssition(() => {
      deleteSettingSimpananBerjangka(id).then((data) => {
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
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Pendaftaran Simpanan</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            Klik Hapus untuk melanjutkan atau Batal untuk membatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Nama Pendaftaran: {value.namaPendaftaran}</p>
          <p>jenis pendaftaran: {value.jenisPendaftaran}</p>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Batal
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={() => onDetele(value.noPendaftaran)}
            disabled={isPending}
          >
            {isPending && "Sedang Proses..."}
            {!isPending && "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type TListPendaftaran = {
  value: TPendaftar[];
  namaPendaftaran: string;
};

function ListPendaftaran({ value, namaPendaftaran }: TListPendaftaran) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-full">
          List Pendaftar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full">
        <ScrollArea>
          <TableWrapping
            header={`List Pendaftar ${namaPendaftaran}`}
            description={`Data Pendaftaran anggota untuk ${namaPendaftaran}`}
            searchBy="nama"
            labelSearch="Nama"
            data={value}
            columns={columnListPendaftar}
          >
            <ExportExcell
              data={value}
              columns={columnsExcelPendaftarSimpananBerjangka}
              title={`List Pendaftaran ${namaPendaftaran}`}
              fileName={`List Pendaftaran ${namaPendaftaran}`}
              buttonLabel="Download"
            />
          </TableWrapping>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

const columnDetailSimpananBerjangka: ColumnDef<TDetailSimpananBerjangka>[] = [
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

export const columnSimpananBerjangkaAnggota: ColumnDef<TSimpananBerjangkaValue>[] =
  [
    {
      accessorKey: "noAnggota",
      header: "No Anggota",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("noAnggota")}</div>
      ),
    },
    {
      accessorKey: "nama",
      header: "Nama",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nama")}</div>
      ),
    },
    {
      accessorKey: "unitKerja",
      header: "Unit Kerja",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("unitKerja")}</div>
      ),
    },
    {
      accessorKey: "jenisSimpanan",
      header: "Jenis Simpanan",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("jenisSimpanan")}</Badge>
      ),
    },
    {
      accessorKey: "totalSimpanan",
      enableHiding: false,
      header: "Total Simpanan",
      cell: ({ row }) => {
        const formatted = formatToIDR(row.getValue("totalSimpanan"));
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
                <DetailSimpananBerjangka value={row.original.simpanan} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

interface IDetailSimpananBerjangka {
  value: TDetailSimpananBerjangka[];
}

function DetailSimpananBerjangka({ value }: IDetailSimpananBerjangka) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-full">
          Detail Simpanan
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
            columns={columnDetailSimpananBerjangka}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
