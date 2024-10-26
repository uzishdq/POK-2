import FromStatus from "@/components/auth/form-status";
import CardPendaftaran from "@/components/pendaftaran-simpanan/card-pendaftaran";
import { Button } from "@/components/ui/button";
import { getPendaftaranSimpanan } from "@/lib/data/simpanan";
import { getSesi } from "@/lib/session";
import React from "react";

export default async function PendaftaranSimpananBerjangka() {
  const [daftarLebaran, daftarQurban, daftarUbar, session] = await Promise.all([
    getPendaftaranSimpanan("simpanan-lebaran"),
    getPendaftaranSimpanan("simpanan-qurban"),
    getPendaftaranSimpanan("simpanan-ubar"),
    getSesi(),
  ]);

  if (session?.user && session.user.id) {
    if (!daftarLebaran.ok || !daftarQurban.ok || !daftarUbar.ok) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">
            Pendaftaran Simpanan Berjangka
          </div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">
          Pendaftaran Simpanan Berjangka
        </div>

        {!daftarLebaran.value && !daftarQurban.value && !daftarUbar.value && (
          <FromStatus
            status={true}
            message="Mohon maaf, saat ini pendaftaran untuk simpanan berjangka belum tersedia. Kami akan segera menginformasikan jika pendaftaran ini sudah dapat diakses"
          />
        )}

        {daftarLebaran.ok && daftarLebaran.value && (
          <CardPendaftaran
            title="Pendaftaran Simpanan Lebaran"
            descriptions="Menyambut Lebaran dengan Tabungan Berkah"
            type="lebaran"
            data={daftarLebaran.value}
            id={session.user.id}
          />
        )}

        {daftarQurban.ok && daftarQurban.value && (
          <CardPendaftaran
            title="Pendaftaran Simpanan Qurban"
            descriptions="Qurban Lebih Mudah dengan Tabungan Khusus"
            type="qurban"
            data={daftarQurban.value}
            id={session.user.id}
          />
        )}

        {daftarUbar.ok && daftarUbar.value && (
          <CardPendaftaran
            title="Pendaftaran Simpanan Ubar"
            descriptions="Liburan Lebih Seru, Hemat, dan Terencana!"
            type="ulin bareng"
            data={daftarUbar.value}
            id={session.user.id}
          />
        )}
      </div>
    );
  }
}
