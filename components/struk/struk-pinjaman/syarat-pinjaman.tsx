import { formatDatebyMonth } from "@/lib/helper";
import React from "react";
import StrukHeader from "../struk-header";

export default function SyaratPinjaman() {
  return (
    <div className="grid w-full place-items-center bg-white font-serif">
      <div className="flex w-[794px] flex-col gap-1 p-2 text-sm">
        <StrukHeader />
        <div className=" flex w-full flex-col gap-[2px]">
          <div className=" h-1 w-full bg-green-600" />
          <div className=" h-2 w-full bg-green-800" />
        </div>

        <div className="my-5 flex w-full flex-col items-center justify-center gap-1 text-base font-bold ">
          <p>PERSYARATAN PINJAMAN KOPERASI KARYAWAN</p>
          <p>YAYASAN AL-GHIFARI</p>
        </div>

        <div className="mb-20 w-[85%] self-center ">
          <ol className="list-decimal space-y-5 pl-4">
            <li className="mb-2">Surat Permohonan Pinjaman Koperasi</li>
            <li className="mb-2">Fotocopy KTP rangkap 2 {"(dua)"}</li>
            <li className="mb-2">
              Surat Pernyataan dari Pemohon Pinjaman rangkap 2
              {" asli bermaterai + fotocopy"}
            </li>
            <li className="mb-2">Struk Gaji terakhir </li>
            <li className="mb-2">
              Besaran pinjaman yang dapat disetujui berdasarkan kemampuan
              angsuran masing-masing anggota perbulan dan ketentuan batasan
              minimum “Take Home Pay”{" (THP)"} 30% dari Gaji Bersih.
            </li>
            <li className="mb-2">
              Biaya yang dikenakan sekali pada saat penarikan:
              <ol className="list-lower-alpha pl-4">
                <li className="mb-1">
                  Biaya administrasi sebesar 1,0 % dari jumlah pinjaman.
                </li>
                <li className="mb-1">
                  Biaya premi asuransi jiwa, dihitung berdasarkan usia dan
                  jangka waktu pinjaman.
                </li>
              </ol>
            </li>
          </ol>
        </div>

        <div className="mb-52 flex w-[85%] flex-col items-end justify-end gap-2">
          <p>Bandung, {formatDatebyMonth(new Date())}</p>
          <p>Pengurus KKGM</p>
          <br />
          <br />
          <p className="font-bold">Neneng Eva Farida, S.pd</p>
          <br />
        </div>
      </div>
    </div>
  );
}
