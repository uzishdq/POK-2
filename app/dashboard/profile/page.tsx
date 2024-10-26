import FromStatus from "@/components/auth/form-status";
import { getSession } from "@/components/navigation/top-nav";
import FormProfile from "@/components/profile/form-profile";
import { authOptions } from "@/lib/auth";
import { getProfile } from "@/lib/data/anggota";
import { getJabatan } from "@/lib/data/jabatan";
import { getUnitKerja } from "@/lib/data/unit-kerja";
import { getServerSession } from "next-auth";
import React from "react";

export default async function Profile() {
  const session = await getSession();

  if (session?.user && session.user.id) {
    const dataAnggota = await getProfile(session?.user.id);
    const dataJabatan = await getJabatan();
    const dataUnitKerja = await getUnitKerja();

    const [anggota, jabatan, unitKerja] = await Promise.all([
      dataAnggota,
      dataJabatan,
      dataUnitKerja,
    ]);

    if (!anggota || (!jabatan && !unitKerja)) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Profile</div>
          <FromStatus
            status={false}
            message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
          />
        </div>
      );
    }

    if (anggota) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-xl font-medium">Profile</div>
          <FormProfile data={anggota} jabatan={jabatan} unitKerja={unitKerja} />
        </div>
      );
    }
  }
}
