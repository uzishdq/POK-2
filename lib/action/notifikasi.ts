"use server";

import { TSimpanan } from "@/types/simpanan";
import {
  getListPhone,
  getPhoneByEmail,
  getPhoneByEmailRole,
  getPhoneByPinjamanId,
} from "../data/anggota";
import {
  calculatePelunasanPinjaman,
  generatePhoneNumber,
  ICalculatePelunasanPinjaman,
} from "../helper";
import {
  ITemplateAngsuranPelunasanPinjaman,
  ITemplatePelunasanPinjaman,
  ITemplatePelunasanPinjamanPetugas,
  ITemplatePengajuanPinjaman,
  ITemplatePengajuanPinjamanPetugas,
  ITemplatePengambilanSimpanan,
  ITemplatePengambilanSimpananPetugas,
  ITemplatePengumumamPendaftaranSimpanan,
  ITemplatePengunduranAnggota,
  ITemplatePengunduranPetugas,
  ITemplatePotonganGajiAngsuran,
  ITemplatePotonganGajiSimpanan,
  templateAngsuranPelunasanPinjaman,
  templatePelunasanPinjaman,
  templatePelunasanPinjamanApproved,
  templatePelunasanPinjamanPetugas,
  templatePelunasanPinjamanRejected,
  templatePengajuanPinjaman,
  templatePengajuanPinjamanApproved,
  templatePengajuanPinjamanPetugas,
  templatePengajuanPinjamanRejected,
  templatePengambilanSimpanan,
  templatePengambilanSimpananApproved,
  templatePengambilanSimpananPetugas,
  templatePengambilanSimpananRejected,
  templatePengumumamPendaftaranSimpanan,
  templatePengunduranAnggota,
  templatePengunduranAnggotaApproved,
  templatePengunduranAnggotaRejected,
  templatePengunduranPetugas,
  templatePotonganGajiAngsuran,
  templatePotonganGajiSimpanan,
} from "../template-notif";
import {
  TListAngsuranPinjaman,
  TMaxPelunasanPinjaman,
  TSplitAngsuran,
} from "@/types/pinjaman";

interface INotifWa {
  phone: string;
  template: string;
}

interface INotifPengambilanSimpanan {
  noPengambilanSimpanan: string;
  anggotaId: string;
  tanggalPengambilanSimpanan: Date;
  jenisPengambilanSimpanan: string;
  jumlahPengambilanSimpanan: number;
  statusPengambilanSimpanan: string;
}

interface INotifPengajuanPinjaman {
  noPinjaman: string;
  anggotaId: string;
  tanggalPinjaman: Date;
  tujuanPinjaman: string;
  waktuPengembalian: number;
  jenisPinjaman: string;
  ajuanPinjaman: number;
  statusPinjaman: string;
}

interface INotifPelunasanPinjaman {
  noPelunasanPinjaman: string;
  tanggalPelunasanPinjaman: Date;
  pinjamanId: string;
  jenisPelunasanPinjaman: "TRANSFER" | "CASH";
  jumlahPelunasanPinjaman: number;
  statusPelunasanPinjaman: "PENDING" | "APPROVED" | "REJECTED";
}

export const cekNotifWa = async () => {
  const notif = await fetch("https://app.ruangwa.id/api/device", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      token: process.env.RUANGWA_TOKEN!,
    }),
  });

  const response = await notif.json();

  if (response.result == "true") {
    return { ok: true, message: response.message };
  } else {
    console.log("error : ", response.message);
    return { ok: false, message: response.message };
  }
};

export const notifWa = async ({ phone, template }: INotifWa) => {
  const notif = await fetch(process.env.RUANGWA_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      token: process.env.RUANGWA_TOKEN!,
      number: generatePhoneNumber(phone),
      message: template,
    }),
  });

  const response = await notif.json();
  if (response.result) {
    return true;
  } else {
    console.log("error : ", response.message);
    return true;
  }
};

export const notifPengambilanSimpanan = async (
  props: INotifPengambilanSimpanan,
) => {
  try {
    let message: string = "";
    const phone = await getPhoneByEmail(props.anggotaId);

    if (!phone?.noTelp) {
      return true;
    }

    const simpanan: ITemplatePengambilanSimpanan = {
      name: phone.nama,
      unitGarapan: phone.unitKerja.namaUnitKerja,
      noPengambilanSimpanan: props.noPengambilanSimpanan,
      tanggalPengambilanSimpanan: props.tanggalPengambilanSimpanan,
      jenisPengambilanSimpanan: props.jenisPengambilanSimpanan,
      jumlahPengambilanSimpanan: props.jumlahPengambilanSimpanan,
      statusPengambilanSimpanan: props.statusPengambilanSimpanan,
    };

    switch (props.statusPengambilanSimpanan) {
      case "PENDING":
        message = templatePengambilanSimpanan(simpanan);
        break;
      case "APPROVED":
        message = templatePengambilanSimpananApproved(simpanan);
        break;
      case "REJECTED":
        message = templatePengambilanSimpananRejected(simpanan);
        break;
      default:
        message = templatePengambilanSimpanan(simpanan);
        break;
    }

    const notificationData: INotifWa = {
      phone: phone.noTelp,
      template: message,
    };

    await notifWa(notificationData);

    if (props.statusPengambilanSimpanan === "PENDING") {
      const notifPetugas = await getPhoneByEmailRole();
      if (notifPetugas && notifPetugas.length > 0) {
        for (const petugas of notifPetugas) {
          if (!petugas.Anggota || !petugas.Anggota.noTelp) {
            return true;
          }

          const simpananPetugas: ITemplatePengambilanSimpananPetugas = {
            namaPetugas: petugas.Anggota?.nama,
            role: petugas.role,
            name: phone.nama,
            unitGarapan: phone.unitKerja.namaUnitKerja,
            noPengambilanSimpanan: props.noPengambilanSimpanan,
            tanggalPengambilanSimpanan: props.tanggalPengambilanSimpanan,
            jenisPengambilanSimpanan: props.jenisPengambilanSimpanan,
            jumlahPengambilanSimpanan: props.jumlahPengambilanSimpanan,
            statusPengambilanSimpanan: props.statusPengambilanSimpanan,
          };

          const notificationDataPetugas: INotifWa = {
            phone: petugas.Anggota?.noTelp,
            template: templatePengambilanSimpananPetugas(simpananPetugas),
          };

          await notifWa(notificationDataPetugas);
        }
      }
    }

    return true;
  } catch (error) {
    console.log("error notif : ", error);
    return false;
  }
};

export const notifPengajuanPinjaman = async (
  props: INotifPengajuanPinjaman,
) => {
  try {
    let message: string = "";
    const phone = await getPhoneByEmail(props.anggotaId);

    if (!phone?.noTelp) {
      return true;
    }

    const pinjaman: ITemplatePengajuanPinjaman = {
      name: phone.nama,
      unitGarapan: phone.unitKerja.namaUnitKerja,
      jenisPinjaman: props.jenisPinjaman,
      noPinjaman: props.noPinjaman,
      ajuanPinjaman: props.ajuanPinjaman,
      tanggalPinjaman: props.tanggalPinjaman,
      waktuPengembalian: props.waktuPengembalian,
      tujuanPinjaman: props.tujuanPinjaman,
      statusPinjaman: props.statusPinjaman,
    };

    switch (props.statusPinjaman) {
      case "PENDING":
        message = templatePengajuanPinjaman(pinjaman);
        break;
      case "APPROVED":
        message = templatePengajuanPinjamanApproved(pinjaman);
        break;
      case "REJECTED":
        message = templatePengajuanPinjamanRejected(pinjaman);
        break;
      default:
        message = templatePengajuanPinjaman(pinjaman);
        break;
    }

    const notificationData: INotifWa = {
      phone: phone.noTelp,
      template: message,
    };

    await notifWa(notificationData);

    if (props.statusPinjaman === "PENDING") {
      const notifPetugas = await getPhoneByEmailRole();
      if (notifPetugas && notifPetugas.length > 0) {
        for (const petugas of notifPetugas) {
          if (!petugas.Anggota || !petugas.Anggota.noTelp) {
            return true;
          }

          const pinjamanPetugas: ITemplatePengajuanPinjamanPetugas = {
            namaPetugas: petugas.Anggota.nama,
            role: petugas.role,
            name: phone.nama,
            unitGarapan: phone.unitKerja.namaUnitKerja,
            jenisPinjaman: props.jenisPinjaman,
            noPinjaman: props.noPinjaman,
            ajuanPinjaman: props.ajuanPinjaman,
            tanggalPinjaman: props.tanggalPinjaman,
            waktuPengembalian: props.waktuPengembalian,
            tujuanPinjaman: props.tujuanPinjaman,
            statusPinjaman: props.statusPinjaman,
          };

          const notificationDataPetugas: INotifWa = {
            phone: petugas.Anggota?.noTelp,
            template: templatePengajuanPinjamanPetugas(pinjamanPetugas),
          };

          await notifWa(notificationDataPetugas);
        }
      }
    }
    return true;
  } catch (error) {
    console.log("error notif : ", error);
    return false;
  }
};

interface INotifPengumumamSimpanan {
  namaPendaftaran: string;
  jenisPendaftaran: string;
  tanggalAwalSimpanan: Date;
  tanggalAkhirSimpanan: Date;
  tanggalTutupPendaftaran: Date;
  createdAt: Date;
}

export const notifPengumumamSimpanan = async (
  props: INotifPengumumamSimpanan,
) => {
  try {
    const users = await getListPhone();
    if (users && users.length > 0) {
      for (const user of users) {
        if (!user.noTelp) {
          return true;
        }
        const dataPengumunan: ITemplatePengumumamPendaftaranSimpanan = {
          name: user.nama,
          namaPendaftaran: props.namaPendaftaran,
          jenisPendaftaran: props.jenisPendaftaran,
          tanggalAwalSimpanan: props.tanggalAwalSimpanan,
          tanggalAkhirSimpanan: props.tanggalAkhirSimpanan,
          tanggalTutupPendaftaran: props.tanggalTutupPendaftaran,
          createdAt: props.createdAt,
        };
        const notificationData: INotifWa = {
          phone: user.noTelp,
          template: templatePengumumamPendaftaranSimpanan(dataPengumunan),
        };

        await notifWa(notificationData);
      }
    }
    return true;
  } catch (error) {
    console.log("error notif : ", error);
    return false;
  }
};

type TGroupSimpananData = {
  nama: string;
  noAnggota: string;
  noTelp: string | null;
  simpanan: TSimpanan[];
};

type TGroupAngsuranData = {
  nama: string;
  noAnggota: string;
  noTelp: string | null;
  angsuran: TSplitAngsuran[];
};

export const notifPotonganGaji = async (
  dataSimpanan: TSimpanan[],
  dataAngsuran: TSplitAngsuran[],
) => {
  try {
    const users = await getListPhone();
    if (users && users.length > 0) {
      if (dataSimpanan.length > 0) {
        const groupSimpanan: TGroupSimpananData[] = users.map((user) => ({
          ...user,
          simpanan: dataSimpanan.filter(
            (simpanan) => simpanan.anggotaId === user.noAnggota,
          ),
        }));
        for (const simpanan of groupSimpanan) {
          if (!simpanan.noTelp) {
            return true;
          }
          const dataTemplatePotonganSimpanan: ITemplatePotonganGajiSimpanan = {
            nama: simpanan.nama,
            simpanan: simpanan.simpanan,
          };
          const notificationSimpanan: INotifWa = {
            phone: simpanan.noTelp,
            template: templatePotonganGajiSimpanan(
              dataTemplatePotonganSimpanan,
            ),
          };
          await notifWa(notificationSimpanan);
        }
      }

      // yang tidak punya angsuran masih kirim
      if (dataAngsuran.length > 0) {
        const groupAngsuran: TGroupAngsuranData[] = users.map((user) => {
          const angsuranFiltered = dataAngsuran.filter(
            (angsuran) => angsuran.anggotaId === user.noAnggota,
          );

          return {
            ...user,
            noTelp: angsuranFiltered.length > 0 ? user.noTelp : null,
            angsuran: angsuranFiltered,
          };
        });
        for (const angsuran of groupAngsuran) {
          if (!angsuran.noTelp) {
            return true;
          }
          const dataTemplatePotonganAngsuran: ITemplatePotonganGajiAngsuran = {
            nama: angsuran.nama,
            angsuran: angsuran.angsuran,
          };
          const notificationAngsuran: INotifWa = {
            phone: angsuran.noTelp,
            template: templatePotonganGajiAngsuran(
              dataTemplatePotonganAngsuran,
            ),
          };
          await notifWa(notificationAngsuran);
        }
      }
    }
    return true;
  } catch (error) {
    console.log("error notif : ", error);
    return false;
  }
};

export const notifPelunasanPinjaman = async (
  props: INotifPelunasanPinjaman,
  maxPinjaman: TMaxPelunasanPinjaman,
  angsuran?: TListAngsuranPinjaman,
) => {
  try {
    let message: string = "";
    const isPass = calculatePelunasanPinjaman(maxPinjaman);
    const phone = await getPhoneByPinjamanId(props.pinjamanId);
    if (!phone?.noTelp) {
      return true;
    }

    const pelunasan: ITemplatePelunasanPinjaman = {
      name: phone.nama,
      unitGarapan: phone.unitKerja.namaUnitKerja,
      noPelunasanPinjaman: props.noPelunasanPinjaman,
      tanggalPelunasanPinjaman: props.tanggalPelunasanPinjaman,
      pinjamanId: props.pinjamanId,
      jenisPelunasanPinjaman: props.jenisPelunasanPinjaman,
      jumlahPelunasanPinjaman: props.jumlahPelunasanPinjaman,
      statusPelunasanPinjaman: props.statusPelunasanPinjaman,
      angsuranKe: isPass.angsuranKe,
      angsuranDari: isPass.angsuranDari,
      sudahDibayarkan: isPass.sudahDibayarkan,
      ajuanPinjaman: isPass.ajuanPinjaman,
    };

    switch (props.statusPelunasanPinjaman) {
      case "PENDING":
        message = templatePelunasanPinjaman(pelunasan);
        break;
      case "APPROVED":
        message = templatePelunasanPinjamanApproved(pelunasan);
        break;
      case "REJECTED":
        message = templatePelunasanPinjamanRejected(pelunasan);
        break;
      default:
        message = templatePelunasanPinjaman(pelunasan);
        break;
    }

    const notificationData: INotifWa = {
      phone: phone.noTelp,
      template: message,
    };

    await notifWa(notificationData);

    if (angsuran && props.statusPelunasanPinjaman === "APPROVED") {
      const angsuranData: ITemplateAngsuranPelunasanPinjaman = {
        nama: phone.nama,
        angsuran: angsuran,
      };
      const notificationAngsuranData: INotifWa = {
        phone: phone.noTelp,
        template: templateAngsuranPelunasanPinjaman(angsuranData),
      };

      await notifWa(notificationAngsuranData);
    }

    if (props.statusPelunasanPinjaman === "PENDING") {
      const notifPetugas = await getPhoneByEmailRole();
      if (notifPetugas && notifPetugas.length > 0) {
        for (const petugas of notifPetugas) {
          if (!petugas.Anggota || !petugas.Anggota.noTelp) {
            return true;
          }

          const pelunasanPetugas: ITemplatePelunasanPinjamanPetugas = {
            namaPetugas: petugas.Anggota.nama,
            role: petugas.role,
            name: phone.nama,
            unitGarapan: phone.unitKerja.namaUnitKerja,
            noPelunasanPinjaman: props.noPelunasanPinjaman,
            tanggalPelunasanPinjaman: props.tanggalPelunasanPinjaman,
            pinjamanId: props.pinjamanId,
            jenisPelunasanPinjaman: props.jenisPelunasanPinjaman,
            jumlahPelunasanPinjaman: props.jumlahPelunasanPinjaman,
            statusPelunasanPinjaman: props.statusPelunasanPinjaman,
            angsuranKe: isPass.angsuranKe,
            angsuranDari: isPass.angsuranDari,
            sudahDibayarkan: isPass.sudahDibayarkan,
            ajuanPinjaman: isPass.ajuanPinjaman,
          };

          const notificationDataPetugas: INotifWa = {
            phone: petugas.Anggota?.noTelp,
            template: templatePelunasanPinjamanPetugas(pelunasanPetugas),
          };

          await notifWa(notificationDataPetugas);
        }
      }
    }
    return true;
  } catch (error) {
    console.log("error notif : ", error);
    return false;
  }
};

interface INotifPengunduranAnggota {
  noPengunduran: string;
  anggotaId: string;
  tanggalPengunduran: Date;
  keterangan: string;
  jenisUndurDiri: "TRANSFER" | "CASH";
  biayaPengunduranDiri: number;
  simpananWajibPengunduranDiri: number;
  simpananManasukaPengunduranDiri: number;
  simpananLebaranPengunduranDiri: number;
  simpananQurbanPengunduranDiri: number;
  simpananUbarPengunduranDiri: number;
  totalPengunduranDiri: number;
  totalDiterimaPengunduranDiri: number;
  noUser: string;
  statusPengunduranDiri: "PENDING" | "APPROVED" | "REJECTED";
}

export const notifPengunduranAnggota = async (
  props: INotifPengunduranAnggota,
  pinjamanJasa: ICalculatePelunasanPinjaman | null,
  pinjamanBarang: ICalculatePelunasanPinjaman | null,
) => {
  try {
    let message: string = "";
    const phone = await getPhoneByEmail(props.anggotaId);
    if (!phone?.noTelp) {
      return true;
    }
    const undurDiri: ITemplatePengunduranAnggota = {
      nama: phone.nama,
      unitGarapan: phone.unitKerja.namaUnitKerja,
      tanggalPengunduran: props.tanggalPengunduran,
      keterangan: props.keterangan,
      wajib: props.simpananWajibPengunduranDiri,
      sukamana: props.simpananManasukaPengunduranDiri,
      lebaran: props.simpananLebaranPengunduranDiri,
      qurban: props.simpananQurbanPengunduranDiri,
      ubar: props.simpananUbarPengunduranDiri,
      biaya: props.biayaPengunduranDiri,
      totalKotor: props.totalPengunduranDiri,
      totalBersih: props.totalDiterimaPengunduranDiri,
      pinjamanJasa,
      pinjamanBarang,
    };

    switch (props.statusPengunduranDiri) {
      case "PENDING":
        message = templatePengunduranAnggota(undurDiri);
        break;
      case "APPROVED":
        message = templatePengunduranAnggotaApproved(undurDiri);
        break;
      case "REJECTED":
        message = templatePengunduranAnggotaRejected(undurDiri);
        break;
      default:
        message = templatePengunduranAnggota(undurDiri);
        break;
    }

    const notificationData: INotifWa = {
      phone: phone.noTelp,
      template: message,
    };

    await notifWa(notificationData);

    if (props.statusPengunduranDiri === "PENDING") {
      const notifPetugas = await getPhoneByEmailRole();
      if (notifPetugas && notifPetugas.length > 0) {
        for (const petugas of notifPetugas) {
          if (!petugas.Anggota || !petugas.Anggota.noTelp) {
            return true;
          }

          const pinjamanPetugas: ITemplatePengunduranPetugas = {
            namaPetugas: petugas.Anggota.nama,
            role: petugas.role,
            nama: phone.nama,
            unitGarapan: phone.unitKerja.namaUnitKerja,
            tanggalPengunduran: props.tanggalPengunduran,
            keterangan: props.keterangan,
            wajib: props.simpananWajibPengunduranDiri,
            sukamana: props.simpananManasukaPengunduranDiri,
            lebaran: props.simpananLebaranPengunduranDiri,
            qurban: props.simpananQurbanPengunduranDiri,
            ubar: props.simpananUbarPengunduranDiri,
            biaya: props.biayaPengunduranDiri,
            totalKotor: props.totalPengunduranDiri,
            totalBersih: props.totalDiterimaPengunduranDiri,
            pinjamanJasa,
            pinjamanBarang,
          };

          const notificationDataPetugas: INotifWa = {
            phone: petugas.Anggota?.noTelp,
            template: templatePengunduranPetugas(pinjamanPetugas),
          };

          await notifWa(notificationDataPetugas);
        }
      }
    }
  } catch (error) {
    console.log("error notif : ", error);
    return false;
  }
};
