import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteGroup, useGetGroupMembers } from "@/hooks/group.hooks";
import { useAuth } from "@/context/auth.context";

interface GroupDeleteProps {
  openDialog: () => void;
  groupId: string;
}

export const GroupDelete = ({ groupId, openDialog }: GroupDeleteProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const { data: members } = useGetGroupMembers(groupId);

  const currentMember = members?.group_members.find(
    (m) => m.user.id === user?.id,
  );
  const isOwner = currentMember?.role == "owner";

  const { mutate } = useDeleteGroup();
  // handle delete
  const handleDelete = async () => {
    mutate(groupId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["groups"],
        });
        toast.success("Group deleted success");
        openDialog();
        navigate({
          to: "/",
        });
      },

      onError: () => {
        toast.error("Failed to delete group");
      },
    });
  };

  return (
    <>
      {isOwner && (
        <Popover>
          <PopoverTrigger render={<Button variant="destructive" />}>
            <Trash />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>
                Are you sure you want to delete this group?
              </PopoverTitle>
              <Button
                className={"mt-2"}
                onClick={handleDelete}
                variant={"destructive"}
              >
                Delete
              </Button>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
