"use client";
import CobaKirimWa from "@/components/coba/coba-kirim-wa";

export default async function CobaWa() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="items-center justify-center">
        <CobaKirimWa />
      </div>
    </div>
  );
}
