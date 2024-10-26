import React from "react";
import StrukHeader from "../struk-header";
import { formatDatebyMonth, formatToIDR, toTerbilang } from "@/lib/helper";
import { TStrukPengambilanSimpanan } from "@/types/struk";

interface IBuktiPengambilanSpanan {
  data: TStrukPengambilanSimpanan;
}

export default function BuktiPengambilanSpanan({
  data,
}: IBuktiPengambilanSpanan) {
  const strukData = [
    {
      field: "Dibayarkan Kepada",
      value: data.anggota.nama,
    },
    {
      field: "Unit Kerja",
      value: data.anggota.unitKerja.namaUnitKerja,
    },
    {
      field: "Jenis Simpanan",
      value: data.jenisPengambilanSimpanan,
    },
    {
      field: "Jumlah",
      value: formatToIDR(data.jumlahPengambilanSimpanan),
    },
    {
      field: "Terbilang",
      value: toTerbilang(data.jumlahPengambilanSimpanan),
    },
    {
      field: "Keterangan",
      value:
        "............................................................................................................................",
    },
  ];
  return (
    <div className="grid w-full place-items-center bg-white font-serif">
      <div className="flex w-[794px] flex-col gap-1 p-2 text-sm">
        <StrukHeader />
        <div className=" flex w-full flex-col gap-[2px]">
          <div className=" h-1 w-full bg-green-600" />
          <div className=" h-2 w-full bg-green-800" />
        </div>

        <p className="text-end">No: {data.noPengambilanSimpanan}</p>
        <p className="text-end">
          Tanggal: {formatDatebyMonth(data.tanggalPengambilanSimpanan)}
        </p>

        <div className="my-5 flex w-full flex-col items-center justify-center gap-1 text-base font-bold ">
          <p>BUKTI PEMBAYARAN KAS/BANK</p>
        </div>

        <table className="mb-5 w-[85%] self-center">
          <tbody>
            {strukData.map((item, index) => (
              <tr key={index}>
                <td className="p-1">{index + 1}.</td>
                <td className="p-1">{item.field}</td>
                <td className="p-1">:</td>
                <td className="p-1">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-10 w-[85%] self-center ">
          <table className="border-collapse border border-black">
            <thead>
              <tr>
                <th className="h-10 w-52 border border-slate-600">Disetujui</th>
                <th className="h-10 w-52 border border-slate-600">Diperiksa</th>
                <th className="h-10 w-52 border border-slate-600">Dibukukan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black">
                  <br />
                  <br />
                  <br />
                </td>
                <td className="border border-black">
                  <br />
                  <br />
                  <br />
                </td>
                <td className="border border-black">
                  <br />
                  <br />
                  <br />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex w-[85%] flex-col items-end justify-end gap-2">
          <p>Bandung, {formatDatebyMonth(new Date())}</p>
          <p>Yang Menerima,</p>
          <br />
          <br />
          <p className="font-bold">{data.anggota.nama}</p>
          <br />
        </div>
      </div>
    </div>
  );
}
