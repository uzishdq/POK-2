"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import {
  routeSimpanan,
  routePinjaman,
  ROUTES,
  routeDataMaster,
  routeSimpananPetugas,
  routePinjamanPetugas,
  DEFAULT_LOGIN_REDIRECT,
  routeLainyaPetugas,
} from "@/lib/constan";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface IMobileNav {
  userRole: string;
}

export default function MobileNav({ userRole }: IMobileNav) {
  const [openSimpanan, setOpenSimpanan] = useState(false);
  const [openPinjaman, setOpenPinjaman] = useState(false);
  const [openPetugas, setOpenPetugas] = useState(false);
  const [openMaster, setOpenMaster] = useState(false);
  const [openSimpananPetugas, setOpenSimpananPetugas] = useState(false);
  const [openPinjamanPetugas, setOpenPinjamanPetugas] = useState(false);
  const [openLainya, setOpenLainya] = useState(false);
  return (
    <ScrollArea className="max-h-96 whitespace-nowrap">
      <div className="space-y-2">
        <SheetClose
          asChild
          className="flex items-center justify-center rounded-sm border shadow-sm"
        >
          <Button
            asChild
            variant="ghost"
            className="w-full text-sm font-semibold"
          >
            <Link href={DEFAULT_LOGIN_REDIRECT}>Dashboard</Link>
          </Button>
        </SheetClose>

        {userRole && userRole != "USER" ? (
          <Collapsible
            open={openPetugas}
            onOpenChange={setOpenPetugas}
            className="space-y-2"
          >
            <div className="flex items-center justify-between rounded-sm border shadow-sm">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full gap-4 ">
                  <h4 className="text-sm font-semibold">Petugas</h4>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <SheetClose asChild>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full rounded-sm border shadow-sm"
                >
                  <Link href={ROUTES.PETUGAS.INDEX}>Dashboard Petugas</Link>
                </Button>
              </SheetClose>
              <Collapsible
                open={openMaster}
                onOpenChange={setOpenMaster}
                className="space-y-2"
              >
                <div className="flex items-center justify-between rounded-sm border shadow-sm ">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full gap-4">
                      <h4 className="text-sm font-semibold">Data Master</h4>
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  {routeDataMaster.map((item) => (
                    <div
                      key={item.href}
                      className="mb-2 rounded-sm border shadow-sm"
                    >
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full bg-black text-white"
                        >
                          <Link href={item.href}>{item.name}</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              {userRole && userRole != "SEKRETARIS" ? (
                <>
                  <Collapsible
                    open={openSimpananPetugas}
                    onOpenChange={setOpenSimpananPetugas}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between rounded-sm border shadow-sm">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full gap-4">
                          <h4 className="text-sm font-semibold">
                            Simpanan Anggota
                          </h4>
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                      {routeSimpananPetugas.map((item) => (
                        <div
                          key={item.href}
                          className="mb-2 rounded-sm border shadow-sm"
                        >
                          <SheetClose asChild>
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full bg-black text-white"
                            >
                              <Link href={item.href}>{item.name}</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible
                    open={openPinjamanPetugas}
                    onOpenChange={setOpenPinjamanPetugas}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between rounded-sm border shadow-sm">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full gap-4">
                          <h4 className="text-sm font-semibold">
                            Pinjaman Anggota
                          </h4>
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                      {routePinjamanPetugas.map((item) => (
                        <div
                          key={item.href}
                          className="mb-2 rounded-sm border shadow-sm"
                        >
                          <SheetClose asChild>
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full bg-black text-white"
                            >
                              <Link href={item.href}>{item.name}</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible
                    open={openLainya}
                    onOpenChange={setOpenLainya}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between rounded-sm border shadow-sm">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full gap-4">
                          <h4 className="text-sm font-semibold">Lainya</h4>
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                      {routeLainyaPetugas.map((item) => (
                        <div
                          key={item.href}
                          className="mb-2 rounded-sm border shadow-sm"
                        >
                          <SheetClose asChild>
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full bg-black text-white"
                            >
                              <Link href={item.href}>{item.name}</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </>
              ) : null}
              <SheetClose asChild>
                <Button
                  asChild
                  variant="ghost"
                  className="mb-2 w-full rounded-sm border shadow-sm "
                >
                  <Link href={ROUTES.PETUGAS.PENGUNDURAN.PENGUNDURAN_ANGGOTA}>
                    Pengunduran Anggota
                  </Link>
                </Button>
              </SheetClose>
            </CollapsibleContent>
          </Collapsible>
        ) : null}

        <Collapsible
          open={openSimpanan}
          onOpenChange={setOpenSimpanan}
          className="space-y-2"
        >
          <div className="flex items-center justify-between rounded-sm border shadow-sm">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full gap-4">
                <h4 className="text-sm font-semibold">Simpanan</h4>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            {routeSimpanan.map((item) => (
              <div key={item.href} className="mb-2 rounded-sm border shadow-sm">
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full bg-black text-white"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                </SheetClose>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        <Collapsible
          open={openPinjaman}
          onOpenChange={setOpenPinjaman}
          className="space-y-2"
        >
          <div className="flex items-center justify-between rounded-sm border shadow-sm">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full gap-4">
                <h4 className="text-sm font-semibold">Pinjaman</h4>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            {routePinjaman.map((item) => (
              <div key={item.href} className="mb-2 rounded-sm border shadow-sm">
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full bg-black text-white"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                </SheetClose>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
  );
}
