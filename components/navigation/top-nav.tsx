import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CircleUser, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  routeSimpanan,
  routePinjaman,
  PICTURES,
  ROUTES,
  routeDataMaster,
  routeSimpananPetugas,
  DEFAULT_LOGIN_REDIRECT,
  routePinjamanPetugas,
} from "@/lib/constan";
import MobileNav from "./mobile-nav";
import ButtonSignOut from "@/components/auth/button-signout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSesi } from "@/lib/session";

//kalo scroll kebawah masih belum kelihatan jelas pada table

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default async function TopNav() {
  const session = await getSesi();
  const userRole = session?.user.role;

  return (
    <div className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-10">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="top">
          <nav className="grid gap-6 text-lg font-medium">
            <div className="flex items-center justify-center gap-2">
              <span className="text-md sm:text-base md:text-lg lg:text-xl">
                <div className="grid space-x-1 lg:grid-cols-2">
                  <p>Koperasi Karyawan</p>
                  <p>Yayasan Al Ghifari</p>
                </div>
              </span>
            </div>
            <MobileNav userRole={userRole!} />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Image src={PICTURES.LOGO} width={60} height={60} alt="logo" />
        <div className="grid gap-1 sm:text-base lg:grid-cols-2 lg:text-lg">
          <p>Koperasi Karyawan</p>
          <p>Yayasan Al Ghifari</p>
        </div>
      </div>
      <div className="hidden items-center space-x-4 font-medium md:block">
        <Button asChild variant="ghost">
          <Link href={DEFAULT_LOGIN_REDIRECT} className="font-semibold">
            Dashboard
          </Link>
        </Button>
        {userRole != "USER" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-semibold">
                Petugas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Menu Petugas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.PETUGAS.INDEX} className="w-full">
                  Dashboard Petugas
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Data Master</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {routeDataMaster.map((item) => (
                        <DropdownMenuItem asChild key={item.href}>
                          <Link href={item.href} className="w-full">
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              {userRole != "SEKRETARIS" ? (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>Simpanan Anggota</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {routeSimpananPetugas.map((item) => (
                            <DropdownMenuItem asChild key={item.href}>
                              <Link href={item.href} className="w-full">
                                {item.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>Pinjaman Anggota</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {routePinjamanPetugas.map((item) => (
                            <DropdownMenuItem asChild key={item.href}>
                              <Link href={item.href} className="w-full">
                                {item.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={ROUTES.PETUGAS.POTONGAN_GAJI}
                      className="w-full"
                    >
                      Potongan Gaji
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.PETUGAS.LAPORAN} className="w-full">
                      Laporan
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.PETUGAS.PENGUNDURAN.PENGUNDURAN_ANGGOTA}
                  className="w-full"
                >
                  Pengunduran Anggota
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="font-semibold">
              Simpanan
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>List Simpanan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {routeSimpanan.map((item) => (
              <DropdownMenuItem asChild key={item.name}>
                <Link href={item.href} className="w-full">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="font-semibold">
              Pinjaman
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>List Pinjaman</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {routePinjaman.map((item) => (
              <DropdownMenuItem asChild key={item.name}>
                <Link href={item.href} className="w-full">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <p className="hidden md:block">{session?.user?.name}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={ROUTES.PROFILE} className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={ROUTES.RESIGN} className="w-full">
                Undur Diri
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ButtonSignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
