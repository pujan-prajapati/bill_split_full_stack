import { DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { CustomDialog } from "../my-compoents/CustomDialog";
import { GroupSettlementCard } from "./GroupSettlementCard";

export const GroupSettlementDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <Button
          size={"lg"}
          className={"bg-green-700 text-white hover:bg-green-700/80"}
          onClick={() => setOpenDialog(true)}
        >
          <DollarSign /> Settle balances
        </Button>
      </div>

      <CustomDialog
        title="Settlement"
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <GroupSettlementCard />
      </CustomDialog>
    </>
  );
};
