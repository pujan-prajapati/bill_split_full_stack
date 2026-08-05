import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { Button } from "../ui/button";
import {
  useCreateExpense,
  useGetAllExpenseCategory,
  useUpdateExpense,
} from "@/hooks/expense.hook";
import { useGetGroupMembers } from "@/hooks/group.hooks";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { expenseFormSchema } from "@/schemas/expenseForm.schema";
import type { ExpensesTypes } from "@/types/expense.types";
import { cn } from "@/lib/utils";
import { ExpenseDelete } from "./ExpenseDelete";
import { FormField } from "../my-compoents/FormField";
import axios from "axios";

type FormInput = z.input<typeof expenseFormSchema>;
type FormOutput = z.output<typeof expenseFormSchema>;

interface ExpenseFormProps {
  closeDialog: () => void;
  expenseData?: ExpensesTypes;
}

export const ExpenseForm = ({ closeDialog, expenseData }: ExpenseFormProps) => {
  const { group_id } = useParams({ from: "/(home)/group/$group_id" });

  // use query hook
  const { data: expenseCategories } = useGetAllExpenseCategory();
  const { data: members } = useGetGroupMembers(group_id);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      title: expenseData?.title ?? "",
      amount: expenseData?.amount ?? "",
      payer: expenseData?.payer ?? "",
      expense_category: expenseData?.expense_category ?? "",
      split_type: expenseData?.split_type ?? "equal",
      participants: members?.group_members.map((member) => {
        const existing = expenseData?.participants.find(
          (p) => p.user === member.user.id,
        );

        return {
          user: member.user.id,
          share_amount: existing?.share_amount ?? "0",
          percentage: existing?.percentage ?? "0",
        };
      }),
    },
  });

  const splitType = useWatch({
    control: form.control,
    name: "split_type",
  });

  const totalAmount = useWatch({
    control: form.control,
    name: "amount",
  });

  const participants = useWatch({
    control: form.control,
    name: "participants",
  });

  const enteredSharedTotal = participants.reduce(
    (sum, p) => sum + Number(p.share_amount),
    0,
  );

  const enteredPercentage = participants?.reduce(
    (sum, p) => sum + Number(p.percentage),
    0,
  );

  const remainingAmount = (Number(totalAmount) || 0) - enteredSharedTotal;
  const remainingPercentage = 100 - enteredPercentage;

  const { mutate: createExpenseMutate, isPending: createPending } =
    useCreateExpense();
  const { mutate: updateExpenseMutate, isPending: updatePending } =
    useUpdateExpense();
  const isSubmiting = createPending || updatePending;

  // handle submit
  function onSubmit(data: z.infer<typeof expenseFormSchema>) {
    const payload = {
      title: data.title,
      amount: data.amount,
      expense_category: data.expense_category,
      group: group_id,
      payer: data.payer,
      split_type: data.split_type,
      participants: data.participants.map((p) => {
        if (data.split_type === "percentage") {
          return {
            user: p.user,
            percentage: p.percentage,
          };
        }

        if (data.split_type === "exact") {
          return {
            user: p.user,
            share_amount: p.share_amount,
          };
        }

        return { user: p.user };
      }),
    };
    if (expenseData) {
      updateExpenseMutate(
        {
          expense_id: expenseData.id.toString(),
          formData: payload,
        },
        {
          onSuccess: () => {
            toast.success("Expense updated success");
            form.reset();
            closeDialog();
          },
          onError: () => {
            toast.error("Failed to updated expense");
            form.reset();
          },
        },
      );
    } else {
      createExpenseMutate(payload, {
        onSuccess: () => {
          toast.success("Expense created success");
          form.reset();
          closeDialog();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            if (error.response?.data.message) {
              toast.error(error.response?.data.message);
            }
            if (error.response?.data.amount) {
              toast.error(error.response?.data.amount);
            }
          }
        },
      });
    }
  }

  return (
    <form
      id="expense-create-form"

      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-3">
        {/* expense category */}
        <Controller
          name="expense_category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="expense_category">
                Expense Category
              </FieldLabel>

              <NativeSelect
                {...field}
                disabled={isSubmiting}
                id="expense_category"
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <NativeSelectOption value={""}>
                  Select category
                </NativeSelectOption>
                {expenseCategories &&
                  expenseCategories.map((category) => (
                    <NativeSelectOption key={category.id} value={category.id}>
                      {category.title}
                    </NativeSelectOption>
                  ))}
              </NativeSelect>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* title */}
        <FormField
          name="title"
          label="Title"
          control={form.control}
          required
          disabled={isSubmiting}
        />

        {/* amount */}

        <FormField
          name="amount"
          label="Amount"
          type="number"
          placeholder="Rs. 0.00"
          control={form.control}
          required
          disabled={isSubmiting}
        />

        {/* payer */}
        <Controller
          name="payer"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="payer">Payer</FieldLabel>
              <NativeSelect
                {...field}
                id="payer"
                disabled={isSubmiting}
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <NativeSelectOption value={""}>Select Payer</NativeSelectOption>
                {members?.group_members.map((m) => (
                  <NativeSelectOption key={m.id} value={m.user.id}>
                    {m.user.full_name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* split type */}
        <Controller
          name="split_type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="split_type">Split Type</FieldLabel>
              <NativeSelect
                {...field}
                disabled={isSubmiting}
                id="split_type"
                name="split_type"
              >
                <NativeSelectOption value="equal">Equal</NativeSelectOption>
                <NativeSelectOption value="exact">Exact</NativeSelectOption>
                <NativeSelectOption value="percentage">
                  Percentage
                </NativeSelectOption>
              </NativeSelect>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {splitType === "equal" && (
          <div className="border rounded-lg p-4 space-y-5 divide-y">
            <div className="flex border p-2 rounded-lg justify-between text-sm font-medium">
              <span>Total: Rs. {Number(totalAmount)}</span>
              <span className="text-muted-foreground">
                {members?.group_members.length} people
              </span>
            </div>

            {members?.group_members.map((member) => {
              const memberCount = members.group_members.length;
              const equalShare = Number(totalAmount) / memberCount;

              return (
                <div
                  key={member.id}
                  className="flex justify-between items-center pb-2"
                >
                  <span>{member.user.full_name}</span>
                  <span className="font-medium text-orange-700">
                    Rs. {equalShare.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Exact */}
        {splitType === "exact" && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex border p-2 rounded-lg justify-between text-sm font-medium">
              <span>Total: Rs. {Number(totalAmount)}</span>
              <span
                className={
                  remainingAmount === 0 ? "text-green-600" : "text-orange-700"
                }
              >
                Remaining: Rs. {remainingAmount.toFixed(2)}
              </span>
            </div>

            {members?.group_members.map((member, index) => (
              <div
                key={member.id}
                className="flex justify-between items-center"
              >
                <span>{member.user.full_name}</span>
                <Controller
                  name={`participants.${index}.share_amount`}
                  control={form.control}
                  render={({ field }) => (
                    <div className="relative max-w-32">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        Rs.
                      </span>
                      <Input
                        {...field}
                        type="number"
                        disabled={isSubmiting}
                        className="pl-8"
                      />
                    </div>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {/* Percentage */}
        {splitType === "percentage" && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex border rounded-lg p-2 justify-between text-sm font-medium">
              <span>Total: 100%</span>
              <span
                className={
                  remainingPercentage === 0
                    ? "text-green-600"
                    : "text-orange-700"
                }
              >
                Remaining: {remainingPercentage.toFixed(2)}%
              </span>
            </div>
            {members?.group_members.map((member, index) => (
              <div
                key={member.id}
                className="flex justify-between items-center"
              >
                <span>{member.user.full_name}</span>
                <Controller
                  name={`participants.${index}.percentage`}
                  control={form.control}
                  render={({ field }) => (
                    <div className="relative max-w-32">
                      <Input
                        {...field}
                        type="number"
                        disabled={isSubmiting}
                        className="pr-7"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </FieldGroup>

      <div
        className={cn(
          "mt-5",
          expenseData ? "flex items-center justify-between " : "float-end",
        )}
      >
        {expenseData && (
          <ExpenseDelete
            closeDialog={closeDialog}
            expenseId={String(expenseData.id)}
          />
        )}
        <Button type="submit" size={"xl"} disabled={isSubmiting}>
          {expenseData
            ? isSubmiting
              ? "Updating"
              : "Update"
            : isSubmiting
              ? "Creating"
              : "Create"}
        </Button>
      </div>
    </form>
  );
};
