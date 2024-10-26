import React from "react";
import { Button } from "./ui/button";

type ButtonLoadingProps = {
  className?: string;
};

export default function ButtonLoading({ className }: ButtonLoadingProps) {
  return (
    <Button className={className}>
      <div className="border-gray-300 h-6 w-6 mr-3 animate-spin rounded-full border-4 border-t-white" />
      Loading...
    </Button>
  );
}
