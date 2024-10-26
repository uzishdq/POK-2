import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LABEL, PICTURES } from "@/lib/constan";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

type CardWrapperAuthProps = {
  children: React.ReactNode;
  backButtonLabel: string;
  backButtonHref: string;
};

export default function CardWrapperAuth({
  children,
  backButtonHref,
  backButtonLabel,
}: CardWrapperAuthProps) {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="items-center justify-center text-center">
        <Image
          src={PICTURES.LOGO}
          height={100}
          width={100}
          alt="logo koperasi"
          loading="lazy"
        />
        <CardTitle className="text-3xl">{LABEL.CARD.HEADER}</CardTitle>
        <CardDescription>{LABEL.CARD.DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button className="w-full text-sm" variant="link" size="sm">
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
