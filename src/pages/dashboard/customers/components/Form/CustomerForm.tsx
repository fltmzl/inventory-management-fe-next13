"use client";

import React from "react";
import { FormikErrors, useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Link, Select, SelectItem, Spinner } from "@nextui-org/react";
import { CustomerBody } from "./customerBody";
import { InputGroupType } from "@/typings/inputType";

const initialForm: CustomerBody = {
  id: "",
  name: "",
  phoneNumber: "",
  email: "",
  address: "",
};

type UserFormProps = {
  initialValues?: typeof initialForm;
  formType: "NEW" | "EDIT";
  onSubmit: (values: CustomerBody) => Promise<void>;
  isMutate: boolean;
};

export default function CustomerForm({ initialValues = initialForm, formType, onSubmit, isMutate }: UserFormProps) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      id: Yup.string().required("ID Pelanggan harus diisi"),
      name: Yup.string().required("Nama Pelanggan harus diisi"),
      phoneNumber: Yup.string()
        .matches(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/, "Nomor telepon tidak valid")
        .required("Nomor telepon harus diisi"),
      email: Yup.string().email("Email harus sesuai format"),
      address: Yup.string().required("Alamat harus diisi"),
    }),
    onSubmit: onSubmit,
  });

  const isInputError = (inputName: keyof FormikErrors<typeof initialValues>): boolean => {
    return Boolean(formik.errors[inputName] && formik.touched[inputName]);
  };

  const getInputErrorMessage = (inputName: keyof FormikErrors<typeof initialValues>): string | undefined => {
    return formik.errors[inputName];
  };

  const inputGroup: InputGroupType<typeof initialValues>[] = [
    {
      name: "id",
      label: "ID Pelanggan",
      placeholder: "P001",
      type: "text",
      disabled: formType === "EDIT",
    },
    {
      name: "name",
      label: "Nama",
      placeholder: "Nama Pelanggan / Restoran / Hotel",
      type: "text",
    },
    {
      name: "phoneNumber",
      label: "Telepon",
      placeholder: "08955556666",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "email@gmail.com",
      type: "text",
    },
    {
      name: "address",
      label: "Alamat",
      placeholder: "Jl Mawar",
      type: "text",
    },
  ];

  // const inputGroup2: InputGroupType[] = [
  //   {
  //     name: "email",
  //     label: "Email",
  //     placeholder: "you@email.com",
  //     type: "email",
  //   },
  //   {
  //     name: "phoneNumber",
  //     label: "Nomor Telepon",
  //     placeholder: "089 9999 9999",
  //     type: "text",
  //   },
  //   {
  //     name: "password",
  //     label: "Password",
  //     placeholder: "********",
  //     type: "password",
  //     disabled: formType === "EDIT",
  //   },
  //   {
  //     name: "address",
  //     label: "Alamat",
  //     placeholder: "Jl Mawar Rt Rw",
  //     type: "text",
  //   },
  //   {
  //     name: "confirmPassword",
  //     label: "Konfirmasi Password",
  //     placeholder: "********",
  //     type: "password",
  //     disabled: formType === "EDIT",
  //   },
  // ];

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
              errorMessage={isInputError(input.name) ? getInputErrorMessage(input.name) : ""}
              isDisabled={input.disabled}
            />
          ))}
        </div>
      </div>

      {/* <div className="grid grid-cols-2 gap-9">
        {inputGroup2.map((input) => (
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
            disabled={input.disabled}
            value={formik.values[input.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={isInputError(input.name)}
            errorMessage={isInputError(input.name) ? getInputErrorMessage(input.name) : ""}
          />
        ))}
      </div> */}

      <div className="pt-10 flex justify-end items-center gap-3">
        <Button as={Link} href="/dashboard/customers" variant="light" className="font-semibold">
          Batal
        </Button>
        <Button color="primary" type="submit" className="py-6 font-semibold" isDisabled={isMutate}>
          {isMutate && <Spinner color="default" size="sm" />}
          {formType === "NEW" ? "Tambah Pelanggan" : "Edit Pelanggan"}
        </Button>
      </div>
    </form>
  );
}
