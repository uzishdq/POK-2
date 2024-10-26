import FromStatus from "@/components/auth/form-status";
import { getSession } from "@/components/navigation/top-nav";
import FormCekUndurDiri from "@/components/undur-diri/form-cek-undur-diri";
import React from "react";

export default async function UndurDiri() {
  const session = await getSession();

  if (session?.user && session.user.id && session.user.sub) {
    const { id, sub } = session.user;
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pengunduran Diri</div>
        <FormCekUndurDiri anggotaId={id} noUser={sub} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-xl font-medium">Pengunduran Diri</div>
        <FromStatus
          status={false}
          message="Mohon diperhatikan bahwa koneksi kami sedang terganggu. Kami meminta maaf atas ketidaknyamanan yang ditimbulkan dan berusaha memperbaikinya secepat mungkin."
        />
      </div>
    );
  }
}
