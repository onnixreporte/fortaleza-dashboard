"use client";

import { useState, useMemo } from "react";
import { ExternalLink, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConversationRow } from "@/types/botmaker";

const PAGE_SIZE = 20;

interface ConversationsTableProps {
  data: ConversationRow[];
}

function matchesSearch(row: ConversationRow, query: string): boolean {
  const q = query.toLowerCase();
  return (
    row.customerName.toLowerCase().includes(q) ||
    row.agentName.toLowerCase().includes(q) ||
    row.investmentReason.toLowerCase().includes(q) ||
    row.closingTypification.toLowerCase().includes(q) ||
    row.adSource.toLowerCase().includes(q)
  );
}

export function ConversationsTable({ data }: ConversationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(
    () =>
      searchQuery
        ? data.filter((row) => matchesSearch(row, searchQuery))
        : data,
    [data, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, agente, motivo..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="sticky top-0 z-10 bg-background min-w-[180px] bg-muted/50">
                  Nombre del cliente
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background min-w-[150px] bg-muted/50">
                  Agente que atendió
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background min-w-[150px] bg-muted/50">
                  Motivo de inversión
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background min-w-[180px] bg-muted/50">
                  Gráfica / Pauta
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background min-w-[80px] bg-muted/50">
                  Link
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background min-w-[160px] bg-muted/50">
                  Tipificación de cierre
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background min-w-[140px] text-right bg-muted/50">
                  1ra respuesta
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-background min-w-[140px] text-right bg-muted/50">
                  Duración prom.
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? "No se encontraron resultados"
                      : "No hay conversaciones en este período"}
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((row) => (
                  <TableRow key={row.chatId}>
                    <TableCell>
                      {row.customerName}
                    </TableCell>
                    <TableCell>{row.agentName}</TableCell>
                    <TableCell>
                      {row.investmentReason !== "—" ? (
                        <Badge variant="secondary">
                          {row.investmentReason}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate">
                      {row.adSource !== "—" ? (
                        row.adSource
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <a
                        href={row.conversationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="size-3.5" />
                        <span className="sr-only">Ver conversación</span>
                      </a>
                    </TableCell>
                    <TableCell>
                      {row.closingTypification !== "—" ? (
                        <Badge variant="outline">
                          {row.closingTypification}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.firstResponseTime}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.avgChatDuration}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length} conversacion{filtered.length !== 1 ? "es" : ""}
          {searchQuery && ` (filtradas de ${data.length})`}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="tabular-nums">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
