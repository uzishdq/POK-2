"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React from "react";
import { useReactToPrint } from "react-to-print";

interface IExportPDF {
  children: React.ReactNode;
}

export default function ExportPDF({ children }: IExportPDF) {
  const targetRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => targetRef.current,
  });

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-[816px]" ref={targetRef}>
        {children}
      </div>
      <Button
        size="sm"
        className="fixed bottom-4 right-4 cursor-pointer rounded-md px-4 py-2 text-center text-xs"
        onClick={handlePrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
    </div>
  );
}
