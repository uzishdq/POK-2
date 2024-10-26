"use client";

import { notifPengambilanSimpanan } from "@/lib/action/notifikasi";
import { Button } from "./ui/button";

const Coba = () => {
  const onSubmit = () => {
    console.log("hallo");
  };

  return <Button onClick={() => onSubmit()}>kirim wa</Button>;
};

export default Coba;
