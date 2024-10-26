"use client";

import { TPotongGaji, TPotonganApproved } from "@/types/potongan";
import { ColumnDef } from "@tanstack/react-table";
import { formatDatebyMonth, formatToIDR } from "../helper";

export const columnPotonganGaji: ColumnDef<TPotongGaji>[] = [
  {
    accessorKey: "anggotaId",
    enableHiding: false,
    header: "No Anggota",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("anggotaId")}</div>
    ),
  },
  {
    accessorKey: "nama",
    enableHiding: false,
    header: "Nama",
    cell: ({ row }) => <div className="capitalize">{row.getValue("nama")}</div>,
  },
  {
    accessorKey: "unitGarapan",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("unitGarapan")}</div>
    ),
  },
  {
    accessorKey: "simpananWajib",
    enableHiding: false,
    header: "Simpanan Wajib",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananWajib"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananManasuka",
    enableHiding: false,
    header: "Simpanan Sukamana",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananManasuka"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananLebaran",
    enableHiding: false,
    header: "Simpanan Lebaran",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananLebaran"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananQurban",
    enableHiding: false,
    header: "Simpanan Qurban",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananQurban"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananUbar",
    enableHiding: false,
    header: "Simpanan Ubar",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananUbar"))}
      </div>
    ),
  },
  {
    accessorKey: "noPinjamanJasa",
    enableHiding: false,
    header: "No Pinjaman Produktif",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjamanJasa")}</div>
    ),
  },
  {
    accessorKey: "AngsuranKeJasa",
    enableHiding: false,
    header: "Angsuran Produktif Ke",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("AngsuranKeJasa")}</div>
    ),
  },
  {
    accessorKey: "AngsuranDariJasa",
    enableHiding: false,
    header: "Angsuran Produktif Dari",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("AngsuranDariJasa")}</div>
    ),
  },
  {
    accessorKey: "jumlahAngsuranJasa",
    enableHiding: false,
    header: "Angsuran Produktif",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("jumlahAngsuranJasa"))}
      </div>
    ),
  },
  {
    accessorKey: "noPinjamanBarang",
    enableHiding: false,
    header: "No Pinjaman Barang",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("noPinjamanBarang")}</div>
    ),
  },
  {
    accessorKey: "AngsuranKeBarang",
    enableHiding: false,
    header: "Angsuran Barang Ke",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("AngsuranKeBarang")}</div>
    ),
  },
  {
    accessorKey: "AngsuranDariBarang",
    enableHiding: false,
    header: "Angsuran Barang Dari",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("AngsuranDariBarang")}</div>
    ),
  },
  {
    accessorKey: "jumlahAngsuranBarang",
    enableHiding: false,
    header: "Angsuran Barang",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("jumlahAngsuranBarang"))}
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-right font-semibold">
        {formatToIDR(row.getValue("total"))}
      </div>
    ),
  },
];

export const columnPotonganGajiApproved: ColumnDef<TPotonganApproved>[] = [
  {
    accessorKey: "idPotonganGaji",
    enableHiding: false,
    header: "No",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idPotonganGaji")}</div>
    ),
  },
  {
    accessorKey: "namaPotongGaji",
    enableHiding: false,
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("namaPotongGaji")}</div>
    ),
  },
  {
    accessorKey: "unitGarapanPotongGaji",
    header: "Unit Kerja",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("unitGarapanPotongGaji")}</div>
    ),
  },
  {
    accessorKey: "tanggalPotonganGaji",
    enableHiding: false,
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDatebyMonth(row.getValue("tanggalPotonganGaji"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananWajibPotongGaji",
    enableHiding: false,
    header: "Simpanan Wajib",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananWajibPotongGaji"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananManasukaPotongGaji",
    enableHiding: false,
    header: "Simpanan Sukamana",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananManasukaPotongGaji"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananLebaranPotongGaji",
    enableHiding: false,
    header: "Simpanan Lebaran",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananLebaranPotongGaji"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananQurbanPotongGaji",
    enableHiding: false,
    header: "Simpanan Qurban",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananQurbanPotongGaji"))}
      </div>
    ),
  },
  {
    accessorKey: "simpananUbarPotongGaji",
    enableHiding: false,
    header: "Simpanan Ubar",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("simpananUbarPotongGaji"))}
      </div>
    ),
  },
  {
    accessorKey: "noPinjamanJasaPotongGaji",
    enableHiding: false,
    header: "Pinjaman Produktif",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("noPinjamanJasaPotongGaji")}
      </div>
    ),
  },
  {
    accessorKey: "AngsuranKeJasaPotongGaji",
    enableHiding: false,
    header: "Angsuran Produktif Ke - Dari",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.AngsuranKeJasaPotongGaji} -{" "}
        {row.original.AngsuranDariJasaPotongGaji}
      </div>
    ),
  },
  {
    accessorKey: "jumlahAngsuranJasaPotongGaji",
    enableHiding: false,
    header: "Angsuran Produktif",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("jumlahAngsuranJasaPotongGaji"))}
      </div>
    ),
  },
  {
    accessorKey: "noPinjamanBarangPotongGaji",
    enableHiding: false,
    header: "Pinjaman Barang",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("noPinjamanBarangPotongGaji")}
      </div>
    ),
  },
  {
    accessorKey: "AngsuranKeBarangPotongGaji",
    enableHiding: false,
    header: "Angsuran barang Ke - Dari",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.AngsuranKeBarangPotongGaji} -{" "}
        {row.original.AngsuranDariBarangPotongGaji}
      </div>
    ),
  },
  {
    accessorKey: "jumlahAngsuranBarangPotongGaji",
    enableHiding: false,
    header: "Angsuran Barang",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("jumlahAngsuranBarangPotongGaji"))}
      </div>
    ),
  },
  {
    accessorKey: "totalPotongGaji",
    enableHiding: false,
    header: "Total",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatToIDR(row.getValue("totalPotongGaji"))}
      </div>
    ),
  },
];
