import { useParams } from "@tanstack/react-router";
import { Loading } from "../my-compoents/Loading";
import { DollarSign, Scale, Settings } from "lucide-react";
import { CustomDialog } from "../my-compoents/CustomDialog";
import { useState } from "react";
import { GroupCreateForm } from "./GroupCreateForm";
import { useGetGroupById } from "@/hooks/group.hooks";
import { Separator } from "../ui/separator";
import { ExpenseDetails } from "../expense-components/ExpenseDetails";
import { GroupBalanceCard } from "./GroupBalanceCard";

export const GroupDetail = () => {
  const { group_id } = useParams({ from: "/(home)/group/$group_id" });
  const [openDialog, setOpenDialog] = useState(false);

  const { data, isPending, error } = useGetGroupById(group_id);

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <h1>Failed to fetch group detail</h1>;
  }

  return (
    <section className="flex h-full flex-col">
      {/* header  */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold capitalize text-gray-600">
          {data.group.name}
        </h1>
        <div
          onClick={() => setOpenDialog(true)}
          className="hover:bg-gray-200 cursor-pointer transition duration-150 p-2 rounded-lg"
        >
          <Settings size={20} className="text-gray-600" />
        </div>

        <CustomDialog
          title="Group Settings"
          open={openDialog}
          onOpenChange={setOpenDialog}
        >
          <GroupCreateForm
            groupData={data}
            closeDialog={() => setOpenDialog(false)}
          />
        </CustomDialog>
      </div>
      <Separator className="mt-2 mb-3" />

      {/* expense  */}
      <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="flex flex-col">
          <h1 className="mb-2 flex items-center gap-2 rounded-lg bg-white p-3 text-lg font-semibold text-orange-700 shadow">
            <DollarSign size={32} className="rounded-full border p-1" />
            Expenses
          </h1>

          <div className="flex-1 rounded-lg bg-white p-3 shadow">
            <ExpenseDetails />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="mb-2 flex items-center gap-2 rounded-lg bg-white p-3 text-lg font-semibold text-green-700 shadow">
            <Scale size={32} className="rounded-full border p-1" />
            Balances
          </h1>

          <div className="flex-1 rounded-lg bg-white p-3 shadow">
            <GroupBalanceCard groupId={group_id} />
          </div>
        </div>
      </div>
    </section>
  );
};
