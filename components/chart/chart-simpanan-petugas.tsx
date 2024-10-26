"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import { formatDatebyMonth, formatToIDR } from "@/lib/helper";
import { TAllBalanceSimpanan } from "@/types/simpanan";

interface IChartSimpananPetugas {
  value: TAllBalanceSimpanan | null;
}

export function ChartSimpananPetugas({ value }: IChartSimpananPetugas) {
  const date = formatDatebyMonth(new Date());
  const chartData = [
    {
      simpanan: "wajib",
      jumlah: value?.wajib?.balance ?? 0,
      fill: "var(--color-wajib)",
    },
    {
      simpanan: "sukamana",
      jumlah: value?.sukamana?.balance ?? 0,
      fill: "var(--color-sukamana)",
    },
    {
      simpanan: "lebaran",
      jumlah: value?.lebaran?.balance ?? 0,
      fill: "var(--color-lebaran)",
    },
    {
      simpanan: "qurban",
      jumlah: value?.qurban?.balance ?? 0,
      fill: "var(--color-qurban)",
    },
    {
      simpanan: "ubar",
      jumlah: value?.ubar?.balance ?? 0,
      fill: "var(--color-ubar)",
    },
  ];

  const chartConfig = {
    jumlah: {
      label: "Saldo",
    },
    wajib: {
      label: "Wajib",
      color: "hsl(var(--chart-1))",
    },
    sukamana: {
      label: "Sukamana",
      color: "hsl(var(--chart-2))",
    },
    lebaran: {
      label: "Lebaran",
      color: "hsl(var(--chart-3))",
    },
    qurban: {
      label: "Qurban",
      color: "hsl(var(--chart-4))",
    },
    ubar: {
      label: "Ubar",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldo Simpanan Anggota</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[200px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            barSize={32}
            barGap={2}
          >
            <YAxis
              dataKey="simpanan"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="jumlah" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="jumlah" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Saldo Simpanan Anggota {formatToIDR(value?.totalBalance ?? 0)}
        </div>
        <div className="leading-none text-muted-foreground">
          Pengambilan Simpanan {formatToIDR(value?.totalPengambilan ?? 0)}
        </div>
      </CardFooter>
    </Card>
  );
}
