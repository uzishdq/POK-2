import { CircleCheck, CircleX } from "lucide-react";
import React from "react";

type FromStatus = {
  status?: boolean;
  message?: string;
};

export default function FromStatus({ status, message }: FromStatus) {
  if (!message) return null;

  let bgColor = "";
  let icon = null;
  let textColor = "";

  if (!status) {
    bgColor = "bg-destructive/15";
    icon = <CircleX height={30} width={30} />;
    textColor = "text-destructive";
  } else {
    bgColor = "bg-emerald-500/15";
    icon = <CircleCheck height={30} width={30} />;
    textColor = "text-emerald-500";
  }

  return (
    <div
      className={`p-3 rounded-md flex items-center gap-x-2 text-sm ${bgColor} ${textColor}`}
    >
      {icon}
      {message}
    </div>
  );
}
