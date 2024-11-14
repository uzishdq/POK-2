"use server";
import prisma from "@/lib/prisma";
import { getSesi } from "../session";

export const getUserbyEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        Anggota: {
          select: {
            nama: true,
          },
        },
      },
    });
    if (user) return user;
  } catch (error) {
    console.log("error data : ", error);
    return null;
  }
};

export const getUserbyId = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Anggota: {
          select: {
            noAnggota: true,
            nama: true,
          },
        },
      },
    });
    if (user) return user;
  } catch (error) {
    console.log("error data : ", error);
    return null;
  }
};

export const isYou = async (noAnggota: string) => {
  try {
    if (!noAnggota) return false;

    const session = await getSesi();

    if (!session) return false;

    const anggota = await prisma.anggota.findUnique({
      where: {
        noAnggota,
      },
      select: {
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!anggota) return false;

    return anggota.User.id === session.user.sub;
  } catch (error) {
    console.log("Verification failed : ", error);
    return false;
  }
};
