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
  const [pw0, setPw0] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [changing, setChanging] = useState(false);

  async function changePassword() {
    if (!pw0) {
      toast.error("Enter your current password first.");
      return;
    }
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
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email;
      if (!email) throw new Error("Couldn't verify your account. Try signing in again.");
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: pw0 });
      if (signInError) throw new Error("Current password is incorrect.");
      const { error } = await supabase.auth.updateUser({ password: pw1 });
      if (error) throw error;
      setPw0("");
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

      <div className="mt-12 border-t border-line pt-8">
        <h2 className="font-display mb-6 text-2xl uppercase tracking-tight">Change password</h2>
        <div className="space-y-6">
          <div>
            <label className={labelCls} htmlFor="pw0">Current password</label>
            <input
              id="pw0"
              type="password"
              autoComplete="current-password"
              className={inputCls}
              value={pw0}
              onChange={(e) => setPw0(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              For now, that's the temporary one you signed in with.
            </p>
          </div>
          <div>
            <label className={labelCls} htmlFor="pw1">New password</label>
            <input
              id="pw1"
              type="password"
              autoComplete="new-password"
              className={inputCls}
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="pw2">Confirm new password</label>
            <input
              id="pw2"
              type="password"
              autoComplete="new-password"
              className={inputCls}
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={changing}
            onClick={changePassword}
            className="rounded-md bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {changing ? "Updating…" : "Update password"}
          </button>
        </div>
      </div>

    </div>
  );
}
