"use client";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type TButtonCurrencyProps = {
  name: string;
  control: Control<any, any> | undefined;
};

export default function ButtonCurrency({
  name,
  control,
}: TButtonCurrencyProps) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { ref, ...rest } }) => (
          <NumericFormat
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            decimalScale={2}
            getInputRef={ref}
            {...rest}
          />
        )}
      />
    </>
  );
}
