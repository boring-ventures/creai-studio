"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMockAuth } from "@/context/mock-auth-context";
import { Badge } from "@/components/ui/badge";

interface AppUser {
  email?: string;
  name?: string;
}

type UserRole =
  | "YOUTH"
  | "ADOLESCENTS"
  | "COMPANIES"
  | "MUNICIPAL_GOVERNMENTS"
  | "TRAINING_CENTERS"
  | "NGOS_AND_FOUNDATIONS"
  | "SUPERADMIN";

// Add Profile type to ensure profile.role can be UserRole | null
interface Profile {
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  role: UserRole | null;
}

export function ProfileDropdown() {
  const router = useRouter();
  const { profile, user, isLoading } = useCurrentUser();
  const { signOut } = useMockAuth();
  const appUser = user as AppUser;

  if (isLoading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse" />
      </Button>
    );
  }

  if (!profile || !appUser) return null;

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    appUser?.name ||
    appUser?.email?.split("@")[0] ||
    "Usuario";

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.firstName || profile?.lastName) {
      return [profile.firstName?.[0], profile.lastName?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase();
    }
    if (appUser?.name) {
      return appUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return appUser?.email?.[0]?.toUpperCase() || "U";
  };

  // Get role display name
  const getRoleDisplay = (role?: UserRole | null) => {
    if (!role) return "Sin rol";
    return role
      .toString()
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 ring-2 ring-primary/10">
            <AvatarImage
              src={profile?.profilePicture || ""}
              alt={displayName || appUser?.email || "User"}
            />
            <AvatarFallback className="bg-primary/10">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <Badge variant="outline" className="ml-2 text-xs">
                {getRoleDisplay(profile?.role)}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {appUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          {profile?.role && profile.role.toString() === "SUPERADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <BadgeCheck className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
