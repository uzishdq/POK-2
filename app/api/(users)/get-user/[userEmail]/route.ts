import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { userEmail: string } }
) {
  try {
    const getAnggota = await prisma.anggota.findFirst({
      where: {
        userEmail: params.userEmail,
      },
    });

    if (getAnggota) {
      return NextResponse.json({ ok: true, value: getAnggota });
    } else {
      return NextResponse.json({ ok: false, value: [] });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export { handler as GET };
