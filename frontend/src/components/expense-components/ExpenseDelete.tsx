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
import { useExpenseGroup } from "@/hooks/expense.hook";

interface ExpenseDeleteProps {
  closeDialog: () => void;
  expenseId: string;
}

export const ExpenseDelete = ({
  expenseId,
  closeDialog,
}: ExpenseDeleteProps) => {
  const queryClient = useQueryClient();

  const { mutate } = useExpenseGroup();
  // handle delete
  const handleDelete = async () => {
    mutate(expenseId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["groups"],
        });
        toast.success("Group deleted success");
        closeDialog();
      },

      onError: () => {
        toast.error("Failed to delete group");
      },
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger render={<Button variant="destructive" />}>
          <Trash />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>
              Are you sure you want to delete this expense?
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
    </>
  );
};
