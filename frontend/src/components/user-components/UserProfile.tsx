import { useAuth } from "@/context/auth.context";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Button } from "../ui/button";
import { UserChangePasswordForm } from "./UserChangePasswordForm";
import { UserChangeAvatarForm } from "./UserChangeAvatarForm";
import { Lock, User } from "lucide-react";

export const UserProfile = () => {
  const [openForm, setOpenForm] = useState<"password" | "avatar" | null>(null);
  const { user } = useAuth();

  if (user) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* left image section */}
        <div className="mx-auto">
          <img
            src={
              user.avatar
                ? `${import.meta.env.VITE_IMAGE_URL}${user.avatar}`
                : "https://github.com/shadcn.png"
            }
            alt="avatar"
            className="w-40 h-40 md:w-80 md:h-80 object-cover rounded-2xl"
          />
        </div>

        {/* right profile section */}
        <div className="space-y-6 flex-1">
          <div className="text-gray-600">
            <h1 className="text-base">
              Username :{" "}
              <span className="capitalize font-semibold">{user.username}</span>
            </h1>
            <h1 className="text-base">
              Email : <span className="font-semibold">{user.email}</span>
            </h1>
            <h1 className="text-base capitalize">
              Full Name :{" "}
              <span className="font-semibold">{user.first_name}</span>{" "}
              <span className="font-semibold">{user.last_name}</span>
            </h1>
          </div>

          <Separator />

          {/* form opener */}
          <div className="flex gap-1">
            {openForm === null && (
              <>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => setOpenForm("password")}
                >
                  <Lock /> Change Password
                </Button>

                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => setOpenForm("avatar")}
                >
                  <User /> Change Avatar
                </Button>
              </>
            )}

            <UserChangePasswordForm
              openForm={openForm}
              setOpenForm={setOpenForm}
            />
            <UserChangeAvatarForm
              openForm={openForm}
              setOpenForm={setOpenForm}
            />
          </div>
        </div>
      </div>
    );
  }
};
