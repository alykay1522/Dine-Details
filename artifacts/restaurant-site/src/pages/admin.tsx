import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  useListSpecials, useCreateSpecial, useUpdateSpecial, useDeleteSpecial, getListSpecialsQueryKey,
  useListGallery, useCreateGalleryPhoto, useDeleteGalleryPhoto, getListGalleryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Plus, Edit2, Trash2, QrCode, Link as LinkIcon, ImagePlus, X, Loader2, Image, Settings, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@workspace/object-storage-web";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";

type Tab = "specials" | "gallery" | "siteinfo";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("specials");
  const { toast } = useToast();
  const menuUrl = `${window.location.origin}/menu`;

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold mb-1" style={{ color: "var(--piggy-pink)" }}>Admin Portal</h1>
          <p className="text-muted-foreground">Manage your gallery, specials, and site info.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-border overflow-x-auto">
          {([
            { key: "specials", label: "Specials", icon: UtensilsCrossed },
            { key: "gallery", label: "Gallery", icon: Image },
            { key: "siteinfo", label: "Site Info", icon: Settings },
          ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-2 px-4 sm:px-5 py-3 font-bold text-sm transition-all border-b-2 -mb-px whitespace-nowrap shrink-0"
              style={{
                borderColor: activeTab === key ? "var(--piggy-pink)" : "transparent",
                color: activeTab === key ? "var(--piggy-pink)" : "var(--muted-foreground)",
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {activeTab === "specials" && <SpecialsTab menuUrl={menuUrl} toast={toast} />}
        {activeTab === "gallery" && <GalleryTab toast={toast} />}
        {activeTab === "siteinfo" && <SiteInfoTab toast={toast} />}
      </div>
    </div>
  );
}

/* ─── SPECIALS TAB ─── */
function SpecialsTab({ menuUrl, toast }: { menuUrl: string; toast: any }) {
  const { data: specials, isLoading } = useListSpecials();
  const queryClient = useQueryClient();
  const createSpecial = useCreateSpecial();
  const updateSpecial = useUpdateSpecial();
  const deleteSpecial = useDeleteSpecial();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      const imageUrl = `/api/storage${response.objectPath}`;
      setFormData(prev => ({ ...prev, imageUrl }));
      toast({ title: "Image uploaded!" });
    },
    onError: () => toast({ title: "Image upload failed", variant: "destructive" }),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", price: "", imageUrl: "",
    category: "daily", isActive: true,
    featuredDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "", imageUrl: "", category: "daily", isActive: true, featuredDate: format(new Date(), 'yyyy-MM-dd') });
    setEditingSpecial(null);
  };

  const handleOpenEdit = (special: any) => {
    setEditingSpecial(special);
    setFormData({ title: special.title, description: special.description, price: special.price || "", imageUrl: special.imageUrl || "", category: special.category, isActive: special.isActive, featuredDate: special.featuredDate });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, price: formData.price || null, imageUrl: formData.imageUrl || null };
    if (editingSpecial) {
      updateSpecial.mutate({ id: editingSpecial.id, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListSpecialsQueryKey() }); toast({ title: "Special updated!" }); setIsDialogOpen(false); }
      });
    } else {
      createSpecial.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListSpecialsQueryKey() }); toast({ title: "Special created!" }); setIsDialogOpen(false); }
      });
    }
  };

  const handleToggleActive = (special: any) => {
    updateSpecial.mutate({ id: special.id, data: { isActive: !special.isActive } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListSpecialsQueryKey() }); toast({ title: `Special marked ${!special.isActive ? "active" : "inactive"}` }); }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this special?")) {
      deleteSpecial.mutate({ id }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListSpecialsQueryKey() }); toast({ title: "Special deleted" }); }
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl">Specials Management</h2>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button style={{ background: "var(--piggy-pink)" }} className="text-white hover:opacity-90" onClick={resetForm}>
                  <Plus className="mr-2" size={16} /> Add Special
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingSpecial ? "Edit Special" : "Create New Special"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <Label>Title</Label>
                    <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Description</Label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Price (optional)</Label>
                      <Input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 12.99" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily Special</SelectItem>
                          <SelectItem value="soup">Soup</SelectItem>
                          <SelectItem value="salad">Salad</SelectItem>
                          <SelectItem value="dessert">Dessert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Featured Date</Label>
                    <Input type="date" value={formData.featuredDate} onChange={e => setFormData({...formData, featuredDate: e.target.value})} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Photo (optional)</Label>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadFile(f); }} />
                    {formData.imageUrl ? (
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img src={formData.imageUrl} alt="preview" className="w-full h-40 object-cover" />
                        <button type="button" onClick={() => setFormData(p => ({ ...p, imageUrl: "" }))} className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 text-destructive hover:bg-destructive hover:text-white transition-colors"><X size={14} /></button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center justify-center gap-3 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/60 hover:bg-primary/5 transition-colors disabled:opacity-50 cursor-pointer">
                        {isUploading ? <><Loader2 size={20} className="animate-spin text-primary" /><span className="text-sm text-muted-foreground">Uploading…</span></> : <><ImagePlus size={20} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">Tap to upload a photo</span></>}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch id="isActive" checked={formData.isActive} onCheckedChange={(v) => setFormData({...formData, isActive: v})} />
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
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}</div>
          ) : specials && specials.length > 0 ? (
            <div className="space-y-4">
              {specials.map(s => (
                <div key={s.id} className={`flex items-center justify-between p-4 rounded-lg border ${s.isActive ? "border-border bg-background" : "border-muted bg-muted/50 opacity-70"}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-lg">{s.title}</h3>
                      <span className="text-xs uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                        {{ daily: "Daily", soup: "Soup", salad: "Salad", dessert: "Dessert" }[s.category] ?? s.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{s.description}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <Switch checked={s.isActive} onCheckedChange={() => handleToggleActive(s)} />
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEdit(s)}><Edit2 size={16} /></Button>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(s.id)}><Trash2 size={16} /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No specials yet.</p>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Create your first special</Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="bg-card rounded-lg border border-border p-6 sticky top-28">
          <h2 className="font-serif text-2xl mb-6">Menu QR Code</h2>
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border border-border mb-6 shadow-sm flex items-center justify-center aspect-square w-48">
              <div className="flex flex-col items-center gap-2">
                <QrCode size={64} className="text-primary" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground text-center mt-2">Scan for Menu</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground mb-6">Place this QR code on tables for guests to pull up your menu.</p>
            <div className="w-full">
              <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-widest">Direct Link</Label>
              <div className="flex gap-2">
                <Input readOnly value={menuUrl} className="bg-muted text-sm" />
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(menuUrl); toast({ title: "Link copied!" }); }}>
                  <LinkIcon size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── GALLERY TAB ─── */
function GalleryTab({ toast }: { toast: any }) {
  const queryClient = useQueryClient();
  const { data: photos, isLoading } = useListGallery();
  const createPhoto = useCreateGalleryPhoto();
  const deletePhoto = useDeleteGalleryPhoto();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingCaption, setPendingCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const { uploadFile, isUploading } = useUpload({
    onSuccess: async (response) => {
      const imageUrl = `/api/storage${response.objectPath}`;
      createPhoto.mutate(
        { data: { imageUrl, caption: pendingCaption || null, sortOrder: 0 } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
            toast({ title: "Photo added to gallery!" });
            setPendingCaption("");
            setPreviewUrl("");
            if (fileInputRef.current) fileInputRef.current.value = "";
          },
          onError: () => toast({ title: "Failed to save photo", variant: "destructive" }),
        }
      );
    },
    onError: () => toast({ title: "Upload failed", variant: "destructive" }),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    await uploadFile(file);
  };

  const handleDelete = (id: number) => {
    if (confirm("Remove this photo from the gallery?")) {
      deletePhoto.mutate({ id }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() }); toast({ title: "Photo removed" }); },
        onError: () => toast({ title: "Failed to delete photo", variant: "destructive" }),
      });
    }
  };

  const busy = isUploading || createPhoto.isPending;

  return (
    <div className="flex flex-col gap-8">
      {/* Upload card */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="font-serif text-2xl mb-6">Upload Photo</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-1">
            <Label className="mb-2 block">Caption (optional)</Label>
            <Input
              value={pendingCaption}
              onChange={e => setPendingCaption(e.target.value)}
              placeholder="e.g. Loaded baked potato"
              className="mb-4"
              disabled={busy}
            />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="flex items-center justify-center gap-3 w-full h-32 rounded-lg border-2 border-dashed hover:border-primary/60 hover:bg-primary/5 transition-colors disabled:opacity-50 cursor-pointer"
              style={{ borderColor: "var(--piggy-pink)", opacity: busy ? 0.5 : 1 }}
            >
              {busy ? (
                <><Loader2 size={22} className="animate-spin" style={{ color: "var(--piggy-pink)" }} /><span className="text-muted-foreground text-sm">{isUploading ? "Uploading…" : "Saving…"}</span></>
              ) : (
                <><ImagePlus size={22} style={{ color: "var(--piggy-pink)" }} /><span className="text-muted-foreground text-sm">Click to choose a photo</span></>
              )}
            </button>
          </div>
          {previewUrl && (
            <div className="shrink-0 w-40 h-40 rounded-lg overflow-hidden border-2 border-border">
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Existing uploaded photos */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="font-serif text-2xl mb-6">Uploaded Photos <span className="text-muted-foreground text-lg font-sans font-normal">({photos?.length ?? 0})</span></h2>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group rounded-lg overflow-hidden border border-border aspect-square"
              >
                <img src={photo.imageUrl} alt={photo.caption ?? ""} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {photo.caption && <p className="text-white text-xs text-center line-clamp-2">{photo.caption}</p>}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="flex items-center gap-1.5 bg-destructive text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <Image size={40} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">No uploaded photos yet. Add your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SITE INFO TAB ─── */
function SiteInfoTab({ toast }: { toast: any }) {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [hours, setHours] = useState({ weekday: "", weekend: "", sunday: "" });
  const [announcement, setAnnouncement] = useState({ active: true, title: "", body: "" });
  const [story, setStory] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (settings && !initialized) {
    setHours({
      weekday: settings.hours_weekday ?? "",
      weekend: settings.hours_weekend ?? "",
      sunday: settings.hours_sunday ?? "",
    });
    setAnnouncement({
      active: settings.announcement_active !== "false",
      title: settings.announcement_title ?? "",
      body: settings.announcement_body ?? "",
    });
    setStory(settings.story_text ?? "");
    setInitialized(true);
  }

  const saveHours = () => {
    updateSettings.mutate({
      hours_weekday: hours.weekday,
      hours_weekend: hours.weekend,
      hours_sunday: hours.sunday,
    }, { onSuccess: () => toast({ title: "Hours saved!" }) });
  };

  const saveAnnouncement = () => {
    updateSettings.mutate({
      announcement_active: announcement.active ? "true" : "false",
      announcement_title: announcement.title,
      announcement_body: announcement.body,
    }, { onSuccess: () => toast({ title: "Announcement saved!" }) });
  };

  const saveStory = () => {
    updateSettings.mutate({ story_text: story }, { onSuccess: () => toast({ title: "Story saved!" }) });
  };

  if (isLoading) {
    return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />)}</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">

      {/* Hours */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="font-serif text-2xl mb-2">Hours</h2>
        <p className="text-muted-foreground text-sm mb-6">Shown on the home page and in the footer.</p>
        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1.5 block">Monday – Thursday</Label>
            <Input value={hours.weekday} onChange={e => setHours(h => ({ ...h, weekday: e.target.value }))} placeholder="Mon–Thu: 11am – 9pm" />
          </div>
          <div>
            <Label className="mb-1.5 block">Friday – Saturday</Label>
            <Input value={hours.weekend} onChange={e => setHours(h => ({ ...h, weekend: e.target.value }))} placeholder="Fri–Sat: 11am – 10pm" />
          </div>
          <div>
            <Label className="mb-1.5 block">Sunday</Label>
            <Input value={hours.sunday} onChange={e => setHours(h => ({ ...h, sunday: e.target.value }))} placeholder="Sun: 10am – 8pm" />
          </div>
          <Button onClick={saveHours} disabled={updateSettings.isPending} className="mt-2 w-fit" style={{ background: "var(--piggy-pink)" }}>
            Save Hours
          </Button>
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="font-serif text-2xl mb-2">Announcement Banner</h2>
        <p className="text-muted-foreground text-sm mb-6">The yellow banner shown on the home page.</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Switch
              id="ann-active"
              checked={announcement.active}
              onCheckedChange={v => setAnnouncement(a => ({ ...a, active: v }))}
            />
            <Label htmlFor="ann-active">Show announcement banner on home page</Label>
          </div>
          <div>
            <Label className="mb-1.5 block">Headline</Label>
            <Input value={announcement.title} onChange={e => setAnnouncement(a => ({ ...a, title: e.target.value }))} placeholder="e.g. Now Making Homemade Jerky!" disabled={!announcement.active} />
          </div>
          <div>
            <Label className="mb-1.5 block">Body Text</Label>
            <Textarea value={announcement.body} onChange={e => setAnnouncement(a => ({ ...a, body: e.target.value }))} placeholder="Short description…" className="resize-none" rows={3} disabled={!announcement.active} />
          </div>
          <Button onClick={saveAnnouncement} disabled={updateSettings.isPending} className="mt-2 w-fit" style={{ background: "var(--piggy-pink)" }}>
            Save Announcement
          </Button>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="font-serif text-2xl mb-2">Our Story</h2>
        <p className="text-muted-foreground text-sm mb-6">The description shown in the About section on the home page.</p>
        <Textarea value={story} onChange={e => setStory(e.target.value)} className="resize-none mb-4" rows={4} placeholder="Tell your story…" />
        <Button onClick={saveStory} disabled={updateSettings.isPending} className="w-fit" style={{ background: "var(--piggy-pink)" }}>
          Save Story
        </Button>
      </div>
    </div>
  );
}
