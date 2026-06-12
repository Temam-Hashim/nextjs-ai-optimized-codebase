"use client";

import { Globe, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/safrico/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useGsapStagger } from "@/hooks/use-gsap-stagger";

interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
}

interface ProjectFormState {
  name: string;
  description: string;
  isPublic: boolean;
}

const emptyForm: ProjectFormState = {
  name: "",
  description: "",
  isPublic: false,
};

export function ProjectsDashboard() {
  const tableRef = useGsapStagger<HTMLDivElement>({ delay: 0.12 });
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to load projects");
      }
      const data = (await response.json()) as { items: ProjectRow[] };
      setProjects(data.items);
    } catch {
      toast.error("Could not load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(project: ProjectRow) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description ?? "",
      isPublic: project.isPublic,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        isPublic: form.isPublic,
      };

      const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message ?? "Save failed");
      }

      toast.success(editingId ? "Project updated" : "Project created");
      setDialogOpen(false);
      await loadProjects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete project "${name}"?`)) {
      return;
    }
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      toast.success("Project deleted");
      await loadProjects();
    } catch {
      toast.error("Could not delete project");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Farm projects"
        description="Organize initiatives, seasons, and operational workstreams across your operation."
        badge="Project management"
        action={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New project
          </Button>
        }
      />

      <div ref={tableRef}>
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : projects.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">
              No projects yet. Create your first farm initiative.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Slug</th>
                    <th className="p-4 font-medium">Visibility</th>
                    <th className="p-4 font-medium">Created</th>
                    <th className="p-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      data-animate-item
                      className="border-b last:border-0 hover:bg-muted/20"
                    >
                      <td className="p-4">
                        <p className="font-medium">{project.name}</p>
                        {project.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {project.description}
                          </p>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs">{project.slug}</td>
                      <td className="p-4">
                        <Badge variant={project.isPublic ? "default" : "secondary"} className="gap-1">
                          {project.isPublic ? (
                            <Globe className="h-3 w-3" />
                          ) : (
                            <Lock className="h-3 w-3" />
                          )}
                          {project.isPublic ? "Public" : "Private"}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(project)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void handleDelete(project.id, project.name)}
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
            <DialogTitle>{editingId ? "Edit project" : "New project"}</DialogTitle>
            <DialogDescription>
              Projects help you group crops, teams, and seasons under one initiative.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. 2026 Maize Season"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-desc">Description</Label>
              <Textarea
                id="project-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
                className="rounded border-input"
              />
              Public project (visible to other users)
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSubmit()}
              disabled={submitting || form.name.length < 3}
            >
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
