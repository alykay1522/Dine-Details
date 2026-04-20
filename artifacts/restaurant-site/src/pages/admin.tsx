import { useState } from "react";
import { motion } from "framer-motion";
import { useListSpecials, useCreateSpecial, useUpdateSpecial, useDeleteSpecial, getListSpecialsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { Plus, Edit2, Trash2, QrCode, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { data: specials, isLoading } = useListSpecials();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createSpecial = useCreateSpecial();
  const updateSpecial = useUpdateSpecial();
  const deleteSpecial = useDeleteSpecial();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "daily",
    isActive: true,
    featuredDate: format(new Date(), 'yyyy-MM-dd')
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "daily",
      isActive: true,
      featuredDate: format(new Date(), 'yyyy-MM-dd')
    });
    setEditingSpecial(null);
  };

  const handleOpenEdit = (special: any) => {
    setEditingSpecial(special);
    setFormData({
      title: special.title,
      description: special.description,
      price: special.price || "",
      imageUrl: special.imageUrl || "",
      category: special.category,
      isActive: special.isActive,
      featuredDate: special.featuredDate
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      price: formData.price || null,
      imageUrl: formData.imageUrl || null,
    };

    if (editingSpecial) {
      updateSpecial.mutate(
        { id: editingSpecial.id, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListSpecialsQueryKey() });
            toast({ title: "Special updated successfully" });
            setIsDialogOpen(false);
          }
        }
      );
    } else {
      createSpecial.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListSpecialsQueryKey() });
            toast({ title: "Special created successfully" });
            setIsDialogOpen(false);
          }
        }
      );
    }
  };

  const handleToggleActive = (special: any) => {
    updateSpecial.mutate(
      { id: special.id, data: { isActive: !special.isActive } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSpecialsQueryKey() });
          toast({ title: `Special marked as ${!special.isActive ? 'active' : 'inactive'}` });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this special?")) {
      deleteSpecial.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListSpecialsQueryKey() });
            toast({ title: "Special deleted successfully" });
          }
        }
      );
    }
  };

  const menuUrl = `${window.location.origin}/menu`;

  return (
    <div className="min-h-screen bg-muted/30 pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Manage your specials and restaurant links.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-2xl text-foreground">Specials Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90" onClick={resetForm}>
                      <Plus className="mr-2" size={16} /> Add Special
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingSpecial ? "Edit Special" : "Create New Special"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="resize-none" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="price">Price (optional)</Label>
                          <Input id="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 24.50" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily Special</SelectItem>
                              <SelectItem value="weekly">Weekly Feature</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="featuredDate">Featured Date</Label>
                        <Input id="featuredDate" type="date" value={formData.featuredDate} onChange={e => setFormData({...formData, featuredDate: e.target.value})} required />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="imageUrl">Image URL (optional)</Label>
                        <Input id="imageUrl" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
                      </div>

                      <div className="flex items-center space-x-2 mt-2">
                        <Switch 
                          id="isActive" 
                          checked={formData.isActive} 
                          onCheckedChange={(checked) => setFormData({...formData, isActive: checked})} 
                        />
                        <Label htmlFor="isActive">Active (visible on website)</Label>
                      </div>

                      <Button type="submit" className="w-full mt-4" disabled={createSpecial.isPending || updateSpecial.isPending}>
                        {editingSpecial ? "Update Special" : "Create Special"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg w-full"></div>
                  ))}
                </div>
              ) : specials && specials.length > 0 ? (
                <div className="space-y-4">
                  {specials.map(special => (
                    <div key={special.id} className={`flex items-center justify-between p-4 rounded-lg border ${special.isActive ? 'border-border bg-background' : 'border-muted bg-muted/50 opacity-70'}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-lg">{special.title}</h3>
                          <span className="text-xs uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                            {special.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{special.description}</p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={special.isActive} 
                            onCheckedChange={() => handleToggleActive(special)} 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleOpenEdit(special)}>
                            <Edit2 size={16} />
                          </Button>
                          <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(special.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground mb-4">No specials created yet.</p>
                  <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Create your first special</Button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-28">
              <h2 className="font-serif text-2xl text-foreground mb-6">Menu QR Code</h2>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl border border-border mb-6 shadow-sm flex items-center justify-center aspect-square w-48">
                  <div className="flex flex-col items-center text-muted-foreground gap-2">
                    <QrCode size={64} className="text-primary" />
                    <span className="text-xs uppercase tracking-widest text-center mt-2">Scan for Menu</span>
                  </div>
                </div>
                
                <p className="text-sm text-center text-muted-foreground mb-6">
                  Place this QR code on tables. It links directly to your digital menu.
                </p>

                <div className="w-full">
                  <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-widest">Direct Link</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={menuUrl} className="bg-muted text-sm" />
                    <Button variant="outline" size="icon" onClick={() => {
                      navigator.clipboard.writeText(menuUrl);
                      toast({ title: "Link copied to clipboard" });
                    }}>
                      <LinkIcon size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
