"use client";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { TChartBarSimpanan } from "@/types/simpanan";
import { formatToIDR } from "@/lib/helper";

interface IChartSimpananAnggota {
  value: TChartBarSimpanan;
}

export default function ChartSimpananAnggota(props: IChartSimpananAnggota) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Simpanan</CardTitle>
        <CardDescription>
          Berikut adalah perkembangan simpanan anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4 ">
        <ChartContainer
          config={{
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
          }}
          className="h-[200px] w-full"
        >
          <BarChart
            margin={{
              left: 10,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={[
              {
                activity: "wajib",
                value: props.value.wajib,
                label: formatToIDR(props.value.wajib),
                fill: "var(--color-wajib)",
              },
              {
                activity: "sukamana",
                value: props.value.sukamana,
                label: formatToIDR(props.value.sukamana),
                fill: "var(--color-sukamana)",
              },
              {
                activity: "lebaran",
                value: props.value.lebaran,
                label: formatToIDR(props.value.lebaran),
                fill: "var(--color-lebaran)",
              },
              {
                activity: "qurban",
                value: props.value.qurban,
                label: formatToIDR(props.value.qurban),
                fill: "var(--color-qurban)",
              },
              {
                activity: "ubar",
                value: props.value.ubar,
                label: formatToIDR(props.value.ubar),
                fill: "var(--color-ubar)",
              },
            ]}
            layout="vertical"
            barSize={32}
            barGap={2}
          >
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="activity"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              className="font-semibold capitalize"
            />
            <Bar dataKey="value" radius={5}>
              <LabelList
                position="insideLeft"
                dataKey="label"
                fill="white"
                offset={8}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
