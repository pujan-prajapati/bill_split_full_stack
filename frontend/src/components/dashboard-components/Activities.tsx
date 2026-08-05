import { formatDistanceToNow } from "date-fns";
import { Loading } from "@/components/my-compoents/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { useGetActivities } from "@/hooks/dashboard.hooks";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Activities = () => {
  const [page, setPage] = useState(1);

  const { data, isPending, error } = useGetActivities(page);
  if (isPending) return <Loading />;

  if (error) return <h1>Failed to load activities</h1>;

  return (
    <>
      <h1 className="bg-white p-2 rounded-lg text-gray-600 font-semibold mb-4 text-center">
        Activities
      </h1>

      <div className="space-y-2">
        {data.results.map((activity) => (
          <Card key={activity.id}>
            <CardContent>
              <h2 className="font-semibold">{activity.user_name}</h2>

              <p className="text-sm text-gray-700 mt-1">
                {activity.description}
              </p>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>{activity.group_name}</span>

                <span>
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data && data.next && (
        <div className="flex items-center gap-2 justify-end mt-4">
          <Button onClick={() => setPage(page - 1)} disabled={!data.previous}>
            <ChevronLeft />
          </Button>
          <Button onClick={() => setPage(page + 1)} disabled={!data.next}>
            <ChevronRight />
          </Button>
        </div>
      )}
    </>
  );
};
