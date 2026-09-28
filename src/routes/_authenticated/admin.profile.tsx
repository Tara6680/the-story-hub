import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { getMyProfile, saveProfile } from "@/lib/admin.functions";


export const Route = createFileRoute("/_authenticated/admin/profile")({
  loader: () => getMyProfile(),
  head: () => ({ meta: [{ title: "Profile — The Pressroom" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const profile = Route.useLoaderData();
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio);
  const [saving, setSaving] = useState(false);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [changing, setChanging] = useState(false);

  async function changePassword() {
    if (pw1.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (pw1 !== pw2) {
      toast.error("The two passwords don't match.");
      return;
    }
    setChanging(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw1 });
      if (error) throw error;
      setPw1("");
      setPw2("");
      toast.success("Password updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update password. Try again.");
    } finally {
      setChanging(false);
    }
  }


  async function save() {
    if (!displayName.trim()) {
      toast.error("Display name can't be empty.");
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ data: { display_name: displayName.trim(), bio: bio.trim() } });
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-md border border-line bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary";
  const labelCls = "mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground";

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-primary">The Pressroom</p>
      <h1 className="font-display mb-8 mt-1 text-3xl uppercase tracking-tight">Profile</h1>

      <div className="space-y-6">
        <div>
          <label className={labelCls} htmlFor="name">Public display name</label>
          <input
            id="name"
            className={inputCls}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            This is the only name that appears anywhere on the site.
          </p>
        </div>
        <div>
          <label className={labelCls} htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            className={inputCls}
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-md bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </div>
  );
}
