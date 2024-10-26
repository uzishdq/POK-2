"use client";
import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TChartBarPinjaman } from "@/types/pinjaman";
import { formatToIDR } from "@/lib/helper";

interface IChartPinjamanAnggota {
  data: TChartBarPinjaman | null;
}
// average step masih belum sesuai ganti dengan average angsuran kalo bisa
export default function ChartPinjamanAnggota({ data }: IChartPinjamanAnggota) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
      {data && data.produktif && data.produktif.angsuran.length > 0 ? (
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="tabular-nums">
              Progress Pinjaman Produktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                angsuran: {
                  label: "Angsuran",
                  color: "hsl(var(--chart-5))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={data.produktif.angsuran}
              >
                <Bar
                  dataKey="angsuran"
                  fill="var(--color-angsuran)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                  }}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                  cursor={false}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Progress pinjaman produktif Anda menunjukkan bahwa Anda telah
              membayar angsuran sebesar{" "}
              {formatToIDR(data.produktif.sudahDibayarkan)} . Saat ini, saldo
              pinjaman yang tersisa adalah{" "}
              {formatToIDR(data.produktif.jumlahPelunasan)} yang masih harus
              dilunasi.
            </CardDescription>
          </CardFooter>
        </Card>
      ) : null}
      {data && data.barang && data.barang.angsuran.length > 0 ? (
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="tabular-nums">
              Progress Pinjaman Barang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                angsuran: {
                  label: "Angsuran",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={data.barang.angsuran}
              >
                <Bar
                  dataKey="angsuran"
                  fill="var(--color-angsuran)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                  }}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={1200}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label
                    position="insideBottomLeft"
                    value="Average Steps"
                    offset={10}
                    fill="hsl(var(--foreground))"
                  />
                  <Label
                    position="insideTopLeft"
                    value="12,343"
                    className="text-lg"
                    fill="hsl(var(--foreground))"
                    offset={10}
                    startOffset={100}
                  />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Progress pinjaman barang Anda menunjukkan bahwa Anda telah
              membayar angsuran sebesar{" "}
              {formatToIDR(data.barang.sudahDibayarkan)} . Saat ini, saldo
              pinjaman yang tersisa adalah{" "}
              {formatToIDR(data.barang.jumlahPelunasan)} yang masih harus
              dilunasi.
            </CardDescription>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  );
}
