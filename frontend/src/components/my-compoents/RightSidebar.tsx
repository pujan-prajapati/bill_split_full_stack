import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { LogOut, UserRoundMinus } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Loading } from "./Loading";
import {
  useGetGroupMembers,
  useLeaveGroup,
  useRemoveGroupMember,
} from "@/hooks/group.hooks";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/auth.context";
import { GroupMemberAdd } from "../group-members-components/GroupMemberAdd";

export const RightSidebar = () => {
  const { group_id } = useParams({ from: "/(home)/group/$group_id" });
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isPending, error } = useGetGroupMembers(group_id);
  const { mutate: removeMutate } = useRemoveGroupMember();
  const { mutate: leaveGroupMutate } = useLeaveGroup();
  const currentMember = data?.group_members.find((m) => m.user.id === user?.id);
  const isOwner = currentMember?.role == "owner";

  // handle remove member
  const handleRemoveMember = (user_id: string) => {
    removeMutate(
      { group_id, user_id },
      {
        onSuccess: () => {
          toast.success("Member removed from group");
        },

        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data.message);
          }
        },
      },
    );
  };

  // handle leave group
  const handleLeaveGroup = () => {
    leaveGroupMutate(group_id, {
      onSuccess: () => {
        toast.success("You left the group");
        navigate({
          to: "/",
        });
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      },
    });
  };

  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="h-fit xl:h-full lg:flex w-full lg:w-96 rounded-lg px-2"
    >
      <SidebarContent>
        {/* friends */}
        <SidebarGroup>
          <SidebarGroupLabel>Members</SidebarGroupLabel>
          {/* add member form */}
          <GroupMemberAdd />
          <SidebarGroupContent className="space-y-3">
            {isPending ? (
              <Loading />
            ) : error ? (
              <h1>Failed to fetch members</h1>
            ) : (
              data?.group_members.map((member) => (
                <Card key={member.id} className="bg-gray-100 ">
                  <CardContent className="flex items-center justify-between  gap-4">
                    <div className="flex gap-2 items-center">
                      <img
                        src={`${import.meta.env.VITE_IMAGE_URL}${member.user.avatar}`}
                        alt={member.user.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h1>{member.user.full_name}</h1>
                          {member.role == "owner" && (
                            <Badge className="bg-green-600 text-white">
                              {member.role}
                            </Badge>
                          )}
                          {member.user.id == user?.id && (
                            <Badge className="bg-orange-700 text-white">
                              You
                            </Badge>
                          )}
                        </div>
                        <h1>{member.user.email}</h1>
                      </div>
                    </div>

                    <div>
                      {isOwner && member.role != "owner" && (
                        <Button
                          onClick={() =>
                            handleRemoveMember(member.user.id.toString())
                          }
                          variant={"destructive"}
                        >
                          <UserRoundMinus />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </SidebarGroupContent>
          {!isOwner && (
            <Button
              onClick={handleLeaveGroup}
              variant="destructive"
              className={"mt-4"}
            >
              <LogOut /> Leave Group
            </Button>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
