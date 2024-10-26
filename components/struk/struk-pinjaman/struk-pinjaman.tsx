import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import { TStrukPinjaman } from "@/types/struk";
import React from "react";
import StrukHeader from "../struk-header";

interface IStrukPinjaman {
  data: TStrukPinjaman;
}

export default function StrukPinjaman({ data }: IStrukPinjaman) {
  const strukData = [
    {
      field: "Nama Pemohon",
      value: data.anggota.nama,
    },
    {
      field: "Jabatan",
      value: data.anggota.jabatan.namaJabatan,
    },
    {
      field: "Unit Kerja/Lembaga",
      value: data.anggota.unitKerja.namaUnitKerja,
    },
    {
      field: "Alamat Rumah",
      value: data.anggota.alamat,
    },
    {
      field: "Alamat Kantor",
      value: data.anggota.unitKerja.alamatKantor,
    },
    {
      field: "No. Telepon/HP",
      value: data.anggota.noTelp,
    },
    {
      field: "Penghasilan/Bulan",
      value: formatToIDR(data.jumlahPenghasilan),
    },
    {
      field: "Pinjaman Yang Diajukan",
      value: formatToIDR(data.ajuanPinjaman),
    },
    {
      field: "Tujuan Pinjaman",
      value: data.tujuanPinjaman,
    },
    {
      field: "Cara Pengembalian",
      value: `Diangsur sebanyak ${data.waktuPengembalian} bulan kali dipotong dari gaji tiap-tiap bulan`,
    },
  ];

  const dataPeryataan = [
    {
      field: "NIK",
      value: data.anggota.nik,
    },
    {
      field: "Nama",
      value: data.anggota.nama,
    },
    {
      field: "Unit Kerja / Lembaga",
      value: data.anggota.unitKerja.namaUnitKerja,
    },
  ];
  return (
    <>
      <div className="mt-3 grid w-full place-items-center bg-white font-serif">
        <div className="flex w-[794px] flex-col gap-1 p-2 text-sm">
          <StrukHeader />
          <div className="flex w-full flex-col gap-[2px]">
            <div className="h-1 w-full bg-green-600" />
            <div className="h-2 w-full bg-green-800" />
          </div>

          <p className="text-end">No: {data.noPinjaman}</p>

          <div className="mb-2 flex w-full flex-col items-center justify-center gap-1 text-base font-bold">
            <p>SURAT PERMOHONAN PINJAMAN KOPERASI</p>
            <p>KARYAWAN - YAYASAN AL-GHIFARI</p>
          </div>

          <table className="w-[85%] self-center">
            <tbody>
              {strukData.map((data, index) => (
                <tr key={index}>
                  <td className="p-1">{index + 1}.</td>
                  <td className="p-1">{data.field}</td>
                  <td className="p-1">:</td>
                  <td className="p-1">{data.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid w-full grid-cols-3 gap-5 self-center p-4 text-center">
            <div className="flex flex-col gap-1">
              <p>Menyetujui,</p>
              <p>Ketua Koperasi</p>
            </div>

            <div className="flex flex-col gap-1">
              <p>Mengetahui,</p>
              <p>Bendahara Koperasi</p>
            </div>

            <div className="flex flex-col gap-1">
              <p>
                Bandung, {formatDatebyMonth(new Date(data.tanggalPinjaman))}
              </p>
              <p>Pemohon,</p>
            </div>

            <div className="h-3 w-auto" />
            <div className="h-3 w-auto" />
            <div className="h-3 w-auto" />

            <p className="font-bold">Neneng Eva Farida, S.Pd</p>
            <p className="font-bold">Lia Ekawati, SE.</p>
            <p className="font-bold">{data.anggota.nama}</p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="grid w-full grid-cols-3 px-8">
              <div className="col-span-2 flex flex-col justify-center gap-2 border border-r-0 border-black p-2">
                <b>NOTA PERSETUJUAN</b>
                <p>
                  Atas pengajuan pinjaman tersebut, disetujui pinjaman sebesar:{" "}
                  {formatToIDR(data.ajuanPinjaman)}
                </p>
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center gap-2 border border-black p-2">
                <p>{formatToIDR(data.ajuanPinjaman)}</p>
              </div>
            </div>

            <div className="m-2 h-1 w-full border-2 border-dashed border-black" />
          </div>

          <p className="text-center text-base font-bold">
            TANDA PENERIMAAN PINJAMAN
          </p>

          <div className="flex flex-col gap-2">
            <p>
              Telah diterima pinjaman dari Koperasi KKGM - Yayasan Al-Ghifari :
            </p>
            <p>Sejumlah: {formatToIDR(data.ajuanPinjaman)}</p>
          </div>

          <div className="flex w-full flex-col items-end justify-end gap-2">
            <p>Bandung, {formatDatebyMonth(new Date(data.tanggalPinjaman))}</p>
            <p>{"Peminjam / Penerima,"}</p>
            <br />
            <p>{data.anggota.nama}</p>
            <br />
          </div>
        </div>
      </div>
      <div className="mt-3 grid w-full place-items-center bg-white font-serif">
        <div className=" flex w-[794px] flex-col gap-1 p-2 text-sm">
          <div className="my-5 flex w-full flex-col items-center justify-center gap-1 text-base font-bold ">
            <p>SURAT PERNYATAAN DAN KUASA</p>
          </div>
          <div className="w-[85%] self-center text-justify">
            <p>
              Sehubung dengan Perhomonan Pinjaman Koperasi yang saya ajukan ke
              Koperasi Karyawan Yayasan Al Ghifari pada tanggal,{" "}
              {formatDatebyMonth(new Date(data.tanggalPinjaman))}
            </p>
            <p>
              sejumlah:{formatToIDR(data.ajuanPinjaman)}
              {
                " (........................................................................)"
              }
            </p>
            <p>
              dengan jangka waktu : {data.waktuPengembalian} bulan
              {
                " (........................................................................)"
              }
            </p>
            <p className="my-3">Saya yang bertanda tangan dibawah ini :</p>
            <table>
              <tbody>
                {dataPeryataan.map((data, index) => (
                  <tr key={index}>
                    <td className="p-1">{data.field}</td>
                    <td className="p-1">:</td>
                    <td className="p-1">{data.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="my-3 text-center">
              <h2 className="text-md mb-4 font-bold">MENYATAKAN</h2>
              <ol className="list-decimal pl-4 text-justify">
                <li className="mb-2">
                  Bersedia untuk dipotong gaji atau penghasilan lainnya yang
                  menjadi hak saya antara lain berupa tunjangan, bonus, benefit,
                  uang penghargaan dan atau penghasilan lainnya yang diperoleh
                  untuk disetorkan ke Koperasi Karyawan Yayasan Al Ghifari.
                </li>
                <li className="mb-2">
                  Apabila terjadi wanprestasi dan atau pemutusan hubungan kerja
                  atau Pensiun Dini dan atau sebab lainnya, maka saya bersedia
                  dipotong hak-hak saya sebagai Karyawan Yayasan Al-Ghifari dan
                  atau lembaga yang berada dibawahnya yang akan diterima dari
                  yayasan untuk dibayarkan terlebih dahulu kepada Koperasi
                  Karyawan Yayasan Al Ghifari sebesar kewajiban yang belum
                  terselesaikan.
                </li>
                <li className="mb-2">
                  Bahwa hasil pinjaman tersebut, akan saya pergunakan untuk
                  keperluan :{" "}
                  <span className="underline">{data.tujuanPinjaman}</span>. Dan
                  saya memberi
                  <b> Kuasa/Wewenang</b> kepada Bendahara Yayasan/Unit
                  Kerja/Lembaga di Yayasan Al-Ghifari untuk melakukan pelunasan
                  pinjaman tersebut {"(kompensasi)"} dengan cara memotong dari
                  jumlan pinjaman yang saya terima
                </li>
                <li className="mb-2">
                  Bahwa dalam melakukan pembayaran cicilan pinjaman pokok
                  berikut biaya administrasi, jasa, atau bunga pinjaman yang
                  saya terima tersebut, saya memberikan <b>Kuasa/wewenang</b>{" "}
                  kepada Bendahara Unit Kerja/Lembaga di Yayasan Al Ghifari
                  untuk memotong gaji dan atau penghasilan lainnya yang
                  diperoleh untuk disetorkan ke Koperasi Karyawan Yayasan Al
                  Ghifari.
                </li>
                <li className="mb-2">
                  Mengembalikan uang sisa dari pinjaman yang belum lunas apabila
                  dipindah tugaskan/dimutasi ke unit kerja/lembaga lain atau
                  memberikan <b>kuasa/wewenang</b> pemotongan gaji kepada
                  Bendahara Gaji di tempat tugas baru
                </li>
                <li className="mb-2">
                  Bahwa saya membuat pernyataan ini dengan sebenarnya, dalam
                  kondisi sehat dan tanpa tekanan/paksaan dari pihak manapun.
                </li>
              </ol>
              <p className=" text-left">
                Demikianlah Surat Pernyataan dan Kuasa ini saya buat
                sebenar-benarnya dan tidak dapat dibatalkan jika tanpa
                persetujuan dari Koperasi karyawan Yayasan Al Ghifari dan
                Pimpinan Unit Kerja/Lembaga tempat saya bertugas, termasuk tidak
                akan berakhir oleh sebab sebagaimana yang dimaksud dalam pasal
                1813 KUHP Perdata, serta untuk dipergunakan sebagaimana
                mestinya.
              </p>
            </div>

            <div className="grid w-full grid-cols-3 gap-5 self-center p-4 text-center">
              <div className="flex flex-col gap-1">
                <p>Mengetahui,</p>
                <p>Pimpinan Lembaga</p>
              </div>

              <div className="flex flex-col gap-1">
                <p>Menyetujui,</p>
                <p>Bendahara Lembaga</p>
              </div>

              <div className="flex flex-col gap-1">
                <p>
                  Bandung, {formatDatebyMonth(new Date(data.tanggalPinjaman))}
                </p>
                <p>Yang Menyatakan,</p>
              </div>

              <div className="h-4 w-auto" />
              <div className="h-4 w-auto" />
              <div className="h-4 w-auto">
                <p className="text-slate-300">materai Rp. 10000</p>
              </div>

              <p className="font-bold">....................................</p>
              <p className="font-bold">....................................</p>
              <p className="font-bold">{data.anggota.nama}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
