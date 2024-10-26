"use server";

import { getServerSession } from "next-auth";
import { cache } from "react";
import { authOptions } from "./auth";

export const getSesi = cache(async () => {
  const sesion = await getServerSession(authOptions);
  return sesion;
});
