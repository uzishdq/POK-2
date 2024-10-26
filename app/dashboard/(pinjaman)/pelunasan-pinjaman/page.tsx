import FromStatus from "@/components/auth/form-status";
import FormCekPelunasan from "@/components/pelunasan-pinjaman/form-cek-pelunasan";
import { getMaxPinjaman } from "@/lib/data/pinjaman";
import { getSesi } from "@/lib/session";
import React from "react";

export default async function PelunasanPinjaman() {
  const session = await getSesi();
  if (session?.user && session.user.id) {
    const pelunasan = await getMaxPinjaman(session.user.id);

    if (!pelunasan.ok) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Pelunasan Pinjaman</div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pelunasan Pinjaman</div>
        {pelunasan && pelunasan.value && (
          <FormCekPelunasan noPinjaman={pelunasan.value} />
        )}
      </div>
    );
  }
}
