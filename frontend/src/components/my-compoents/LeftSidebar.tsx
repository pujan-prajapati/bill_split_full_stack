import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Plus } from "lucide-react";
import { useState } from "react";
import { CustomDialog } from "./CustomDialog";
import { GroupCreateForm } from "../group-components/GroupCreateForm";
import { Spinner } from "../ui/spinner";
import { useGetGroups } from "@/hooks/group.hooks";

export const LeftSidebar = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const { data, error, isPending } = useGetGroups();

  return (
    <>
      <Sidebar>
        <div className="text-4xl font-bold p-4 text-center bg-white border-b">
          <Link to="/">
            <span className="text-primary">Split</span>
            <span className="text-orange-600">Nest</span>
          </Link>
        </div>
        <SidebarHeader className="bg-white pt-4">
          <Link
            to="/"
            className="flex justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl p-4"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </SidebarHeader>
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupLabel>Groups</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => setOpenDialog(true)}>
              <Plus /> <span className="sr-only">Add Group</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenuItem className="space-y-1">
                {isPending ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : error ? (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                    Failed to load groups. Please try again.
                  </div>
                ) : data?.group.length != 0 ? (
                  data.group.map((group) => (
                    <Link
                      key={group.id}
                      to="/group/$group_id"
                      params={{ group_id: group.id.toString() }}
                      className="block rounded-lg p-2 transition duration-200 font-semibold text- hover:bg-orange-600 hover:text-white [&.active]:bg-orange-600 [&.active]:text-white"
                    >
                      {group.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-2 text-sm text-muted-foreground">
                    No groups yet.
                  </p>
                )}
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* dialog  */}
      <CustomDialog
        className="md:max-w-xl!"
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Create New Group"
      >
        <GroupCreateForm closeDialog={() => setOpenDialog(false)} />
      </CustomDialog>
    </>
  );
};
