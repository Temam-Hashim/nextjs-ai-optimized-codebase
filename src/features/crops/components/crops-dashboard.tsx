"use client";

import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/safrico/page-header";
import { BulkImportDialog } from "@/features/crops/components/bulk-import-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CROP_TYPE_LABELS, CROP_TYPES } from "@/features/crops/labels";
import type { CropType } from "@/features/crops/schemas";
import { useGsapStagger } from "@/hooks/use-gsap-stagger";

interface CropRow {
  id: string;
  name: string;
  cropType: CropType;
  quantity: number;
  harvestDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CropFormState {
  name: string;
  cropType: CropType;
  quantity: string;
  harvestDate: string;
}

const emptyForm: CropFormState = {
  name: "",
  cropType: "grains",
  quantity: "0",
  harvestDate: "",
};

interface CropsDashboardProps {
  bulkImportEnabled: boolean;
}

export function CropsDashboard({ bulkImportEnabled }: CropsDashboardProps) {
  const tableRef = useGsapStagger<HTMLDivElement>({ delay: 0.1 });
  const [crops, setCrops] = useState<CropRow[]>([]);
  const [filterType, setFilterType] = useState<CropType | "">("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CropFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadCrops = useCallback(async () => {
    setLoading(true);
    try {
      const params = filterType ? `?cropType=${filterType}` : "";
      const response = await fetch(`/api/crops${params}`);
      if (!response.ok) {
        throw new Error("Failed to load crops");
      }
      const data = (await response.json()) as { items: CropRow[] };
      setCrops(data.items);
    } catch {
      toast.error("Could not load crops");
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    void loadCrops();
  }, [loadCrops]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(crop: CropRow) {
    setEditingId(crop.id);
    setForm({
      name: crop.name,
      cropType: crop.cropType,
      quantity: String(crop.quantity),
      harvestDate: crop.harvestDate ? crop.harvestDate.slice(0, 10) : "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        cropType: form.cropType,
        quantity: Number(form.quantity),
        ...(form.harvestDate ? { harvestDate: form.harvestDate } : {}),
      };

      const response = await fetch(editingId ? `/api/crops/${editingId}` : "/api/crops", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message ?? "Save failed");
      }

      toast.success(editingId ? "Crop updated" : "Crop created");
      setDialogOpen(false);
      await loadCrops();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete ${name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/crops/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      toast.success("Crop deleted");
      await loadCrops();
    } catch {
      toast.error("Could not delete crop");
    }
  }

  function clearFilter() {
    setFilterType("");
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Crop inventory"
        description="Track harvest stock, quantities, and seasonal availability across your farm."
        badge="Inventory management"
        action={
          <div className="flex flex-wrap gap-2">
            {bulkImportEnabled && (
              <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Bulk import
              </Button>
            )}
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add crop
            </Button>
          </div>
        }
      />

      <Card data-animate-item className="safrico-panel">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>
            {filterType
              ? `Showing ${CROP_TYPE_LABELS[filterType]} only`
              : "Showing all crop types"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="crop-type-filter">Crop type</Label>
            <select
              id="crop-type-filter"
              className="flex h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as CropType | "")}
            >
              <option value="">All types</option>
              {CROP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {CROP_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          {filterType && (
            <Button variant="ghost" size="sm" onClick={clearFilter}>
              Clear filter
            </Button>
          )}
          {filterType && (
            <Badge variant="secondary">Filter active</Badge>
          )}
        </CardContent>
      </Card>

      <div ref={tableRef}>
      <Card className="safrico-panel overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : crops.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No crops yet. Add your first crop to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Quantity (kg)</th>
                    <th className="p-4 font-medium">Harvest date</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop) => (
                    <tr
                      key={crop.id}
                      data-animate-item
                      className="border-b last:border-0 hover:bg-muted/20"
                    >
                      <td className="p-4 font-medium">{crop.name}</td>
                      <td className="p-4">
                        <Badge variant="outline">{CROP_TYPE_LABELS[crop.cropType]}</Badge>
                      </td>
                      <td className="p-4">{crop.quantity.toLocaleString()}</td>
                      <td className="p-4">
                        {crop.harvestDate
                          ? new Date(crop.harvestDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(crop)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void handleDelete(crop.id, crop.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit crop" : "Add crop"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update crop details." : "Add a new crop to your inventory."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="crop-name">Name</Label>
              <Input
                id="crop-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Maize"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop-type">Crop type</Label>
              <select
                id="crop-type"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={form.cropType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cropType: e.target.value as CropType }))
                }
              >
                {CROP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {CROP_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop-quantity">Quantity (kg)</Label>
              <Input
                id="crop-quantity"
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop-harvest">Harvest date (optional)</Label>
              <Input
                id="crop-harvest"
                type="date"
                value={form.harvestDate}
                onChange={(e) => setForm((f) => ({ ...f, harvestDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSubmit()} disabled={submitting || !form.name}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BulkImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImported={loadCrops}
      />
    </div>
  );
}
