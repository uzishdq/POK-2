"use client";

import { Pie, PieChart } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { formatDatebyMonth } from "@/lib/helper";

type TPinjamanValues = {
  hasil: number;
  approved: number | null;
  completed: number | null;
  pending: number | null;
} | null;

interface IChartPinjamanPetugas {
  value: TPinjamanValues;
  title: string;
}

export function ChartPinjamanPetugas({ value, title }: IChartPinjamanPetugas) {
  const date = formatDatebyMonth(new Date());
  const chartData = [
    {
      pinjaman: "pending",
      jumlah: value?.pending ?? 0,
      fill: "var(--color-pending)",
    },
    {
      pinjaman: "berjalan",
      jumlah: value?.approved ?? 0,
      fill: "var(--color-berjalan)",
    },
    {
      pinjaman: "selesai",
      jumlah: value?.completed ?? 0,
      fill: "var(--color-selesai)",
    },
  ];

  const chartConfig = {
    jumlah: {
      label: "jumlah",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-1))",
    },
    berjalan: {
      label: "Berjalan",
      color: "hsl(var(--chart-2))",
    },
    selesai: {
      label: "Selesai",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="jumlah" label nameKey="pinjaman" />
            <ChartLegend
              content={<ChartLegendContent nameKey="pinjaman" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Keseluruhan {title} : {value?.hasil ?? 0}
        </div>
      </CardFooter>
    </Card>
  );
}
