"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { months, years } from "@/lib/constan";
import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface IMonthYearFilter<T> {
  table: Table<T>;
  filterDate: string;
}

export default function MonthYearFilter<T>({
  table,
  filterDate,
}: IMonthYearFilter<T>) {
  const [filterMonth, setFilterMonth] = React.useState<string | undefined>(
    undefined,
  );
  const [filterYear, setFilterYear] = React.useState<string | undefined>(
    undefined,
  );
  const [foundMoth, setFoundMoth] = React.useState<string | undefined>(
    undefined,
  );

  const handleYearChange = (year: string) => {
    setFilterYear(year);
    applyFilters(year, filterMonth);
  };

  const handleMonthChange = (month: string) => {
    setFilterMonth(month);
    applyFilters(filterYear, month);
  };

  const onReset = () => {
    setFilterYear(undefined);
    setFilterMonth(undefined);
    table.getColumn(filterDate)?.setFilterValue(undefined);
  };

  const applyFilters = (
    year: string | undefined,
    month: string | undefined,
  ) => {
    if (year && month) {
      const filterValue = year && month ? `${year}-${month}` : undefined;
      table.getColumn(filterDate)?.setFilterValue(filterValue);
    } else {
      table.getColumn(filterDate)?.setFilterValue(undefined);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {filterYear && filterMonth ? (
        <>
          <Button variant="ghost">
            {filterMonth
              ? (() => {
                  const month = months.find(
                    (month) => month.value === filterMonth,
                  );
                  return month ? (
                    <span>
                      {month.title} - {filterYear}
                    </span>
                  ) : (
                    ""
                  );
                })()
              : ""}
          </Button>
          <Button onClick={onReset}>
            Reset <X className="ml-2 h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Select onValueChange={handleMonthChange} value={filterMonth}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bulan</SelectLabel>
                {months.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={handleYearChange} value={filterYear}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tahun</SelectLabel>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}
