import { InputGroupType } from "@/typings/inputType";
import { Button, Input, Link, Spinner } from "@nextui-org/react";
import { FormikErrors, useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

const initialForm: UnitBody = {
  code: "",
  name: "",
};

type UnitFormProps = {
  initialValues?: typeof initialForm;
  formType: "NEW" | "EDIT";
  onSubmit: (values: UnitBody) => Promise<void>;
  isMutate: boolean;
};

export default function UnitForm({
  initialValues = initialForm,
  formType,
  onSubmit,
  isMutate,
}: UnitFormProps) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      code: Yup.string().required("Kode satuan harus diisi"),
      name: Yup.string().required("Nama satuan harus diisi"),
    }),
    onSubmit: onSubmit,
  });

  const isInputError = (
    inputName: keyof FormikErrors<typeof initialValues>,
  ): boolean => {
    return Boolean(formik.errors[inputName] && formik.touched[inputName]);
  };

  const getInputErrorMessage = (
    inputName: keyof FormikErrors<typeof initialValues>,
  ): string | undefined => {
    return formik.errors[inputName];
  };

  const inputGroup: InputGroupType<typeof initialValues>[] = [
    {
      name: "code",
      label: "Kode",
      placeholder: "S001",
      type: "text",
    },
    {
      name: "name",
      label: "Nama Satuan",
      placeholder: "kg / g / ons / dll",
      type: "text",
    },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-9">
        <div className="space-y-12">
          {inputGroup.map((input) => (
            <Input
              key={input.name}
              size="lg"
              variant="bordered"
              labelPlacement="outside"
              placeholder={input.placeholder}
              radius="sm"
              type={input.type}
              label={input.label}
              id={input.name}
              name={input.name}
              value={formik.values[input.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={isInputError(input.name)}
              errorMessage={
                isInputError(input.name) ? getInputErrorMessage(input.name) : ""
              }
            />
          ))}
        </div>
      </div>

      <div className="pt-10 flex justify-end items-center gap-3">
        <Button
          as={Link}
          href="/dashboard/units"
          variant="light"
          className="font-semibold"
        >
          Batal
        </Button>
        <Button
          color="primary"
          type="submit"
          className="py-6 font-semibold"
          isDisabled={isMutate}
        >
          {isMutate && <Spinner color="default" size="sm" />}
          {formType === "NEW" ? "Tambah Satuan" : "Edit Satuan"}
        </Button>
      </div>
    </form>
  );
}
