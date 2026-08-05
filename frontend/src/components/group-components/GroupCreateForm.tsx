import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { groupCreateFormScheme } from "@/schemas/groupCreate.schema";
import { FormField } from "../my-compoents/FormField";
import { useFileUpload } from "@/hooks/use-file-upload";
import { CircleUserRoundIcon } from "lucide-react";
import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "@/context/auth.context";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { useCreateGroup, useUpdateGroup } from "@/hooks/group.hooks";
import type { GroupResponse } from "@/types/group.types";
import { cn } from "@/lib/utils";
import { GroupDelete } from "./GroupDelete";
import { useNavigate } from "@tanstack/react-router";

interface GroupCreateProps {
  closeDialog: () => void;
  groupData?: GroupResponse;
}

export const GroupCreateForm = ({
  closeDialog,
  groupData,
}: GroupCreateProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const previewUrl =
    files[0]?.preview ||
    (groupData?.group.image
      ? `${import.meta.env.VITE_IMAGE_URL}/${groupData?.group.image}`
      : null);

  const fileName =
    (files[0]?.file.name || groupData?.group.image?.split("/").pop()) ?? null;

  const form = useForm<z.infer<typeof groupCreateFormScheme>>({
    resolver: zodResolver(groupCreateFormScheme),
    defaultValues: {
      name: groupData?.group.name ?? "",
      description: groupData?.group.description ?? "",
    },
  });

  const { mutate: createMutate, isPending: isCreating } = useCreateGroup();
  const { mutate: UpdateMutate, isPending: isUpdating } = useUpdateGroup();

  const isSubmiting = isCreating || isUpdating;

  // on submit form
  function onSubmit(data: z.infer<typeof groupCreateFormScheme>) {
    const formData = {
      name: data.name,
      image: data.image,
      description: data.description,
      created_by: user?.id,
    };

    if (groupData) {
      UpdateMutate(
        { group_id: groupData.group.id.toString(), formData: data },
        {
          onSuccess: () => {
            toast.success("Group created success");
            form.reset();
            closeDialog();
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              toast.error("Failed to create group");
              form.reset();
            }
          },
        },
      );
    } else {
      createMutate(formData, {
        onSuccess: (response) => {
          toast.success("Group created success");
          form.reset();
          closeDialog();
          navigate({
            to: "/group/$group_id",
            params: {
              group_id: response.group.id.toString(),
            },
          });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error("Failed to create group");
            form.reset();
          }
        },
      });
    }
  }

  useEffect(() => {
    form.setValue("image", files[0]?.file as File, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [files, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3">
        {/* image */}
        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="image">Image (optional)</FieldLabel>

              <div className="flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 align-top">
                  <div className="border-input rounded-md relative flex size-9 shrink-0 items-center justify-center overflow-hidden border">
                    {previewUrl ? (
                      <img
                        className="size-full object-cover"
                        src={previewUrl}
                        alt="Preview of uploaded image"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <CircleUserRoundIcon
                        className="opacity-60"
                        width="16"
                        height="16"
                      />
                    )}
                  </div>
                  <div className="relative inline-block">
                    <Button
                      type="button"
                      disabled={isSubmiting}
                      onClick={openFileDialog}
                    >
                      {fileName ? "Change group image" : "Upload group image"}
                    </Button>
                    <input
                      {...getInputProps({
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        },
                      })}
                      className="sr-only"
                      tabIndex={-1}
                    />
                  </div>
                </div>
                {fileName ? (
                  <div className="inline-flex gap-2 text-xs">
                    <p
                      className="text-muted-foreground truncate"
                      aria-live="polite"
                    >
                      {fileName}
                    </p>{" "}
                    <button
                      type="button"
                      disabled={isSubmiting}
                      onClick={() => removeFile(files[0]?.id)}
                      className="text-destructive cursor-pointer font-medium hover:underline"
                      aria-label={`Remove ${fileName}`}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="inline-flex gap-2 text-xs">
                    <p
                      className="text-muted-foreground truncate"
                      aria-live="polite"
                    >
                      No image attached
                    </p>
                  </div>
                )}
              </div>
            </Field>
          )}
        />

        {/* name */}
        <FormField
          control={form.control}
          name="name"
          label="Name"
          placeholder="Enter group name"
          disabled={isSubmiting}
          required
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          label="Description (optional)"
          placeholder="Add a description"
          disabled={isSubmiting}
        />

        <Card className="bg-gray-100">
          <CardContent className="flex items-center justify-center gap-4">
            <div>
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}/${user?.avatar}`}
                alt={user?.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1>{user?.first_name + " " + user?.last_name}</h1>
                <Badge className="bg-green-600 text-white">Owner</Badge>
              </div>
              <h1>{user?.email}</h1>
            </div>
          </CardContent>
        </Card>
      </FieldGroup>

      <div
        className={cn(
          "mt-5",
          groupData ? "flex items-center justify-between " : "float-end",
        )}
      >
        {groupData && (
          <GroupDelete
            openDialog={closeDialog}
            groupId={groupData.group.id.toString()}
          />
        )}
        <Button type="submit" size={"xl"} disabled={isSubmiting}>
          {groupData
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
