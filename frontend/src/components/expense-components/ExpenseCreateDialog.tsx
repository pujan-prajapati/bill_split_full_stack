import { useState } from "react";
import { CustomDialog } from "../my-compoents/CustomDialog";
import { Button } from "../ui/button";
import { ExpenseForm } from "./ExpenseForm";
import { DollarSign } from "lucide-react";

export const ExpenseEmptyCreateDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-xl mt-4">Start by adding your first expense</h1>
        <Button size={"lg"} onClick={() => setOpenDialog(true)}>
          <DollarSign /> Create Expense
        </Button>
      </div>
      <CustomDialog
        title="Create Expense"
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <ExpenseForm closeDialog={() => setOpenDialog(false)} />
      </CustomDialog>
    </div>
  );
};

export const ExpenseCreateDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Button size={"lg"} onClick={() => setOpenDialog(true)}>
          <DollarSign /> Create Expense
        </Button>
      </div>
      <CustomDialog
        title="Create Expense"
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <ExpenseForm closeDialog={() => setOpenDialog(false)} />
      </CustomDialog>
    </div>
  );
};
