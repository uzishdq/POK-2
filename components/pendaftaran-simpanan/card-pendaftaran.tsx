import { PICTURES } from "@/lib/constan";
import { formatDatebyMonth } from "@/lib/helper";
import React from "react";
import { Button } from "../ui/button";
import { TPendaftaranSimpananCard } from "@/types/simpanan";
import FormPendaftaranSimpanan from "./form-pendaftaran-simpanan";
import Image from "next/image";

interface ICardPendaftaran {
  title: string;
  descriptions: string;
  type: string;
  data: TPendaftaranSimpananCard;
  id: string;
}

export default function CardPendaftaran({
  title,
  descriptions,
  type,
  data,
  id,
}: ICardPendaftaran) {
  const today = new Date();
  const isPass = new Date(data.tanggalTutupPendaftaran) > today;

  let picture;

  switch (type) {
    case "lebaran":
      picture = PICTURES.PENDAFTARAN_LEBARAN;
      break;
    case "qurban":
      picture = PICTURES.PENDAFTARAN_QURBAN;
      break;
    case "ulin bareng":
      picture = PICTURES.PENDAFTARAN_UBAR;
      break;
    default:
      break;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg p-4 shadow-lg">
      <div className="md:flex">
        <div className="md:w-[500px]">
          <Image
            src={picture!}
            alt="picture"
            className="w-full rounded-lg shadow-md"
            height={500}
            width={500}
            loading="lazy"
          />
        </div>
        <div className="space-y-4 py-4 md:w-1/2 md:px-6">
          <div className="text-xl font-bold">{title}</div>
          <p className="text-muted-foreground">{descriptions}</p>
          <p className="font-semibold text-red-600">
            Pendaftaran s/d : {formatDatebyMonth(data.tanggalTutupPendaftaran)}
          </p>
        </div>
        {isPass ? (
          <FormPendaftaranSimpanan
            anggotaId={id}
            value={data}
            title={title}
            type={type}
          />
        ) : (
          <Button className="bottom-0 right-0 mb-4 mr-4 w-full md:absolute md:w-auto xl:w-auto">
            Pendaftaran Ditutup
          </Button>
        )}
      </div>
    </div>
  );
}
