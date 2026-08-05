import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/context/auth.context";
import { logoutUser } from "@/services/auth.services";
import { useState } from "react";
import { CustomDialog } from "./CustomDialog";
import { UserProfile } from "../user-components/UserProfile";

export const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogoutUser = async () => {
    await logoutUser();
    logout();
    toast.success("Logout success");
    navigate({ to: "/login" });
  };

  return (
    <div className="sticky top-0 z-10 bg-white shadow shadow-b">
      <section className="px-4 lg:px-8 py-4 flex items-center justify-between">
        <SidebarTrigger />
        {!user ? (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button size={"xl"}>Login</Button>
            </Link>
            <Link to="/register">
              <Button size={"xl"}>Register</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar size="lg" className="cursor-pointer">
                  <AvatarImage
                    src={`${import.meta.env.VITE_IMAGE_URL}${user.avatar}`}
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="py-2 cursor-pointer"
                >
                  <User /> Profile
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  variant="destructive"
                  onClick={handleLogoutUser}
                >
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </section>

      <CustomDialog
        className="md:max-w-3xl!"
        open={open}
        onOpenChange={setOpen}
        title="Profile"
      >
        <UserProfile />
      </CustomDialog>
    </div>
  );
};
