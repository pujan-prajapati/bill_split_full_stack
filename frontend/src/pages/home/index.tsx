import { Loading } from "@/components/my-compoents/Loading";
import { DashboardBarChart } from "@/components/dashboard-components/BarChart";
import { DashboardCard } from "@/components/dashboard-components/DashboardCard";
import { DashboardPieChart } from "@/components/dashboard-components/PieChart";
import { Activities } from "@/components/dashboard-components/Activities";
import { useGetDashboard } from "@/hooks/dashboard.hooks";
import { useAuth } from "@/context/auth.context";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isPending, error } = useGetDashboard();

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <h1>Error fetching dashboard</h1>;
  }

  return (
    <section className="flex flex-wrap gap-6 h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 space-y-5">
          <div className="bg-gray-50 shadow p-4 rounded-lg">
            <h1 className="text-xl text-gray-600 font-semibold">
              Welcome Back,
            </h1>
            <h1 className="text-3xl text-orange-600 font-semibold capitalize">
              {user?.first_name + " " + user?.last_name}
            </h1>
            <p className="text-gray-600 mt-2">
              Keep track of shared expenses, settle balances, and stay on top of
              your group spending.
            </p>
          </div>

          {/* cards */}
          <DashboardCard data={data.data} />

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
            <DashboardBarChart data={data} />
            <DashboardPieChart data={data} />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg mt-4 text-sm text-center text-gray-600 shadow">
          &copy; SplitNest. Manage shared expenses with ease.
        </div>
      </div>

      {/* activities */}
      <div className="w-full lg:w-96 xl:w-120 shadow bg-gray-50 h-fit 2xl:h-full rounded-lg p-4">
        <Activities />
      </div>
    </section>
  );
};
