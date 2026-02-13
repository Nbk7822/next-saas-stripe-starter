"use client";

import { useMemo, useState, useTransition } from "react";
import {
  updateUserProfile,
  type UserProfileFormData,
} from "@/actions/update-user-profile";
import { User, UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface ProfileEditorFormProps {
  user: Pick<User, "id" | "name" | "email" | "image" | "role">;
}

export function ProfileEditorForm({ user }: ProfileEditorFormProps) {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [image, setImage] = useState(user.image || "");
  const [role, setRole] = useState<UserRole>(user.role);

  const hasChanges = useMemo(() => {
    return (
      name.trim() !== (user.name || "").trim() ||
      email.trim() !== (user.email || "").trim() ||
      image.trim() !== (user.image || "").trim() ||
      role !== user.role
    );
  }, [email, image, name, role, user.email, user.image, user.name, user.role]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasChanges) {
      return;
    }

    const payload: UserProfileFormData = {
      name: name.trim(),
      email: email.trim(),
      image: image.trim(),
      role,
    };

    startTransition(async () => {
      const result = await updateUserProfile(user.id, payload);

      if (result.status !== "success") {
        toast.error("Profile update failed", {
          description: result.message || "Please try again.",
        });
        return;
      }

      await update();
      toast.success("Profile updated", {
        description: "Your account details are now up to date.",
      });
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="landing-glass divide-y divide-white/15 rounded-2xl px-5 pb-2 dark:divide-white/10"
    >
      <SectionColumns
        title="Display Name"
        description="This appears in your workspace and team activity."
      >
        <div className="grid gap-2">
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            className="dashboard-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            maxLength={64}
          />
        </div>
      </SectionColumns>

      <SectionColumns
        title="Contact Email"
        description="Support replies and billing updates are sent here."
      >
        <div className="grid gap-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            className="dashboard-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
          />
        </div>
      </SectionColumns>

      <SectionColumns
        title="Avatar URL"
        description="Set a profile image used across your dashboard."
      >
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="profile-image">Image URL</Label>
            <Input
              id="profile-image"
              className="dashboard-input"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/50 p-3 dark:border-white/10 dark:bg-black/20">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Profile preview"
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/75 text-sm font-semibold dark:border-white/10 dark:bg-black/40">
                {(name.trim().charAt(0) || "U").toUpperCase()}
              </div>
            )}
            <p className="text-xs text-foreground/65">
              Avatar preview updates instantly as you edit.
            </p>
          </div>
        </div>
      </SectionColumns>

      <SectionColumns
        title="Role"
        description="Role controls access across workspace and admin tools."
      >
        <div className="grid gap-2">
          <Label htmlFor="profile-role">Role</Label>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <SelectTrigger
              id="profile-role"
              className="dashboard-select-trigger w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dashboard-select-content">
              {Object.values(UserRole).map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className="dashboard-select-item"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SectionColumns>

      <div className="flex items-center justify-end py-6">
        <Button
          type="submit"
          disabled={!hasChanges || isPending}
          className="dashboard-btn rounded-xl px-6"
        >
          {isPending ? (
            <>
              <Icons.spinner className="mr-2 size-4 animate-spin" />
              Saving
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </form>
  );
}
