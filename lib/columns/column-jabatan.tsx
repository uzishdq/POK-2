"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { TJabatan } from "@/types/jabatan";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteJabatan, editJabatan } from "../action/jabatan";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { JabatanSchema } from "../schema/jabatan-schema";

export const columnJabatan: ColumnDef<TJabatan>[] = [
  {
    accessorKey: "namaJabatan",
    header: "Nama Jabatan",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaJabatan")}</div>
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
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
  value: TJabatan;
};

function DialogEdit({ value }: TDialog) {
  const [isPending, startTranssition] = useTransition();

  const form = useForm<z.infer<typeof JabatanSchema>>({
    resolver: zodResolver(JabatanSchema),
    defaultValues: {
      namaJabatan: value.namaJabatan,
    },
  });

  const onEdit = (values: z.infer<typeof JabatanSchema>) => {
    startTranssition(() => {
      editJabatan(value.noJabatan, values).then((data) => {
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
                name="namaJabatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Jabatan</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
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

  const onDelete = (id: number) => {
    startTranssition(() => {
      deleteJabatan(id).then((data) => {
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
          <DialogTitle>Hapus Jabatan</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            Klik Hapus untuk melanjutkan atau Batal untuk membatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Nama Jabatan : {value.namaJabatan}</p>
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
            onClick={() => onDelete(value.noJabatan)}
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
