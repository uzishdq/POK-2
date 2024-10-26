import FromStatus from "@/components/auth/form-status";
import FormPengajuanPinjaman from "@/components/pinjaman/form-pengajuan-pinjaman";
import { getTanggalLahirById } from "@/lib/data/anggota";
import { getMaxPinjamanById } from "@/lib/data/pinjaman";
import { getMaxBesaranPinjamanById } from "@/lib/data/simpanan";
import { getSesi } from "@/lib/session";
import React from "react";

//pinjaman 50% bisa pinjam lagi dengan syarat melunaskan pinjaman sebelumnya

export default async function PengajuanPinjaman() {
  const session = await getSesi();

  if (session?.user && session.user.id) {
    const [maxSimpanan, tanggalLahir, maxPinjamanJasa, maxPinjamanBarang] =
      await Promise.all([
        getMaxBesaranPinjamanById(session.user.id),
        getTanggalLahirById(session.user.id),
        getMaxPinjamanById(session.user.id, "JASA"),
        getMaxPinjamanById(session.user.id, "BARANG"),
      ]);

    if (
      maxSimpanan === null ||
      tanggalLahir === null ||
      !maxPinjamanJasa.ok ||
      !maxPinjamanBarang.ok
    ) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Pengajuan Pinjaman</div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pengajuan Pinjaman</div>
        <FormPengajuanPinjaman
          maxSimpanan={maxSimpanan}
          id={session.user.id}
          tanggalLahir={tanggalLahir.tanggalLahir}
          pinjamanJasa={maxPinjamanJasa.value}
          pinjamanBarang={maxPinjamanBarang.value}
        />
      </div>
    );
  }
}
