"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cekNotifWa } from "@/lib/action/notifikasi";
import { toast } from "../ui/use-toast";

export default function CobaKirimWa() {
  const onSubmit = async () => {
    const data = await cekNotifWa();
    toast({
      variant: data.ok ? "default" : "destructive",
      title: data.ok ? "SUCCESS" : "FAILED",
      description: data.message,
    });
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSubmit}>Deploy</Button>
      </CardFooter>
    </Card>
  );
}
