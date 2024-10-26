import FromStatus from "@/components/auth/form-status";
import TableWrappingDate from "@/components/table/table-wrapping-date";
import { columnPengunduranAnggota } from "@/lib/columns/column-undur-diri";
import { getListUndurDiri } from "@/lib/data/undur-diri";
import { TListUndurDiri } from "@/types/undur-diri";
import React from "react";

export default async function PengunduranAnggota() {
  const data = await getListUndurDiri();
  if (!data.ok) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pengunduran Anggota</div>
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
        if (item.statusPengunduranDiri === "APPROVED") {
          acc.approved.push(item);
        } else if (item.statusPengunduranDiri === "PENDING") {
          acc.pending.push(item);
        } else if (item.statusPengunduranDiri === "REJECTED ") {
          acc.rejected.push(item);
        }
        return acc;
      },
      {
        approved: [] as TListUndurDiri[],
        pending: [] as TListUndurDiri[],
        rejected: [] as TListUndurDiri[],
      },
    ) || {};

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="text-xl font-medium">Pengunduran Anggota</div>
      {pending && (
        <TableWrappingDate
          header="Pengajuan Pengunduran Anggota"
          description="Data anggota yang telah mengajukan Pengunduran"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPengunduran"
          data={pending}
          columns={columnPengunduranAnggota}
        />
      )}
      {rejected && (
        <TableWrappingDate
          header="Pengunduran Anggota Gagal"
          description="Data Pengunduran yang tidak disetujui"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPengunduran"
          data={rejected}
          columns={columnPengunduranAnggota}
        />
      )}
      {approved && (
        <TableWrappingDate
          header="Riwayat Pengunduran Anggota"
          description="Data Pengunduran yang telah disetujui"
          searchBy="nama"
          labelSearch="nama"
          input={true}
          filterDate="tanggalPengunduran"
          data={approved}
          columns={columnPengunduranAnggota}
        />
      )}
    </div>
  );
}
