"use client";

import { TUnitKerja } from "@/types/unit-kerja";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { deleteUnitKerja, editUnitKerja } from "../action/unit-kerja";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitKerjaSchema } from "../schema/unit-kerja-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const columnUnitKerja: ColumnDef<TUnitKerja>[] = [
  {
    accessorKey: "namaUnitKerja",
    header: "Nama Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaUnitKerja")}</div>
    ),
  },
  {
    accessorKey: "alamatKantor",
    header: "Alamat Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("alamatKantor")}</div>
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
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
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
  value: TUnitKerja;
};

function DialogEdit({ value }: TDialog) {
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof UnitKerjaSchema>>({
    resolver: zodResolver(UnitKerjaSchema),
    defaultValues: {
      namaUnitKerja: value.namaUnitKerja,
      alamatKantor: value.alamatKantor,
    },
  });

  const onEdit = (values: z.infer<typeof UnitKerjaSchema>) => {
    startTranssition(() => {
      editUnitKerja(value.noUnitKerja, values).then((data) => {
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
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Unit Kerja</DialogTitle>
          <DialogDescription>
            Buat perubahan pada Unit Kerja di sini. Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEdit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="namaUnitKerja"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Unit Kerja</FormLabel>
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
                name="alamatKantor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Unit Kerja</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Silakan isi alamat unit kerja di sini"
                        className="resize-none"
                        {...field}
                      />
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
    startTranssition(() => {
      deleteUnitKerja(id).then((data) => {
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
          <Trash2 className="h-4 w-4 mr-2" />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Unit Kerja</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            Klik Hapus untuk melanjutkan atau Batal untuk membatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Nama Unit Kerja : {value.namaUnitKerja}</p>
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
            onClick={() => onDetele(value.noUnitKerja)}
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
