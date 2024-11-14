import {
  TListAngsuranPinjaman,
  TMaxPelunasanPinjaman,
  TSplitAngsuran,
  TUpdateAngsuran,
} from "@/types/pinjaman";
import { taripAsuransi } from "./data-asuransi";
import {
  TColumnLaporan,
  TPotonganApproved,
  TPotongGaji,
} from "@/types/potongan";
import {
  TBalanceSimpanan,
  TCekUndurDiri,
  TPengambilanSimpanan,
  TSimpanan,
  TSimpananBerjangkaAnggota,
  TSimpananBerjangkaValue,
} from "@/types/simpanan";
import {
  ISplitDataPengambilanSimpananUndurDiri,
  SimpananKeys,
  TSplitDataPengambilanSimpananUndurDiri,
} from "@/types/undur-diri";
import {
  TDataPinjamanLaporan,
  TDataSimpananLaporan,
  TLaporanPinjaman,
  TLaporanSimpanan,
} from "@/types/laporan";

export function formatDatebyMonth(dateString: Date | string) {
  const dateObject = new Date(dateString);

  const year = dateObject.getFullYear();
  const month = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
    dateObject,
  );
  const day = dateObject.getDate();

  return `${day} ${month} ${year}`;
}

export function splitJenisPendaftaran(jenisPendaftaran: string) {
  return jenisPendaftaran
    .replace("simpanan-", "")
    .toUpperCase() as JenisSimpanan;
}

export function formatToIDR(data: number | null): string | null {
  const formattedAmount = data !== null ? data : 0;
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(formattedAmount);

  return formatted;
}

export function IDRToNumber(currency: string | null): number {
  if (!currency) {
    return 0;
  }
  const cleanedString = currency.replace(/Rp\s*/g, "").replace(/[^\d]/g, "");
  const integer = parseInt(cleanedString, 10);
  return isNaN(integer) ? 0 : integer;
}

export function formatToNumber(
  value: number | string | undefined,
): number | undefined {
  if (typeof value === "string") {
    const parsedValue = parseInt(value);
    return isNaN(parsedValue) ? undefined : parsedValue;
  } else {
    return value;
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "font-semibold text-yellow-500";
    case "PENDINGYAYASAN":
      return "font-semibold text-yellow-500";
    case "APPROVED":
      return "font-semibold text-blue-700";
    case "ONPROGRESS":
      return "font-semibold text-secondary";
    case "COMPLETED":
      return "font-semibold text-green-700";
    case "NOTCOMPLETE":
      return "font-semibold text-red-700";
    case "REJECTED":
      return "font-semibold text-red-700";
    default:
      return "";
  }
}

export function penguranganTotalSimpanan(
  data1: number | null,
  data2: number | null,
): string | null {
  const a = data1 !== null ? data1 : 0;
  const b = data2 !== null ? data2 : 0;

  const result = a - b;
  return formatToIDR(result);
}

export function balanceSimpanan(
  data1: number | null,
  data2: number | null,
  jenis: string,
): TBalanceSimpanan {
  const simpanan = data1 !== null ? data1 : 0;
  const pengambilan = data2 !== null ? data2 : 0;

  return {
    totalSimpanan: simpanan,
    totalPengambilan: pengambilan,
    balance: simpanan - pengambilan,
    jenis,
  };
}

export function pengurangan2Data(
  data1: number | null,
  data2: number | null,
): number | null {
  const a = data1 !== null ? data1 : 0;
  const b = data2 !== null ? data2 : 0;

  const result = a - b;
  return result;
}

export function calculatePercentage(value: number, percentage: number): number {
  return value * (percentage / 100);
}

export function generateJenisSimpanan(jenis: string) {
  let counter = "XX";
  switch (jenis) {
    case "WAJIB":
      counter = "WB";
      break;
    case "MANASUKA":
      counter = "MA";
      break;
    case "QURBAN":
      counter = "QB";
      break;
    case "LEBARAN":
      counter = "LB";
      break;
    case "SUKAMANA":
      counter = "MA";
      break;
    default:
      counter = "XX";
      break;
  }

  return counter;
}

export function generateJenisPelunasan(jenis: string) {
  let counter = "XX";
  switch (jenis) {
    case "TRANSFER":
      counter = "TF";
      break;
    case "CASH":
      counter = "CH";
      break;
    default:
      counter = "XX";
      break;
  }
  return counter;
}

export function generateJenisPendaftaranSimpanan(jenis: string) {
  let counter = "XX";
  switch (jenis) {
    case "simpanan-lebaran":
      counter = "Lebaran";
      break;
    case "simpanan-qurban":
      counter = "Qurban";
      break;
    case "simpanan-ubar":
      counter = "Ulin Bareng";
      break;
    default:
      counter = "XX";
      break;
  }
  return counter;
}

export function generateJenisPinjaman(jenis: string) {
  let counter = "XX";

  switch (jenis) {
    case "BARANG":
      counter = "PB";
      break;
    case "JASA":
      counter = "PJ";
      break;
    default:
      counter = "XX";
      break;
  }

  return counter;
}

let counterPengambilan = 0;
export function generatePengambilanId(id: string | null, jenis: string) {
  let angka = 0;

  if (id) {
    const match = id.match(/\d+$/);
    angka = match ? parseInt(match[0]) : 0;
  }

  const today = new Date();
  const tahun = String(today.getFullYear()).slice(-2);
  const bulan = String(today.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const hari = String(today.getDate()).toString().padStart(2, "0");

  counterPengambilan =
    angka >= counterPengambilan ? angka + 1 : counterPengambilan + 1;

  const nomorUrut = counterPengambilan.toString().padStart(3, "0");

  const Id = `PS-${generateJenisSimpanan(
    jenis,
  )}-${hari}${bulan}${tahun}-${nomorUrut}`;
  return Id;
}

let counterSimpanan = 0;
export function generateSimpananId(id: string | null, jenis: string) {
  let angka = 0;

  if (id) {
    const match = id.match(/\d+$/);
    angka = match ? parseInt(match[0]) : 0;
  }

  const today = new Date();
  const tahun = String(today.getFullYear()).slice(-2);
  const bulan = String(today.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const hari = String(today.getDate()).toString().padStart(2, "0");
  counterSimpanan = angka >= counterSimpanan ? angka + 1 : counterSimpanan + 1;

  const nomorUrut = counterSimpanan.toString().padStart(3, "0");

  const kodeSimpanan = `S-${generateJenisSimpanan(jenis)}-${hari}${bulan}${tahun}-${nomorUrut}`;
  return kodeSimpanan;
}

export function generatePelunasanPinjamanId(id: string | null, jenis: string) {
  let angka = 0;
  let counterPelunasan = 0;

  if (id) {
    const match = id.match(/\d+$/);
    angka = match ? parseInt(match[0]) : 0;
  }

  const today = new Date();
  const tahun = String(today.getFullYear()).slice(-2);
  const bulan = String(today.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const hari = String(today.getDate()).toString().padStart(2, "0");

  counterPelunasan =
    angka >= counterPelunasan ? angka + 1 : counterPelunasan + 1;

  const nomorUrut = counterPelunasan.toString().padStart(3, "0");

  const Id = `PP-${generateJenisPelunasan(
    jenis,
  )}-${hari}${bulan}${tahun}-${nomorUrut}`;
  return Id;
}

export function generatePinjamanId(id: string | null, jenis: string) {
  let angka = 0;
  let counterPengambilan = 0;

  if (id) {
    const match = id.match(/\d+$/);
    angka = match ? parseInt(match[0]) : 0;
  }

  const today = new Date();
  const tahun = String(today.getFullYear()).slice(-2);
  const bulan = String(today.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const hari = String(today.getDate()).toString().padStart(2, "0");

  counterPengambilan =
    angka >= counterPengambilan ? angka + 1 : counterPengambilan + 1;

  const nomorUrut = counterPengambilan.toString().padStart(3, "0");

  const Id = `${generateJenisPinjaman(
    jenis,
  )}-${hari}${bulan}${tahun}-${nomorUrut}`;
  return Id;
}

let counterNoAngsuran = 0;
export function generateAngsuranId(id: string | null) {
  let angka = 0;
  if (id) {
    const match = id.match(/\d+$/);
    angka = match ? parseInt(match[0]) : 0;
  }
  const today = new Date();
  const tahun = String(today.getFullYear()).slice(-2);
  const bulan = String(today.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const hari = String(today.getDate()).toString().padStart(2, "0");
  counterNoAngsuran =
    angka >= counterNoAngsuran ? angka + 1 : counterNoAngsuran + 1;

  const nomorUrut = counterNoAngsuran.toString().padStart(3, "0");

  const kodeAngsuran = `AP-${hari}${bulan}${tahun}-${nomorUrut}`;
  return kodeAngsuran;
}

export function calculateTakeHomePay(salary: number): number {
  const percentage = 0.35;
  const takeHomePay = salary * percentage;
  return takeHomePay;
}

export function cekLoanInstallment(
  gaji: number,
  pinjaman: number,
  waktuPengembalian: number,
): boolean {
  const admin = calculatePercentage(pinjaman, 1);
  const maxInstallmentAllowed = calculateTakeHomePay(gaji);
  const monthlyInstallment = pinjaman / waktuPengembalian + admin;
  const isEligible = monthlyInstallment <= maxInstallmentAllowed;

  return isEligible;
}

interface IPredictLoanBasedOnSalary {
  maxLoanAmount: number;
  maxRepaymentTime: number;
  monthlyInstallment: number;
}

export function predictLoanBasedOnSalary(
  gaji: number,
  pinjaman: number,
): IPredictLoanBasedOnSalary {
  // Menghitung batasan maksimum angsuran bulanan yang diizinkan (35% dari gaji bulanan)
  const maxInstallmentAllowed = calculateTakeHomePay(gaji);
  const admin = calculatePercentage(pinjaman, 1);

  let maxLoanAmount = 0;
  let maxRepaymentTime = 0;

  for (let i = 5; i <= 36; i++) {
    const potentialLoanAmount = pinjaman / i + admin;
    if (potentialLoanAmount <= maxInstallmentAllowed) {
      maxLoanAmount = pinjaman;
      maxRepaymentTime = i;
      break;
    }
  }

  return {
    maxLoanAmount,
    maxRepaymentTime,
    monthlyInstallment: maxInstallmentAllowed,
  };
}

export interface ICalculateLoanInstallment {
  monthlyInstallment: number;
  admin: number;
  isEligible: boolean;
}

export function calculateLoanInstallment(
  gaji: number,
  pinjaman: number,
  waktuPengembalian: number,
): ICalculateLoanInstallment {
  const admin = calculatePercentage(pinjaman, 1);

  const maxInstallmentAllowed = calculateTakeHomePay(gaji);

  const monthlyInstallment = pinjaman / waktuPengembalian + admin;

  const isEligible = monthlyInstallment <= maxInstallmentAllowed;

  return {
    monthlyInstallment: isEligible ? monthlyInstallment : 0,
    admin,
    isEligible,
  };
}

export function countReceive(
  data1: number,
  data2: number,
  data3: number,
  data4: number,
): number {
  const pinjaman = data1 ?? 0;
  const admin = data2 ?? 0;
  const totalPremi = data3 ?? 0;
  const pelunasan = data4 ?? 0;

  const receive = pinjaman - (admin + totalPremi + pelunasan);
  return receive;
}

function countAge(tanggal: Date): number {
  const tanggalLahir = new Date(tanggal);
  const tanggalSekarang = new Date();

  const tahunLahir = tanggalLahir.getFullYear();
  const bulanLahir = tanggalLahir.getMonth();
  const tanggalLahirInt = tanggalLahir.getDate();

  const tahunSekarang = tanggalSekarang.getFullYear();
  const bulanSekarang = tanggalSekarang.getMonth();
  const tanggalSekarangInt = tanggalSekarang.getDate();

  let umur = tahunSekarang - tahunLahir;

  if (
    bulanSekarang < bulanLahir ||
    (bulanSekarang === bulanLahir && tanggalSekarangInt < tanggalLahirInt)
  ) {
    umur--;
  }

  return umur;
}

function countTenor(bulan: number): number {
  if (bulan <= 12) {
    return 1;
  } else {
    const tahun = Math.floor(bulan / 12);
    const sisaBulan = bulan % 12;
    return sisaBulan > 0 ? tahun + 1 : tahun;
  }
}

function countEndDateAsuransi(tenor: number): string {
  const tanggalNow = new Date();
  tanggalNow.setFullYear(tanggalNow.getFullYear() + tenor);

  let tanggal = tanggalNow.getDate();
  let bulan = tanggalNow.getMonth() + 1;
  let tahun = tanggalNow.getFullYear();

  const tanggalAsuransi = (tanggal < 10 ? "0" : "") + tanggal.toString();
  const bulanAsuransi = (bulan < 10 ? "0" : "") + bulan.toString();

  const hasil = `${tahun}-${bulanAsuransi}-${tanggalAsuransi}T00:00:00Z`;
  return hasil;
}

function countPremi(pinjaman: number, tenor: number | string): number {
  let result: number;
  if (typeof tenor === "string") {
    if (tenor === "-") {
      result = 0;
    } else {
      result = parseFloat(tenor);
    }
  } else {
    result = tenor;
  }
  const premi = (result * pinjaman) / 1000;
  return premi;
}

export interface ICalculateAsuransi {
  umur?: number;
  tenor?: number;
  totalPremi?: number;
  tglSelesaiAsuransi?: string;
  monthlyInstallment?: number;
  admin?: number;
  isEligible?: boolean;
  receive?: number;
  pelunasan?: number;
  statusAsuransi: boolean;
  pesanAsuransai: string;
}

export function calculateAsuransi(
  gaji: number,
  tanggal: Date,
  waktuPengembalian: number,
  pinjaman: number,
  jenisPinjaman: string,
  pelunasan: number,
): ICalculateAsuransi {
  const angsuran = calculateLoanInstallment(gaji, pinjaman, waktuPengembalian);

  if (!angsuran.isEligible) {
    return {
      statusAsuransi: false,
      pesanAsuransai: "Maaf, Pengajuan pinjaman belum memenuhi persyaratan,",
    };
  }
  if (jenisPinjaman === "BARANG") {
    return {
      umur: undefined,
      tenor: undefined,
      totalPremi: 0,
      tglSelesaiAsuransi: undefined,
      monthlyInstallment: angsuran.monthlyInstallment,
      admin: angsuran.admin,
      isEligible: angsuran.isEligible,
      receive: countReceive(pinjaman, angsuran.admin, 0, 0),
      pelunasan: 0,
      statusAsuransi: true,
      pesanAsuransai:
        "Pengajuan pinjaman berhasil melewati pengecekan persyaratan! Silakan ajukan pinjaman untuk melanjutkan.",
    };
  }

  if (!tanggal) {
    return {
      statusAsuransi: false,
      pesanAsuransai: "Maaf, data tanggal lahir tidak tersedia.",
    };
  }

  const umur = countAge(tanggal);

  if (umur < 21) {
    return {
      statusAsuransi: false,
      pesanAsuransai: `Maaf, data tanggal lahir tidak valid. umur : ${umur} Tahun. `,
    };
  }
  const tenor = countTenor(waktuPengembalian);
  const value = taripAsuransi[umur][tenor];
  const tanggalAkhir = countEndDateAsuransi(tenor);
  const totalPremi = countPremi(pinjaman, value);

  if (totalPremi <= 0) {
    return {
      statusAsuransi: false,
      pesanAsuransai:
        "Maaf, Tidak bisa mengajukan pinjaman karena tidak ada asuransi yang tersedia.",
    };
  }

  const received = countReceive(
    pinjaman,
    angsuran.admin,
    totalPremi,
    pelunasan,
  );

  return {
    umur: umur,
    tenor: tenor,
    totalPremi: totalPremi,
    tglSelesaiAsuransi: tanggalAkhir,
    monthlyInstallment: angsuran.monthlyInstallment,
    admin: angsuran.admin,
    isEligible: angsuran.isEligible,
    receive: received,
    pelunasan: pelunasan,
    statusAsuransi: received > 0 ? true : false,
    pesanAsuransai:
      received > 0
        ? "Pengajuan pinjaman Anda berhasil melewati pengecekan persyaratan! Silakan ajukan pinjaman untuk melanjutkan."
        : `Maaf, Pengajuan pinjaman belum memenuhi persyaratan, Jumlah yang harus dilunasi: ${formatToIDR(pelunasan)}`,
  };
}

export function setIdAutoincrement(id: number | null) {
  if (!id) {
    return 1;
  }
  return id + 1;
}

export function generatePhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith("0")) {
    return `62${phoneNumber.slice(1)}`;
  } else if (phoneNumber.startsWith("62")) {
    return phoneNumber;
  } else if (phoneNumber.startsWith("+62")) {
    return phoneNumber.slice(1);
  } else {
    return phoneNumber;
  }
}

export function toTerbilang(n: number): string {
  const satuan = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];

  const terbilang = (n: number): string => {
    if (n < 12) {
      return satuan[n];
    } else if (n < 20) {
      return terbilang(n - 10) + " belas";
    } else if (n < 100) {
      return terbilang(Math.floor(n / 10)) + " puluh " + terbilang(n % 10);
    } else if (n < 200) {
      return "seratus " + terbilang(n - 100);
    } else if (n < 1000) {
      return terbilang(Math.floor(n / 100)) + " ratus " + terbilang(n % 100);
    } else if (n < 2000) {
      return "seribu " + terbilang(n - 1000);
    } else if (n < 1000000) {
      return terbilang(Math.floor(n / 1000)) + " ribu " + terbilang(n % 1000);
    } else if (n < 1000000000) {
      return (
        terbilang(Math.floor(n / 1000000)) + " juta " + terbilang(n % 1000000)
      );
    } else if (n < 1000000000000) {
      return (
        terbilang(Math.floor(n / 1000000000)) +
        " milyar " +
        terbilang(n % 1000000000)
      );
    } else if (n < 1000000000000000) {
      return (
        terbilang(Math.floor(n / 1000000000000)) +
        " triliun " +
        terbilang(n % 1000000000000)
      );
    } else {
      return "";
    }
  };

  return terbilang(n) + " rupiah";
}
export interface ICalculatePelunasanPinjaman {
  noPinjaman: string;
  tujuanPinjaman: string;
  ajuanPinjaman: number;
  waktuPengembalian: number;
  angsuranKe: number;
  angsuranDari: number;
  admin: number;
  sudahDibayarkan: number;
  jumlahPelunasan: number;
}

//masih belum benar sudahDibayar dan jumlah pelunasan
export function calculatePelunasanPinjaman(
  data: TMaxPelunasanPinjaman,
): ICalculatePelunasanPinjaman {
  let jumlahPelunasan: number = 0;
  let sudahDibayarkan: number = 0;

  const admin = calculatePercentage(data.ajuanPinjaman, 1);

  const result = data.AngsuranPinjaman.reduce(
    (acc, current) => {
      acc.lastAngsuranKe =
        current.angsuranPinjamanKe > acc.lastAngsuranKe
          ? current.angsuranPinjamanKe
          : acc.lastAngsuranKe;

      acc.lastAngsuranDari =
        current.angsuranPinjamanDari > acc.lastAngsuranDari
          ? current.angsuranPinjamanDari
          : acc.lastAngsuranDari;

      if (current.angsuranPinjamanKe > 0) {
        acc.totalBayar += current.jumlahAngsuranPinjaman;
      }
      return acc;
    },
    { lastAngsuranKe: 0, totalBayar: 0, lastAngsuranDari: 0 },
  );

  sudahDibayarkan = Math.round(
    result.totalBayar - admin * result.lastAngsuranKe,
  );

  jumlahPelunasan = data.ajuanPinjaman - sudahDibayarkan + admin;

  return {
    noPinjaman: data.noPinjaman,
    tujuanPinjaman: data.tujuanPinjaman,
    ajuanPinjaman: data.ajuanPinjaman,
    waktuPengembalian: data.waktuPengembalian,
    angsuranKe: result.lastAngsuranKe,
    angsuranDari: result.lastAngsuranDari,
    admin: admin,
    sudahDibayarkan: sudahDibayarkan,
    jumlahPelunasan: jumlahPelunasan,
  };
}

export interface ICalculateChartPinjamanAnggota {
  noPinjaman: string;
  ajuanPinjaman: number;
  angsuranKe: number;
  angsuranDari: number;
  sudahDibayarkan: number;
  jumlahPelunasan: number;
  angsuran: {
    date: string;
    angsuran: number;
  }[];
}
export function calculateChartPinjamanAnggota(
  data: TMaxPelunasanPinjaman,
): ICalculateChartPinjamanAnggota {
  let jumlahPelunasan: number = 0;
  let sudahDibayarkan: number = 0;

  const admin = calculatePercentage(data.ajuanPinjaman, 1);

  const result = data.AngsuranPinjaman.reduce(
    (acc, current) => {
      acc.lastAngsuranKe =
        current.angsuranPinjamanKe > acc.lastAngsuranKe
          ? current.angsuranPinjamanKe
          : acc.lastAngsuranKe;

      acc.lastAngsuranDari =
        current.angsuranPinjamanDari > acc.lastAngsuranDari
          ? current.angsuranPinjamanDari
          : acc.lastAngsuranDari;

      if (current.angsuranPinjamanKe > 0) {
        acc.totalBayar += current.jumlahAngsuranPinjaman;

        const formattedDate = new Date(current.tanggalAngsuranPinjaman)
          .toISOString()
          .split("T")[0];

        acc.angsuranList.push({
          date: formattedDate,
          angsuran: current.jumlahAngsuranPinjaman,
        });
      }

      return acc;
    },
    {
      lastAngsuranKe: 0,
      totalBayar: 0,
      lastAngsuranDari: 0,
      angsuranList: [] as { date: string; angsuran: number }[],
    },
  );
  sudahDibayarkan = result.totalBayar;
  jumlahPelunasan = data.ajuanPinjaman - sudahDibayarkan + admin;
  return {
    noPinjaman: data.noPinjaman,
    ajuanPinjaman: data.ajuanPinjaman,
    angsuranKe: result.lastAngsuranKe,
    angsuranDari: result.lastAngsuranDari,
    sudahDibayarkan: sudahDibayarkan,
    jumlahPelunasan: jumlahPelunasan,
    angsuran: result.angsuranList,
  };
}

export interface ITransformData {
  [key: string]: string | number;
}
export function transformData(originalData: ITransformData[]): TPotongGaji[] {
  originalData.shift();
  const transformedData = originalData.map((row) => {
    const keys = Object.keys(row);
    const noAnggotaKey = keys.find((key) =>
      key.startsWith("REKAP POTONGAN GAJI"),
    );
    return {
      anggotaId: row[noAnggotaKey as string] as string,
      nama: row["__EMPTY"] as string,
      unitGarapan: row["__EMPTY_1"] as string,
      simpananWajib: row["__EMPTY_2"] as number,
      simpananManasuka: row["__EMPTY_3"] as number,
      simpananLebaran: row["__EMPTY_4"] as number,
      simpananQurban: row["__EMPTY_5"] as number,
      simpananUbar: row["__EMPTY_6"] as number,
      noPinjamanJasa: row["__EMPTY_7"] as string,
      AngsuranKeJasa: row["__EMPTY_8"] as number,
      AngsuranDariJasa: row["__EMPTY_9"] as number,
      jumlahAngsuranJasa: row["__EMPTY_10"] as number,
      noPinjamanBarang: row["__EMPTY_11"] as string,
      AngsuranKeBarang: row["__EMPTY_12"] as number,
      AngsuranDariBarang: row["__EMPTY_13"] as number,
      jumlahAngsuranBarang: row["__EMPTY_14"] as number,
      total: row["__EMPTY_15"] as number,
    };
  });

  return transformedData;
}

export enum JenisSimpanan {
  WAJIB = "WAJIB",
  MANASUKA = "MANASUKA",
  LEBARAN = "LEBARAN",
  QURBAN = "QURBAN",
  UBAR = "UBAR",
}

export function splitDataSimpanan(
  idSimpanan: string | null,
  data: TPotongGaji[],
): TSimpanan[] {
  const simpananData: TSimpanan[] = [];

  data.forEach((item) => {
    const noAnggota = item.anggotaId;
    const tanggalSimpanan = new Date().toISOString();

    const simpananTypes: { [key in JenisSimpanan]?: number | null } = {
      [JenisSimpanan.WAJIB]: item.simpananWajib,
      [JenisSimpanan.MANASUKA]: item.simpananManasuka,
      [JenisSimpanan.LEBARAN]: item.simpananLebaran,
      [JenisSimpanan.QURBAN]: item.simpananQurban,
      [JenisSimpanan.UBAR]: item.simpananUbar,
    };

    Object.entries(simpananTypes).forEach(([jenisSimpanan, jumlahSimpanan]) => {
      if (jumlahSimpanan !== null && jumlahSimpanan > 0) {
        simpananData.push({
          noSimpanan: generateSimpananId(idSimpanan, jenisSimpanan),
          anggotaId: noAnggota,
          tanggalSimpanan,
          jenisSimpanan: jenisSimpanan as JenisSimpanan,
          basil: 0,
          jumlahSimpanan,
        });
      }
    });
  });

  return simpananData;
}

export function splitDataPengambilanSimpananBerjangka(
  idPengambilan: string | null,
  data: TSimpananBerjangkaValue[],
): TPengambilanSimpanan[] {
  const pengambilanData: TPengambilanSimpanan[] = [];

  data.forEach((item) => {
    const noAnggota = item.noAnggota;
    const tanggalPengambilan = new Date().toISOString();
    if (item.totalSimpanan > 0) {
      pengambilanData.push({
        noPengambilanSimpanan: generatePengambilanId(
          idPengambilan,
          item.jenisSimpanan,
        ),
        anggotaId: noAnggota,
        tanggalPengambilanSimpanan: tanggalPengambilan,
        jenisPengambilanSimpanan: item.jenisSimpanan as JenisSimpanan,
        jumlahPengambilanSimpanan: item.totalSimpanan,
        statusPengambilanSimpanan: "APPROVED",
      });
    }
  });

  return pengambilanData;
}

export function splitAngsuran(
  idAngsuran: string | null,
  data: TPotongGaji[],
): { data: TSplitAngsuran[]; pass: TUpdateAngsuran[] } {
  const angsuranData: TSplitAngsuran[] = [];
  const angsuranPass: TUpdateAngsuran[] = [];

  data.forEach((item) => {
    const tanggalAngsuranPinjaman = new Date();

    const createAngsuranData = (
      anggotaId: string,
      noPinjaman: string,
      jenisPinjaman: "JASA" | "BARANG",
      angsuranKe: number | string | null,
      angsuranDari: number | string | null,
      jumlahAngsuran: number | string | null,
    ) => {
      if (
        angsuranKe !== "-" &&
        angsuranDari !== "-" &&
        jumlahAngsuran !== "-"
      ) {
        const status = angsuranKe === angsuranDari ? "COMPLETED" : "ONPROGRESS";
        angsuranData.push({
          anggotaId,
          jenisPinjaman,
          noAngsuranPinjaman: generateAngsuranId(idAngsuran),
          tanggalAngsuranPinjaman,
          pinjamanId: noPinjaman,
          angsuranPinjamanKe: Number(angsuranKe),
          angsuranPinjamanDari: Number(angsuranDari),
          jumlahAngsuranPinjaman: Number(jumlahAngsuran),
          statusAngsuranPinjaman: status,
        });

        if (angsuranKe === angsuranDari) {
          angsuranPass.push({
            pinjamanId: noPinjaman,
            statusPinjaman: "COMPLETED",
          });
        }
      }
    };

    if (item.noPinjamanJasa && item.noPinjamanJasa !== "-") {
      createAngsuranData(
        item.anggotaId,
        item.noPinjamanJasa,
        "JASA",
        item.AngsuranKeJasa,
        item.AngsuranDariJasa,
        item.jumlahAngsuranJasa,
      );
    }

    if (item.noPinjamanBarang && item.noPinjamanBarang !== "-") {
      createAngsuranData(
        item.anggotaId,
        item.noPinjamanBarang,
        "BARANG",
        item.AngsuranKeBarang,
        item.AngsuranDariBarang,
        item.jumlahAngsuranBarang,
      );
    }
  });

  return { data: angsuranData, pass: angsuranPass };
}

let IdAutoLoop = 0;
function setIdAutoLoop(id: number | null) {
  let angka = 0;
  if (id) {
    angka = id;
  }

  IdAutoLoop = angka >= IdAutoLoop ? angka + 1 : IdAutoLoop + 1;

  return IdAutoLoop;
}

export function setPotonganGaji(
  data: TPotongGaji[],
  id: number | null,
): TPotonganApproved[] {
  const dataPotongan: TPotonganApproved[] = [];
  const tanggalPotonganGaji = new Date();
  data.forEach((item) => {
    dataPotongan.push({
      idPotonganGaji: setIdAutoLoop(id),
      tanggalPotonganGaji,
      anggotaIdPotongGaji: item.anggotaId,
      namaPotongGaji: item.nama,
      unitGarapanPotongGaji: item.unitGarapan,
      simpananWajibPotongGaji: item.simpananWajib,
      simpananManasukaPotongGaji: item.simpananManasuka,
      simpananLebaranPotongGaji: item.simpananLebaran,
      simpananQurbanPotongGaji: item.simpananQurban,
      simpananUbarPotongGaji: item.simpananUbar,
      noPinjamanJasaPotongGaji: item.noPinjamanJasa,
      AngsuranKeJasaPotongGaji:
        item.AngsuranKeJasa === "-" ? null : Number(item.AngsuranKeJasa),
      AngsuranDariJasaPotongGaji:
        item.AngsuranDariJasa === "-" ? null : Number(item.AngsuranDariJasa),
      jumlahAngsuranJasaPotongGaji:
        item.jumlahAngsuranJasa === "-'"
          ? null
          : Number(item.jumlahAngsuranJasa),
      noPinjamanBarangPotongGaji: item.noPinjamanBarang,
      AngsuranKeBarangPotongGaji:
        item.AngsuranKeBarang === "-" ? null : Number(item.AngsuranKeBarang),
      AngsuranDariBarangPotongGaji:
        item.AngsuranDariBarang === "-"
          ? null
          : Number(item.AngsuranDariBarang),
      jumlahAngsuranBarangPotongGaji:
        item.jumlahAngsuranBarang === "-"
          ? null
          : Number(item.jumlahAngsuranBarang),
      totalPotongGaji: item.total,
      statusPotonganGaji: "SUCCESS",
    });
  });
  return dataPotongan;
}

export function isPassPinjaman(
  angsuranKe: number,
  angsuranDari: number,
): boolean {
  const halfAngsuranDari = Math.floor(angsuranDari / 2);
  if (angsuranKe >= halfAngsuranDari) {
    return true;
  } else {
    return false;
  }
}

export type TCalculateUndurDiri = {
  anggotaId: string;
  noUser: string;
  keterangan: string;
  wajib: number;
  sukamana: number;
  lebaran: number;
  qurban: number;
  ubar: number;
  biaya: number;
  pinjamanJasa: ICalculatePelunasanPinjaman | null;
  pinjamanBarang: ICalculatePelunasanPinjaman | null;
};
export function calculateUndurDiri(props: TCalculateUndurDiri): TCekUndurDiri {
  let jumlahPelunasanJasa: number = 0;
  let jumlahPelunasanBarang: number = 0;

  if (props.pinjamanJasa) {
    jumlahPelunasanJasa = props.pinjamanJasa.jumlahPelunasan;
  }
  if (props.pinjamanBarang) {
    jumlahPelunasanBarang = props.pinjamanBarang.jumlahPelunasan;
  }
  const totalKotor =
    props.wajib + props.sukamana + props.lebaran + props.qurban + props.ubar;
  const totalBersih =
    totalKotor - props.biaya - jumlahPelunasanJasa - jumlahPelunasanBarang;
  return {
    isPass: totalBersih > 0 ? true : false,
    anggotaId: props.anggotaId,
    noUser: props.noUser,
    keterangan: props.keterangan,
    wajib: props.wajib,
    sukamana: props.sukamana,
    lebaran: props.lebaran,
    qurban: props.qurban,
    ubar: props.ubar,
    biaya: props.biaya,
    totalKotor,
    totalBersih,
    pinjamanJasa: props.pinjamanJasa,
    pinjamanBarang: props.pinjamanBarang,
  };
}

export function splitDataPengambilanSimpananUndurDiri(
  data: ISplitDataPengambilanSimpananUndurDiri,
  idPengambilan: string | null,
): TSplitDataPengambilanSimpananUndurDiri[] {
  const simpananMapping: { [key in SimpananKeys]: string } = {
    simpananWajibPengunduranDiri: "WAJIB",
    simpananManasukaPengunduranDiri: "MANASUKA",
    simpananLebaranPengunduranDiri: "LEBARAN",
    simpananQurbanPengunduranDiri: "QURBAN",
    simpananUbarPengunduranDiri: "UBAR",
  };

  return (Object.keys(simpananMapping) as SimpananKeys[])
    .filter((key) => data[key] > 0)
    .map((key) => ({
      noPengambilanSimpanan: generatePengambilanId(
        idPengambilan,
        simpananMapping[key],
      ),
      anggotaId: data.anggotaId,
      jenisPengambilanSimpanan: simpananMapping[key],
      jumlahPengambilanSimpanan: data[key],
      statusPengambilanSimpanan: "APPROVED",
    }));
}

function formatBulan(date: Date): string {
  const tahun = date.getFullYear();
  const bulan = date.toLocaleString("id-ID", { month: "long" });

  return `${bulan} - ${tahun}`;
}

function generateRangeMonth(startDate: Date, endDate: Date): string[] {
  const result: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= last) {
    const monthName = current.toLocaleString("id-ID", { month: "long" });
    const year = current.getFullYear();
    result.push(`${monthName} - ${year}`);
    current.setMonth(current.getMonth() + 1);
  }

  return result;
}

export function generateSimpananBerjangka(
  simpananData: TSimpananBerjangkaAnggota,
  startDate: Date,
  endDate: Date,
  jenisSimpanan: JenisSimpanan,
): TSimpananBerjangkaValue[] {
  const bulanRange = generateRangeMonth(startDate, endDate);

  return simpananData.map((data) => {
    const saving: TSimpananBerjangkaValue = {
      noAnggota: data.anggota.noAnggota,
      nama: data.anggota.nama,
      unitKerja: data.anggota.unitKerja.namaUnitKerja,
      jenisSimpanan: jenisSimpanan,
      totalSimpanan: 0,
      simpanan: bulanRange.map((bulan) => ({
        bulan,
        total: 0,
      })),
    };

    data.anggota.Simpanan.forEach((simpanan) => {
      const bulanSimpanan = formatBulan(new Date(simpanan.tanggalSimpanan));
      const simpananBulan = saving.simpanan.find(
        (s) => s.bulan === bulanSimpanan,
      );
      if (simpananBulan) {
        simpananBulan.total += simpanan.jumlahSimpanan;
      }
    });

    data.anggota.PengambilanSimpanan.forEach((pengambilan) => {
      const bulanPengambilan = formatBulan(
        new Date(pengambilan.tanggalPengambilanSimpanan),
      );
      const pengambilanBulan = saving.simpanan.find(
        (s) => s.bulan === bulanPengambilan,
      );
      if (pengambilanBulan) {
        pengambilanBulan.total -= pengambilan.jumlahPengambilanSimpanan;
      }
    });

    saving.totalSimpanan = saving.simpanan.reduce(
      (sum, current) => sum + current.total,
      0,
    );

    return saving;
  });
}

export function generateColumnsExcellSimpananBerjangka(
  startDate: Date,
  endDate: Date,
): TColumnLaporan[] {
  const columns: TColumnLaporan[] = [
    { header: "No Anggota", value: "noAnggota" },
    { header: "Nama", value: "nama" },
    { header: "Unit Kerja", value: "unitKerja" },
    { header: "Jenis Simpanan", value: "jenisSimpanan" },
  ];

  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const monthYear = current.toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
    });
    columns.push({
      header: monthYear,
      value: monthYear.replace(/\s+/g, "_"),
    });
    current.setMonth(current.getMonth() + 1);
  }

  columns.push({ header: "Total Simpanan", value: "totalSimpanan" });

  return columns;
}

export function transformDataExcellSimpananBerjangka(
  dataArray: TSimpananBerjangkaValue[],
) {
  return dataArray.map((data) => {
    const result: any = {
      noAnggota: data.noAnggota,
      nama: data.nama,
      unitKerja: data.unitKerja,
      jenisSimpanan: data.jenisSimpanan,
      totalSimpanan: data.totalSimpanan,
    };

    data.simpanan.forEach((detail) => {
      const bulanKey = detail.bulan
        .replace(/\s+-\s+/g, "_")
        .replace(/\s+/g, "_");
      result[bulanKey] = detail.total;
    });

    return result;
  });
}

export function transformLaporanPinjaman(
  data: TDataPinjamanLaporan[],
): TLaporanPinjaman[] {
  const pinjaman = data.map((item) => {
    const jasa = calculatePercentage(item.ajuanPinjaman, 1);
    const akad = jasa * item.waktuPengembalian;
    const angsuran = item.AngsuranPinjaman.reduce(
      (acc, current) => {
        acc.lastAngsuran = current.angsuranPinjamanKe;
        acc.jumlahAngsuran += current.jumlahAngsuranPinjaman;
        return acc;
      },
      {
        lastAngsuran: 0,
        jumlahAngsuran: 0,
      },
    );
    const pokokMasuk = angsuran.jumlahAngsuran - jasa * angsuran.lastAngsuran;
    const sisaPokok = item.ajuanPinjaman - pokokMasuk;
    const jasaMasuk = jasa * angsuran.lastAngsuran;
    return {
      noAnggota: item.anggota.noAnggota,
      nama: item.anggota.nama,
      namaUnitKerja: item.anggota.unitKerja.namaUnitKerja,
      noPinjaman: item.noPinjaman,
      tanggalPinjaman: item.tanggalPinjaman,
      waktuPengembalian: `${angsuran.lastAngsuran} / ${item.waktuPengembalian}`,
      jenisPinjaman: item.jenisPinjaman,
      statusPinjaman: item.statusPinjaman,
      ajuanPinjaman: item.ajuanPinjaman,
      jumlahAngsuran: angsuran.jumlahAngsuran,
      akad: akad,
      pokokMasuk: pokokMasuk,
      jasaMasuk: jasaMasuk,
      sisaPokok: sisaPokok,
    };
  });

  return pinjaman;
}

export function transformLaporanSimpanan(
  dataLaporan: TDataSimpananLaporan[],
  startDate: Date,
  endDate: Date,
): TLaporanSimpanan[] {
  const bulanRange = generateRangeMonth(startDate, endDate);
  return dataLaporan.map((data) => {
    const laporan: TLaporanSimpanan = {
      noAnggota: data.noAnggota,
      nama: data.nama,
      namaUnitKerja: data.unitKerja.namaUnitKerja,
      jumlahSimpanan: 0,
      jumlahSimpananWajib: 0,
      jumlahSimpananSukamana: 0,
      pengambilanSimpanan: 0,
      saldoSimpanan: 0,
      simpanan: bulanRange.map((bulan) => ({
        bulan,
        total: 0,
      })),
    };

    data.Simpanan.forEach((simpanan) => {
      const bulanSimpanan = formatBulan(new Date(simpanan.tanggalSimpanan));
      const simpananBulan = laporan.simpanan.find(
        (s) => s.bulan === bulanSimpanan,
      );
      laporan.jumlahSimpanan += simpanan.jumlahSimpanan;
      if (simpananBulan) {
        simpananBulan.total += simpanan.jumlahSimpanan;
      }
      if (simpanan.jenisSimpanan === "WAJIB") {
        laporan.jumlahSimpananWajib += simpanan.jumlahSimpanan;
      }
      if (simpanan.jenisSimpanan === "MANASUKA") {
        laporan.jumlahSimpananSukamana += simpanan.jumlahSimpanan;
      }
    });

    data.PengambilanSimpanan.forEach((pengambilan) => {
      const bulanPengambilan = formatBulan(
        new Date(pengambilan.tanggalPengambilanSimpanan),
      );
      const pengambilanBulan = laporan.simpanan.find(
        (s) => s.bulan === bulanPengambilan,
      );
      laporan.pengambilanSimpanan += pengambilan.jumlahPengambilanSimpanan;
      if (pengambilanBulan) {
        pengambilanBulan.total -= pengambilan.jumlahPengambilanSimpanan;
      }
      if (pengambilan.jenisPengambilanSimpanan === "WAJIB") {
        laporan.jumlahSimpananWajib -= pengambilan.jumlahPengambilanSimpanan;
      }
      if (pengambilan.jenisPengambilanSimpanan === "MANASUKA") {
        laporan.jumlahSimpananSukamana -= pengambilan.jumlahPengambilanSimpanan;
      }
    });

    laporan.saldoSimpanan =
      laporan.jumlahSimpanan - laporan.pengambilanSimpanan;

    return laporan;
  });
}
