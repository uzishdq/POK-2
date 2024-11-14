"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TChartBarPinjaman } from "@/types/pinjaman";
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";

interface IChartPinjamanAnggota {
  data: TChartBarPinjaman | null;
}

const chartConfig = {
  angsuran: {
    label: "Angsuran",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const chartConfig2 = {
  angsuran: {
    label: "Angsuran",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function ChartPinjamanAnggota({ data }: IChartPinjamanAnggota) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
      {data && data.produktif && data.produktif.angsuran.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Progress Pinjaman Produktif</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={data.produktif.angsuran}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => formatDatebyMonth(value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="angsuran"
                  fill="var(--color-angsuran)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Anda telah membayar angsuran{" "}
              {formatToIDR(data.produktif.sudahDibayarkan)} untuk pinjaman
              produktif Anda.
            </div>
            <div className="leading-none text-muted-foreground">
              Sisa pinjaman yang harus dilunasi adalah{" "}
              {formatToIDR(data.produktif.jumlahPelunasan)}
            </div>
          </CardFooter>
        </Card>
      ) : null}
      {data && data.barang && data.barang.angsuran.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Progress Pinjaman Barang</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig2}>
              <BarChart accessibilityLayer data={data.barang.angsuran}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => formatDatebyMonth(value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="angsuran"
                  fill="var(--color-angsuran)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Anda telah membayar angsuran{" "}
              {formatToIDR(data.barang.sudahDibayarkan)} untuk pinjaman barang
              Anda.
            </div>
            <div className="leading-none text-muted-foreground">
              Sisa pinjaman yang harus dilunasi adalah{" "}
              {formatToIDR(data.barang.jumlahPelunasan)}
            </div>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  );
}
