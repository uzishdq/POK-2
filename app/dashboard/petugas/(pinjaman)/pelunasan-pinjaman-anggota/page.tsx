import FromStatus from "@/components/auth/form-status";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import { columsPelunasanPinjaman } from "@/lib/columns/column-pelunasan-pinjaman";
import { getListPelunasanPinjaman } from "@/lib/data/pelunasan-pinjaman";
import { TListPelunasanPinjaman } from "@/types/pinjaman";
import React from "react";

export default async function PelunasanPinjamanAnggota() {
  const data = await getListPelunasanPinjaman();
  if (!data.ok) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pelunasan Pinjaman Anggota</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }
  const { approved, pending, rejected } =
    data.value?.reduce(
      (acc, item) => {
        if (item.statusPelunasanPinjaman === "APPROVED") {
          acc.approved.push(item);
        } else if (item.statusPelunasanPinjaman === "PENDING") {
          acc.pending.push(item);
        } else if (item.statusPelunasanPinjaman === "REJECTED") {
          acc.rejected.push(item);
        }
        return acc;
      },
      {
        approved: [] as TListPelunasanPinjaman[],
        pending: [] as TListPelunasanPinjaman[],
        rejected: [] as TListPelunasanPinjaman[],
      },
    ) || {};
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Pelunasan Pinjaman Anggota</div>
      {pending && (
        <TableWrappingDate
          header="Pengajuan Pelunasan Pinjaman Anggota"
          description="Data anggota yang telah mengajukan pelunasan pinjaman"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPelunasanPinjaman"
          data={pending}
          columns={columsPelunasanPinjaman}
        />
      )}
      {rejected && (
        <TableWrappingDate
          header="Pelunasan Pinjaman Anggota Gagal"
          description="Data pelunasan pinjaman yang tidak disetujui"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPelunasanPinjaman"
          data={rejected}
          columns={columsPelunasanPinjaman}
        />
      )}
      {approved && (
        <TableWrappingDate
          header="Riwayat Pelunasan Pinjaman Anggota"
          description="Data pelunasan pinjaman yang telah disetujui"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPelunasanPinjaman"
          data={approved}
          columns={columsPelunasanPinjaman}
        />
      )}
    </div>
  );
}
