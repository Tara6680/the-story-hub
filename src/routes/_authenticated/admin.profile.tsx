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

function PasswordField({
  id,
  label,
  autoComplete,
  value,
  onChange,
  inputCls,
  labelCls,
  hint,
}: {
  id: string;
  label: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  inputCls: string;
  labelCls: string;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className={labelCls} htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          className={`${inputCls} pr-16`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

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
      const { error } = await supabase.auth.updateUser({
        password: pw1,
        current_password: pw0,
      });
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
          <PasswordField
            id="pw0"
            label="Current password"
            autoComplete="current-password"
            value={pw0}
            onChange={setPw0}
            inputCls={inputCls}
            labelCls={labelCls}
            hint="For now, that's the temporary one you signed in with."
          />
          <PasswordField
            id="pw1"
            label="New password"
            autoComplete="new-password"
            value={pw1}
            onChange={setPw1}
            inputCls={inputCls}
            labelCls={labelCls}
            hint="At least 8 characters."
          />
          <PasswordField
            id="pw2"
            label="Confirm new password"
            autoComplete="new-password"
            value={pw2}
            onChange={setPw2}
            inputCls={inputCls}
            labelCls={labelCls}
          />
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
