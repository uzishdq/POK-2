import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import React from "react";
import StrukHeader from "../struk/struk-header";
import { TSuratPengunduran } from "@/types/struk";

interface IPernyataanPengunduran {
  data: TSuratPengunduran;
}
export default function PernyataanPengunduran({
  data,
}: IPernyataanPengunduran) {
  const strukData = [
    {
      field: "No. Identitas (NO.KTP)",
      value: data.anggota.nik,
    },
    {
      field: "Nama",
      value: data.anggota.nama,
    },
    {
      field: "Tempat & Tanggal lahir",
      value: `${data.anggota.tempatLahir} - ${formatDatebyMonth(data.anggota.tanggalLahir)}`,
    },
    {
      field: "Unit Garapan",
      value: data.anggota.unitKerja.namaUnitKerja,
    },
    {
      field: "Status Pegawai",
      value: data.anggota.statusPekerjaan,
    },
  ];
  const hakKewajiban = [
    {
      field: "Wajib",
      value: formatToIDR(data.simpananWajibPengunduranDiri),
    },
    {
      field: "Sukamana",
      value: formatToIDR(data.simpananManasukaPengunduranDiri),
    },
    {
      field: "Qurban",
      value: formatToIDR(data.simpananQurbanPengunduranDiri),
    },
    {
      field: "Ubar",
      value: formatToIDR(data.simpananUbarPengunduranDiri),
    },
    {
      field: "Administrasi",
      value: formatToIDR(data.biayaPengunduranDiri),
    },
    {
      field: "Total Keseluruhan",
      value: formatToIDR(data.totalDiterimaPengunduranDiri),
    },
  ];
  const bankData = [
    {
      field: "Bank",
      value: data.anggota.namaBank,
    },
    {
      field: "No.Rekening",
      value: data.anggota.noRek,
    },
    {
      field: "Atas nama",
      value: data.anggota.nama,
    },
  ];

  const chunkedData = [];
  for (let i = 0; i < hakKewajiban.length; i += 3) {
    chunkedData.push(hakKewajiban.slice(i, i + 3));
  }
  return (
    <div className="mt-3 grid w-full place-items-center bg-white font-serif">
      <div className="flex w-[794px] flex-col gap-1 p-2 text-justify text-sm">
        <StrukHeader />
        <div className="flex w-full flex-col gap-[2px]">
          <div className="h-1 w-full bg-green-600" />
          <div className="h-2 w-full bg-green-800" />
        </div>

        <div className="mb-1 flex w-full flex-col items-center justify-center gap-1 text-base font-bold">
          <p>SURAT PERNYATAAN</p>
        </div>

        <p className="mx-4 my-1">Saya yang bertanda tangan di bawah ini :</p>

        <table className="my-1 w-[85%] self-center">
          <tbody>
            {strukData.map((data, index) => (
              <tr key={index}>
                <td className="p-1">{data.field}</td>
                <td className="p-1">:</td>
                <td className="p-1">{data.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mx-4 my-1">
          Dengan ini saya menyatakan mengundurkan diri sebagai anggota Koperasi
          Karyawan Yayasan Al-Ghifari, terhitung sejak{" "}
          <b>{formatDatebyMonth(data.tanggalPengunduran)}</b>
        </p>
        <p className="ml-8">Dikarenakan : {data.keterangan}</p>
        <p className="mx-4 my-1">
          Mohon kiranya apa yang menjadi hak-hak keanggotaan saya, baik berupa
          simpanan pokok, simpanan wajib, simpanan manasuka, dan atau simpanan
          lainnya, setelah dikurangi administrasi penutupan tabungan dan
          kewajiban (apabila masih ada kewajiban), dibayarkan secara{" "}
          {data.jenisUndurDiri.toLocaleLowerCase()} :
        </p>
        <table className="my-1 w-[85%] self-center">
          <tbody>
            {bankData.map((data, index) => (
              <tr key={index}>
                <td className="p-1">{data.field}</td>
                <td className="p-1">:</td>
                <td className="p-1">{data.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mx-4 my-1">
          Hak simpanan yang akan dikembalikan setelah pengunduran diri adalah
          sebagai berikut:
        </p>
        <table className="my-1 w-[85%] self-center">
          <tbody>
            {chunkedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((item, colIndex) => (
                  <React.Fragment key={colIndex}>
                    <td className="p-1">{item.field}</td>
                    <td className="p-1">:</td>
                    <td className="p-1">{item.value}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mx-4 my-1">
          Demikian surat pernyataan ini saya sampaikan dengan sebenarnya,tanpa
          ada paksaan dan desakan dari pihak manapun. Jika ada tutur kata atau
          tingkah kurang berkenan selama jadi anggota, mohon dimaafkan. Atas
          perhatian dan kerjasamanya saya ucapkan terimakasih.
        </p>

        <p className="my-4 mr-4 text-end">
          Bandung, {formatDatebyMonth(new Date())}
        </p>

        <div className="grid w-full grid-cols-2 gap-5 self-center p-4 text-center">
          <div className="flex flex-col gap-1">
            <p>Menyetujui</p>
          </div>

          <div className="flex flex-col gap-1">
            <p>Hormat Saya</p>
          </div>

          <div className="h-5 w-auto" />
          <div className="h-5 w-auto" />

          <p className="font-bold">Pengurus Koperasi</p>
          <p className="font-bold">{data.anggota.nama}</p>
        </div>
      </div>
    </div>
  );
}
