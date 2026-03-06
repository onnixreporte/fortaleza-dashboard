"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useRefreshContext } from "@/store/refresh-context";

export function TopBar() {
  const { triggerRefresh } = useRefreshContext();

  return (
    <header className="flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <h1 className="flex-1 text-sm font-medium">Fortaleza Dashboard</h1>
      <Button variant="outline" size="sm" onClick={triggerRefresh}>
        <RefreshCw className="sm:mr-1.5 size-3.5" />
        <span className="hidden sm:inline">Actualizar</span>
      </Button>
    </header>
  );
}
