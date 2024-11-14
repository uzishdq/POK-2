"use client";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TChartBarSimpanan } from "@/types/simpanan";

interface IChartSimpananAnggota {
  value: TChartBarSimpanan;
}

export default function ChartSimpananAnggota(props: IChartSimpananAnggota) {
  const chartData = [
    {
      simpanan: "wajib",
      jumlah: props.value.wajib,
      fill: "var(--color-wajib)",
    },
    {
      simpanan: "sukamana",
      jumlah: props.value.sukamana,
      fill: "var(--color-sukamana)",
    },
    {
      simpanan: "lebaran",
      jumlah: props.value.lebaran,
      fill: "var(--color-lebaran)",
    },
    {
      simpanan: "qurban",
      jumlah: props.value.qurban,
      fill: "var(--color-qurban)",
    },
    {
      simpanan: "ubar",
      jumlah: props.value.ubar,
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
        <CardTitle>Progress Simpanan</CardTitle>
        <CardDescription>
          Berikut adalah perkembangan simpanan anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4 ">
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
    </Card>
  );
}
