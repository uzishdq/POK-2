-- CreateEnum
CREATE TYPE "statusPotongan" AS ENUM ('APPROVED', 'SUCCESS');

-- CreateEnum
CREATE TYPE "statusPekerjaan" AS ENUM ('TETAP', 'KONTRAK', 'HONORER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'BENDAHARA', 'SEKRETARIS');

-- CreateEnum
CREATE TYPE "statusUser" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "statusPengambilanSimpanan" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "statusPinjaman" AS ENUM ('PENDING', 'PENDINGYAYASAN', 'APPROVED', 'COMPLETED', 'NOTCOMPLETE', 'REJECTED');

-- CreateEnum
CREATE TYPE "jenisPinjaman" AS ENUM ('JASA', 'BARANG');

-- CreateEnum
CREATE TYPE "statusAngsuranPinjaman" AS ENUM ('ONPROGRESS', 'COMPLETED', 'NOTCOMPLETE');

-- CreateEnum
CREATE TYPE "statusAnggota" AS ENUM ('ACTIVE', 'NOTACTIVE');

-- CreateEnum
CREATE TYPE "statusPendaftaran" AS ENUM ('OPEN', 'CLOSE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "statusUser" "statusUser" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jabatan" (
    "noJabatan" SERIAL NOT NULL,
    "namaJabatan" VARCHAR(255) NOT NULL,

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("noJabatan")
);

-- CreateTable
CREATE TABLE "unitkerja" (
    "noUnitKerja" SERIAL NOT NULL,
    "namaUnitKerja" VARCHAR(255) NOT NULL,
    "alamatKantor" VARCHAR(300) NOT NULL,

    CONSTRAINT "unitkerja_pkey" PRIMARY KEY ("noUnitKerja")
);

-- CreateTable
CREATE TABLE "anggota" (
    "noAnggota" TEXT NOT NULL,
    "nik" VARCHAR(17),
    "nip" VARCHAR(17),
    "nama" VARCHAR(255) NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "tempatLahir" VARCHAR(25) NOT NULL,
    "jenisKelamin" VARCHAR(10) NOT NULL,
    "alamat" VARCHAR(300),
    "noTelp" VARCHAR(13),
    "jabatanId" INTEGER NOT NULL,
    "statusPekerjaan" "statusPekerjaan" NOT NULL DEFAULT 'TETAP',
    "unitKerjaId" INTEGER NOT NULL,
    "namaBank" VARCHAR(10),
    "noRek" VARCHAR(50),
    "pilManasuka" INTEGER,
    "userEmail" TEXT NOT NULL,
    "statusAnggota" "statusAnggota" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "anggota_pkey" PRIMARY KEY ("noAnggota")
);

-- CreateTable
CREATE TABLE "pengundurandiri" (
    "noPengunduran" TEXT NOT NULL,
    "anggotaId" TEXT NOT NULL,
    "tanggalPengunduran" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" VARCHAR(255) NOT NULL,
    "noUser" INTEGER NOT NULL,

    CONSTRAINT "pengundurandiri_pkey" PRIMARY KEY ("noPengunduran")
);

-- CreateTable
CREATE TABLE "simpanan" (
    "noSimpanan" TEXT NOT NULL,
    "anggotaId" TEXT NOT NULL,
    "tanggalSimpanan" TIMESTAMP(3) NOT NULL,
    "jenisSimpanan" VARCHAR(20) NOT NULL,
    "basil" INTEGER NOT NULL,
    "jumlahSimpanan" INTEGER NOT NULL,

    CONSTRAINT "simpanan_pkey" PRIMARY KEY ("noSimpanan")
);

-- CreateTable
CREATE TABLE "pengambilansimpanan" (
    "noPengambilanSimpanan" TEXT NOT NULL,
    "anggotaId" TEXT NOT NULL,
    "tanggalPengambilanSimpanan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jenisPengambilanSimpanan" VARCHAR(20) NOT NULL,
    "jumlahPengambilanSimpanan" INTEGER NOT NULL,
    "statusPengambilanSimpanan" "statusPengambilanSimpanan" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "pengambilansimpanan_pkey" PRIMARY KEY ("noPengambilanSimpanan")
);

-- CreateTable
CREATE TABLE "pendaftaransimpanan" (
    "noPendaftaran" SERIAL NOT NULL,
    "namaPendaftaran" VARCHAR(255) NOT NULL,
    "tanggalAwalSimpanan" TIMESTAMP(3) NOT NULL,
    "tanggalAkhirSimpanan" TIMESTAMP(3) NOT NULL,
    "tanggalTutupPendaftaran" TIMESTAMP(3) NOT NULL,
    "statusPendaftaran" "statusPendaftaran" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "pendaftaransimpanan_pkey" PRIMARY KEY ("noPendaftaran")
);

-- CreateTable
CREATE TABLE "pendaftar" (
    "noPendaftar" SERIAL NOT NULL,
    "anggotaId" TEXT NOT NULL,
    "pendaftaranId" INTEGER NOT NULL,
    "jumlahPilihan" INTEGER NOT NULL,

    CONSTRAINT "pendaftar_pkey" PRIMARY KEY ("noPendaftar")
);

-- CreateTable
CREATE TABLE "pinjaman" (
    "noPinjaman" TEXT NOT NULL,
    "anggotaId" TEXT NOT NULL,
    "tanggalPinjaman" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tujuanPinjaman" VARCHAR(255) NOT NULL,
    "waktuPengembalian" INTEGER NOT NULL,
    "jenisPinjaman" "jenisPinjaman" NOT NULL DEFAULT 'JASA',
    "ajuanPinjaman" INTEGER NOT NULL,
    "jumlahDiterima" INTEGER NOT NULL,
    "strukGaji" TEXT NOT NULL,
    "jumlahPenghasilan" INTEGER NOT NULL,
    "statusPinjaman" "statusPinjaman" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "pinjaman_pkey" PRIMARY KEY ("noPinjaman")
);

-- CreateTable
CREATE TABLE "asuransi" (
    "noAsuransi" SERIAL NOT NULL,
    "pinjamanId" TEXT NOT NULL,
    "usiaAsuransi" INTEGER NOT NULL,
    "tanggalAsuransi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalAkhirAsuransi" TIMESTAMP(3) NOT NULL,
    "masaAsuransiTH" INTEGER NOT NULL,
    "masaAsuransiBL" INTEGER NOT NULL,
    "masaAsuransiJK" INTEGER NOT NULL,
    "premi" INTEGER NOT NULL,

    CONSTRAINT "asuransi_pkey" PRIMARY KEY ("noAsuransi")
);

-- CreateTable
CREATE TABLE "angsuranpinjaman" (
    "noAngsuranPinjaman" TEXT NOT NULL,
    "tanggalAngsuranPinjaman" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pinjamanId" TEXT NOT NULL,
    "angsuranPinjamanKe" INTEGER NOT NULL,
    "angsuranPinjamanDari" INTEGER NOT NULL,
    "jumlahAngsuranPinjaman" INTEGER NOT NULL,
    "statusAngsuranPinjaman" "statusAngsuranPinjaman" NOT NULL DEFAULT 'ONPROGRESS',

    CONSTRAINT "angsuranpinjaman_pkey" PRIMARY KEY ("noAngsuranPinjaman")
);

-- CreateTable
CREATE TABLE "master" (
    "idMaster" SERIAL NOT NULL,
    "emailMaster" TEXT,
    "nipMaster" TEXT,
    "nikMaster" TEXT,
    "namaMaster" TEXT NOT NULL,
    "tempatLahirMaster" TEXT NOT NULL,
    "tanggalLahirMaster" TIMESTAMP(3) NOT NULL,
    "jenisKelaminMaster" TEXT NOT NULL,
    "alamatMaster" TEXT,
    "statusPekerjaanMaster" "statusPekerjaan" NOT NULL DEFAULT 'TETAP',
    "unitKerjaMaster" INTEGER NOT NULL,
    "jabatanMaster" INTEGER NOT NULL,

    CONSTRAINT "master_pkey" PRIMARY KEY ("idMaster")
);

-- CreateTable
CREATE TABLE "potonggaji" (
    "idPotonganGaji" SERIAL NOT NULL,
    "tanggalPotonganGaji" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anggotaIdPotongGaji" TEXT,
    "namaPotongGaji" TEXT,
    "unitGarapanPotongGaji" TEXT,
    "simpananWajibPotongGaji" INTEGER,
    "simpananManasukaPotongGaji" INTEGER,
    "simpananLebaranPotongGaji" INTEGER,
    "simpananQurbanPotongGaji" INTEGER,
    "noPinjamanPotongGaji" TEXT,
    "AngsuranKePotongGaji" INTEGER,
    "AngsuranDariPotongGaji" INTEGER,
    "jumlahAngsuranPotongGaji" INTEGER,
    "totalPotongGaji" INTEGER,
    "statusPotonganGaji" "statusPotongan" NOT NULL DEFAULT 'APPROVED',

    CONSTRAINT "potonggaji_pkey" PRIMARY KEY ("idPotonganGaji")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "anggota_userEmail_key" ON "anggota"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "pengundurandiri_anggotaId_key" ON "pengundurandiri"("anggotaId");

-- CreateIndex
CREATE UNIQUE INDEX "master_emailMaster_key" ON "master"("emailMaster");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_email_key" ON "verificationtokens"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "anggota" ADD CONSTRAINT "anggota_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "jabatan"("noJabatan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota" ADD CONSTRAINT "anggota_unitKerjaId_fkey" FOREIGN KEY ("unitKerjaId") REFERENCES "unitkerja"("noUnitKerja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota" ADD CONSTRAINT "anggota_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengundurandiri" ADD CONSTRAINT "pengundurandiri_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "anggota"("noAnggota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simpanan" ADD CONSTRAINT "simpanan_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "anggota"("noAnggota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengambilansimpanan" ADD CONSTRAINT "pengambilansimpanan_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "anggota"("noAnggota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftar" ADD CONSTRAINT "pendaftar_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "pendaftaransimpanan"("noPendaftaran") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftar" ADD CONSTRAINT "pendaftar_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "anggota"("noAnggota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinjaman" ADD CONSTRAINT "pinjaman_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "anggota"("noAnggota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asuransi" ADD CONSTRAINT "asuransi_pinjamanId_fkey" FOREIGN KEY ("pinjamanId") REFERENCES "pinjaman"("noPinjaman") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "angsuranpinjaman" ADD CONSTRAINT "angsuranpinjaman_pinjamanId_fkey" FOREIGN KEY ("pinjamanId") REFERENCES "pinjaman"("noPinjaman") ON DELETE RESTRICT ON UPDATE CASCADE;
