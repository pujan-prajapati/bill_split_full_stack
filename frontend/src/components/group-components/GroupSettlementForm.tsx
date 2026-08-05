import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { settlementFormSchema } from "@/schemas/settlement.schema";
import type { CreateSettlementFormPayload } from "@/types/balance.types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";
import { useCreateSettlement } from "@/hooks/settlement.hooks";

interface GroupSettlementFormProps {
  settlement: {
    reciever: {
      id: number;
      name: string;
    };
    payer: {
      id: number;
      name: string;
    };
    amount: number;
  };
}

type SettlementFormData = z.infer<typeof settlementFormSchema>;

export const GroupSettlementForm = ({
  settlement,
}: GroupSettlementFormProps) => {
  const { group_id } = useParams({
    from: "/(home)/group/$group_id",
  });

  const form = useForm<SettlementFormData>({
    resolver: zodResolver(settlementFormSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const { mutate, isPending } = useCreateSettlement();

  // handle form submit
  const onSubmit = (data: SettlementFormData) => {
    if (data.amount > settlement.amount) {
      form.setError("amount", {
        message: `Cannot exceed Rs. ${settlement.amount}`,
      });
      return;
    }

    const formData: CreateSettlementFormPayload = {
      payer: settlement.payer.id,
      reciever: settlement.reciever.id,
      amount: data.amount,
    };

    mutate(
      {
        group_id,
        formData,
      },
      {
        onSuccess: () => {
          form.reset();
          toast.success("Settlement successful");
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data.message);
          }
        },
      },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex items-center gap-2"
    >
      <div className="flex flex-col">
        <Input
          type="number"
          step="0.01"
          placeholder="Rs."
          {...form.register("amount", {
            valueAsNumber: true,
          })}
        />

        {form.formState.errors.amount && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className={"h-10"} disabled={isPending}>
        <Check />
        {isPending ? "Settling..." : "Settle"}
      </Button>
    </form>
  );
};
