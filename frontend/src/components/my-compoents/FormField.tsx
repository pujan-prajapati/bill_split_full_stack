import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  required?: boolean;
  placeholder?: string;
  label?: string;
  control: Control<T>;
  type?: string;
  disabled?: boolean;
  className?: string;
}

export const FormField = <T extends FieldValues>({
  name,
  label,
  required,
  control,
  placeholder,
  type = "text",
  disabled = false,
  className,
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>
            {label} {required ? <span className="required">*</span> : null}
          </FieldLabel>
          <Input
            {...field}
            type={type}
            disabled={disabled}
            className={className}
            placeholder={placeholder}
            id={name}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
