import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type ModalWrapperProps = {
  children: React.ReactNode;
  className?: string;
  buttonLabel: string;
  title: string;
  desc: string;
};

export default function ModalWrapper({
  children,
  className,
  buttonLabel,
  title,
  desc,
}: ModalWrapperProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto gap-1">
          <span className="hidden sm:inline md:inline">{buttonLabel}</span>
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn("overflow-auto sm:max-w-[425px]", className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
