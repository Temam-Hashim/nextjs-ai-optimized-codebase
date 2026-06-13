"use client";

import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CROP_TYPE_LABELS } from "@/features/crops/labels";
import { CROP_CSV_TEMPLATE, type ParsedCsvRow, parseCropCsv } from "@/features/crops/parse-csv";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void | Promise<void>;
}

export function BulkImportDialog({ open, onOpenChange, onImported }: BulkImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedCsvRow[]>([]);
  const [parseErrors, setParseErrors] = useState<{ row: number; message: string }[]>([]);
  const [importing, setImporting] = useState(false);

  function resetState() {
    setFileName(null);
    setRows([]);
    setParseErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      resetState();
    }
    onOpenChange(next);
  }

  function downloadTemplate() {
    const blob = new Blob([CROP_CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "safrico-crops-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    const result = parseCropCsv(text);
    setFileName(file.name);
    setRows(result.rows);
    setParseErrors(result.errors);
  }

  async function handleImport() {
    if (rows.length === 0) {
      toast.error("No valid rows to import");
      return;
    }

    setImporting(true);
    try {
      const crops = rows.map((row) => ({
        name: row.name,
        cropType: row.cropType,
        quantity: row.quantity,
        ...(row.harvestDate ? { harvestDate: row.harvestDate } : {}),
      }));

      const response = await fetch("/api/crops/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crops }),
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message ?? "Import failed");
      }

      const data = (await response.json()) as { imported: number };
      toast.success(`Imported ${data.imported} crop${data.imported === 1 ? "" : "s"}`);
      handleOpenChange(false);
      await onImported();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk import</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add multiple crops at once. Columns: name, cropType, quantity,
            harvestDate (optional).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download template
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {fileName ? "Choose another file" : "Choose CSV file"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => void handleFileChange(e)}
            />
          </div>

          {fileName && (
            <p className="text-sm text-muted-foreground">
              File: <span className="font-medium text-foreground">{fileName}</span>
            </p>
          )}

          {parseErrors.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <p className="font-medium text-destructive">Validation errors</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {parseErrors.map((err) => (
                  <li key={`${err.row}-${err.message}`}>
                    {err.row > 0 ? `Row ${err.row}: ` : ""}
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rows.length > 0 && (
            <div className="overflow-hidden rounded-lg border">
              <p className="border-b bg-muted/40 px-4 py-2 text-sm font-medium">
                Preview — {rows.length} row{rows.length === 1 ? "" : "s"} ready to import
              </p>
              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20 text-left text-muted-foreground">
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Type</th>
                      <th className="p-3 font-medium">Qty (kg)</th>
                      <th className="p-3 font-medium">Harvest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={`${row.row}-${row.name}`} className="border-b last:border-0">
                        <td className="p-3 font-medium">{row.name}</td>
                        <td className="p-3">
                          <Badge variant="outline">{CROP_TYPE_LABELS[row.cropType]}</Badge>
                        </td>
                        <td className="p-3">{row.quantity.toLocaleString()}</td>
                        <td className="p-3">{row.harvestDate ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!fileName && (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Supported crop types: grains, vegetables, fruits, legumes, other
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleImport()}
            disabled={importing || rows.length === 0 || parseErrors.length > 0}
          >
            {importing ? "Importing…" : rows.length > 0 ? `Import ${rows.length} crops` : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
