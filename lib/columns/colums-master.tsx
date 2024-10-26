"use client";

import { TMaster } from "@/types/master";
import { ColumnDef } from "@tanstack/react-table";
import { formatDatebyMonth, formatToIDR } from "../helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { useTransition } from "react";
import { deleteMaster, editMaster } from "../action/master";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DataMasterSchema } from "../schema/data-master-schema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gender, pekerjaan } from "../constan";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "../utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TListAnggota } from "@/types/anggota";
import { Badge } from "@/components/ui/badge";

// kalo edit nik masih harus menerima Expected string, received null

export const columnMaster: ColumnDef<TMaster>[] = [
  {
    accessorKey: "emailMaster",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("emailMaster")}</div>,
  },
  {
    accessorKey: "nipMaster",
    header: "Nip",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nipMaster")}</div>
    ),
  },
  {
    accessorKey: "nikMaster",
    header: "No.KTP",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nikMaster")}</div>
    ),
  },
  {
    accessorKey: "namaMaster",
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaMaster")}</div>
    ),
  },
  {
    accessorKey: "tempatLahirMaster",
    header: "Tempat Lahir",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tempatLahirMaster")}</div>
    ),
  },
  {
    accessorKey: "tanggalLahirMaster",
    header: "Tanggal Lahir",
    cell: ({ row }) => {
      const formattedDate = formatDatebyMonth(
        row.getValue("tanggalLahirMaster"),
      );

      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "jenisKelaminMaster",
    header: "Jenis Kelamin",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("jenisKelaminMaster")}</div>
    ),
  },
  {
    accessorKey: "statusPekerjaanMaster",
    header: "Status Pekerjaan",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("statusPekerjaanMaster")}</div>
    ),
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
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DialogDelete value={dataRows} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TMaster;
};

function DialogEdit({ value }: TDialog) {
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof DataMasterSchema>>({
    resolver: zodResolver(DataMasterSchema),
    defaultValues: {
      namaMaster: value.namaMaster,
      tempatLahirMaster: value.tempatLahirMaster,
      tanggalLahirMaster: new Date(value.tanggalLahirMaster),
      jenisKelaminMaster: value.jenisKelaminMaster,
      nikMaster: value.nikMaster,
      nipMaster: value.nipMaster ? value.nipMaster : "",
      statusPekerjaanMaster: value.statusPekerjaanMaster,
      alamatMaster: value.alamatMaster,
      jabatanMaster: value.jabatanMaster,
      unitKerjaMaster: value.unitKerjaMaster,
    },
  });

  const onEdit = (values: z.infer<typeof DataMasterSchema>) => {
    startTranssition(() => {
      editMaster(value.idMaster, values).then((data) => {
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
      <DialogContent className="h-5/6 overflow-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Data Master</DialogTitle>
          <DialogDescription>
            Buat perubahan pada Data Master di sini. Klik simpan setelah
            selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEdit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nipMaster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIP {"(Nomor Induk Pegawai)"}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nikMaster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No.KTP</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="namaMaster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
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
                name="tempatLahirMaster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
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
                name="tanggalLahirMaster"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Lahir</FormLabel>
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
                                <span>Masukkan Tanggal Lahir</span>
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
                              date > new Date() || date < new Date("1900-01-01")
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jenisKelaminMaster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gender.map((item, index) => (
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="alamatMaster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Silakan isi alamat di sini"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="statusPekerjaanMaster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Pekerjaan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status Pekerjaan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pekerjaan.map((item, index) => (
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
            {/* <div className="space-y-4">
            <FormField
              control={form.control}
              name="jabatanMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jabatan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jabatan
                        ? jabatan.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.noJabatan.toString()}
                            >
                              {item.namaJabatan}
                            </SelectItem>
                          ))
                        : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="unitKerjaMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Kerja</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Unit Kerja" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitKerja
                        ? unitKerja.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item.noUnitKerja.toString()}
                            >
                              {item.namaUnitKerja}
                            </SelectItem>
                          ))
                        : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Kembali
                </Button>
              </DialogClose>
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

  const onDelete = (id: number) => {
    startTranssition(() => {
      deleteMaster(value.idMaster).then((data) => {
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
          <DialogTitle>Hapus Data Master</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            Klik Hapus untuk melanjutkan atau Batal untuk membatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Nama : {value.namaMaster}</p>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Kembali
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={() => onDelete(value.idMaster)}
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

export const columnAnggota: ColumnDef<TListAnggota>[] = [
  {
    accessorKey: "noAnggota",
    header: "No Anggota",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noAnggota")}</div>
    ),
  },
  {
    accessorKey: "nama",
    header: "nama",
    cell: ({ row }) => <div className="capitalize">{row.getValue("nama")}</div>,
  },
  {
    accessorFn: (row) => row.unitKerja.namaUnitKerja,
    id: "namaUnitKerja",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.unitKerja.namaUnitKerja}</div>
    ),
  },
  {
    accessorFn: (row) => row.jabatan.namaJabatan,
    id: "namaJabatan",
    header: "Jabatan",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.jabatan.namaJabatan}</div>
    ),
  },
  {
    accessorKey: "pilManasuka",
    header: "Pilihan Manasuka",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("pilManasuka"))}
      </div>
    ),
  },
  {
    accessorKey: "statusAnggota",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("statusAnggota")}</Badge>
    ),
  },
];
