/*
  Warnings:

  - You are about to drop the column `AngsuranDariPotongGaji` on the `potonggaji` table. All the data in the column will be lost.
  - You are about to drop the column `AngsuranKePotongGaji` on the `potonggaji` table. All the data in the column will be lost.
  - You are about to drop the column `jumlahAngsuranPotongGaji` on the `potonggaji` table. All the data in the column will be lost.
  - You are about to drop the column `noPinjamanPotongGaji` on the `potonggaji` table. All the data in the column will be lost.
  - Added the required column `jenisPendaftaran` to the `pendaftaransimpanan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "jenisPelunasanPinjaman" AS ENUM ('TRANSFER', 'CASH');

-- CreateEnum
CREATE TYPE "statusPelunasanPinjaman" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "pendaftaransimpanan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "jenisPendaftaran" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "potonggaji" DROP COLUMN "AngsuranDariPotongGaji",
DROP COLUMN "AngsuranKePotongGaji",
DROP COLUMN "jumlahAngsuranPotongGaji",
DROP COLUMN "noPinjamanPotongGaji",
ADD COLUMN     "AngsuranDariBarangPotongGaji" INTEGER,
ADD COLUMN     "AngsuranDariJasaPotongGaji" INTEGER,
ADD COLUMN     "AngsuranKeBarangPotongGaji" INTEGER,
ADD COLUMN     "AngsuranKeJasaPotongGaji" INTEGER,
ADD COLUMN     "jumlahAngsuranBarangPotongGaji" INTEGER,
ADD COLUMN     "jumlahAngsuranJasaPotongGaji" INTEGER,
ADD COLUMN     "noPinjamanBarangPotongGaji" TEXT,
ADD COLUMN     "noPinjamanJasaPotongGaji" TEXT,
ADD COLUMN     "simpananUbarPotongGaji" INTEGER;

-- CreateTable
CREATE TABLE "PelunasanPinjaman" (
    "noPelunasanPinjaman" TEXT NOT NULL,
    "tanggalPelunasanPinjaman" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pinjamanId" TEXT NOT NULL,
    "buktiPelunasanPinjaman" TEXT,
    "jenisPelunasanPinjaman" "jenisPelunasanPinjaman" NOT NULL DEFAULT 'TRANSFER',
    "jumlahPelunasanPinjaman" INTEGER NOT NULL,
    "statusPelunasanPinjaman" "statusPelunasanPinjaman" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "PelunasanPinjaman_pkey" PRIMARY KEY ("noPelunasanPinjaman")
);

-- AddForeignKey
ALTER TABLE "PelunasanPinjaman" ADD CONSTRAINT "PelunasanPinjaman_pinjamanId_fkey" FOREIGN KEY ("pinjamanId") REFERENCES "pinjaman"("noPinjaman") ON DELETE RESTRICT ON UPDATE CASCADE;
