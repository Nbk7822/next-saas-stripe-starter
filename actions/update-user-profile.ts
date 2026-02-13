"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";

const userProfileSchema = z.object({
  name: z.string().trim().min(2).max(64),
  email: z.string().trim().email(),
  image: z.string().trim().url().max(512).optional().or(z.literal("")),
  role: z.nativeEnum(UserRole),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

type UserProfileActionResult = {
  status: "success" | "error";
  message?: string;
};

export async function updateUserProfile(
  userId: string,
  data: UserProfileFormData,
): Promise<UserProfileActionResult> {
  try {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const values = userProfileSchema.parse(data);

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: values.name,
        email: values.email,
        image: values.image?.length ? values.image : null,
        role: values.role,
      },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return { status: "success" };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return {
        status: "error",
        message: "That email is already linked to another account.",
      };
    }

    return {
      status: "error",
      message: "Unable to save profile changes right now.",
    };
  }
}
