import { Spinner } from "../ui/spinner";

export const Loading = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner />
    </div>
  );
};
