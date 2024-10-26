"use server";
import prisma from "@/lib/prisma";

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
