import { GroupDetail } from "@/components/group-components/GroupDetail";
import { RightSidebar } from "@/components/my-compoents/RightSidebar";

export const GroupDetailPage = () => {
  return (
    <section className="flex flex-wrap h-full gap-6">
      <div className="flex-1  bg-gray-50 rounded-2xl p-4">
        <GroupDetail />
      </div>

      <RightSidebar />
    </section>
  );
};
