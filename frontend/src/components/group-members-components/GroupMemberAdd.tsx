import { Plus } from "lucide-react";
import { FormField } from "../my-compoents/FormField";
import { Button } from "../ui/button";
import * as z from "zod";
import { useAddGroupMember } from "@/hooks/group.hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import axios from "axios";

const addMemberFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export const GroupMemberAdd = () => {
  const { group_id } = useParams({ from: "/(home)/group/$group_id" });

  const form = useForm<z.infer<typeof addMemberFormSchema>>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const { mutate: addMutate, isPending: addPending } = useAddGroupMember();

  // handle add member
  const onSubmit = (data: z.infer<typeof addMemberFormSchema>) => {
    addMutate(
      { group_id, username: data.username },
      {
        onSuccess: () => {
          toast.success("Member added to group");
          form.reset();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(error?.response?.data.message);
            form.reset();
          }
        },
      },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex items-center gap-1 space-y-2 px-1 mb-4"
    >
      <FormField
        name="username"
        className="bg-white"
        control={form.control}
        placeholder="Add member (username)"
        disabled={addPending}
      />
      <Button
        type="submit"
        disabled={addPending}
        className="w-10 h-10 rounded-full"
      >
        <Plus />
      </Button>
    </form>
  );
};
