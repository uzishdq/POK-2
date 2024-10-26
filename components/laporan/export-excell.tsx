"use client";
import React from "react";
import * as xlsx from "xlsx";
import { Button } from "../ui/button";
import { FileDown } from "lucide-react";
import { TColumnLaporan } from "@/types/potongan";
import { formatDatebyMonth } from "@/lib/helper";
import { useToast } from "../ui/use-toast";

interface IExportExcell<T> {
  fileName: string;
  title: string;
  buttonLabel: string;
  data: T[];
  columns: TColumnLaporan[];
}

export default function ExportExcell<T>({
  data,
  columns,
  fileName,
  title,
  buttonLabel,
}: IExportExcell<T>) {
  const { toast } = useToast();

  const handleDownload = () => {
    if (data.length > 0) {
      const dateNow = formatDatebyMonth(new Date());
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.aoa_to_sheet([[""]]);

      const header = columns.map((column) => column.header);
      xlsx.utils.sheet_add_aoa(ws, [header], { origin: "A2" });

      // const dataRows = data.map((item) =>
      //   columns.map((column) => item[column.value as keyof T]),
      // );

      const dataRows = data.map((item) =>
        columns.map((column) => eval(`item.${column.value}`)),
      );

      xlsx.utils.sheet_add_aoa(ws, dataRows, { origin: "A3" });

      const mergeRange = {
        s: { r: 0, c: 0 },
        e: { r: 0, c: columns.length - 1 },
      };
      ws["!merges"] = [mergeRange];

      for (let col = 0; col < columns.length; col++) {
        const cell = xlsx.utils.encode_cell({ r: 1, c: col });
        if (!ws[cell]) ws[cell] = {};
        ws[cell].s = {
          font: { bold: true },
          alignment: { horizontal: "center" },
        };
      }

      ws[xlsx.utils.encode_cell(mergeRange.s)] = {
        t: "s",
        v: `${title} - ${dateNow}`,
        s: {
          font: { bold: true },
          alignment: { horizontal: "center" },
        },
      };

      const colWidths = columns.map(() => ({ width: 20 }));
      ws["!cols"] = colWidths;

      Object.keys(ws).forEach((cellAddress) => {
        if (cellAddress !== "!ref" && cellAddress !== "!cols") {
          if (!ws[cellAddress].s) {
            ws[cellAddress].s = {};
          }

          ws[cellAddress].s.border = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          };
        }
      });

      xlsx.utils.book_append_sheet(wb, ws, "sheet 1");
      xlsx.writeFile(wb, `${fileName}-${dateNow}.xlsx`);
      toast({
        variant: "default",
        title: "Download Successful",
        description: `File ${fileName} berhasil diunduh.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: `Mohon maaf, file ${fileName} tidak dapat diunduh karena data tidak tersedia.`,
      });
    }
  };
  return (
    <Button size="sm" className="ml-auto gap-1" onClick={handleDownload}>
      <span className="hidden sm:inline md:inline">{buttonLabel}</span>
      <FileDown className="h-5 w-5" />
    </Button>
  );
}
