"use client";

import React, { InputHTMLAttributes, useState } from "react";
import { Formik, FormikErrors, FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Link, Select, SelectItem, Selection } from "@nextui-org/react";
import { api } from "@/utils/axios";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

const initialForm = {
  fullname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  address: "",
  role: "",
};

type UserFormProps = {
  initialValues?: typeof initialForm;
  formType: "NEW" | "EDIT";
  userId?: string;
};

export default function UserForm({
  initialValues = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    role: "",
  },
  formType,
  userId,
}: UserFormProps) {
  const router = useRouter();

  // const formik = useFormik({
  //   initialValues,
  //   validationSchema: Yup.object({
  //     fullname: Yup.string().required("Nama lengkap harus diisi"),
  //     username: Yup.string().required("Username harus diisi"),
  //     email: Yup.string().email("Email Anda tidak sesuai format").required("Username harus diisi"),
  //     password: formType === "NEW" ? Yup.string().min(8, "Password minimal 8 karakter").required("Password harus diisi") : Yup.string().notRequired(),
  //     confirmPassword:
  //       formType === "NEW"
  //         ? Yup.string()
  //             .oneOf([Yup.ref("password"), ""], "Konfirmasi Password tidak cocok")
  //             .required("Konfirmasi Password harus diisi")
  //         : Yup.string().notRequired(),
  //     phoneNumber: Yup.string()
  //       .matches(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/, "Nomor telepon tidak valid")
  //       .required("Nomor telepon harus diisi"),
  //     address: Yup.string().required("Alamat harus diisi"),
  //     role: Yup.string().required("Jabatan harus diisi"),
  //   }),
  //   onSubmit: async (values) => {
  //     const { address, email, fullname, password, phoneNumber, role, username } = values;

  //     try {
  //       let user;

  //       if (formType === "NEW") {
  //         user = await api.post("/pegawai", {
  //           namaLengkap: fullname,
  //           username,
  //           email,
  //           foto: "https://i.pravatar.cc/150?img=53",
  //           telepon: phoneNumber,
  //           password,
  //           alamat: address,
  //           role: role.toUpperCase(),
  //         });
  //       } else {
  //         user = await api.put(`/pegawai/${userId}`, {
  //           namaLengkap: fullname,
  //           username,
  //           email,
  //           foto: "https://i.pravatar.cc/150?img=53",
  //           telepon: phoneNumber,
  //           alamat: address,
  //           role: role.toUpperCase(),
  //         });
  //       }

  //       console.log(user);
  //       router.push("/dashboard/users");
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  // });

  const isInputError = (
    formikContext: FormikProps<{
      fullname: string;
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      phoneNumber: string;
      address: string;
      role: string;
    }>,
    inputName: keyof FormikErrors<typeof initialValues>
  ): boolean => {
    return Boolean(formikContext.errors[inputName] && formikContext.touched[inputName]);
  };

  const getInputErrorMessage = (
    formikContext: FormikProps<{
      fullname: string;
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      phoneNumber: string;
      address: string;
      role: string;
    }>,
    inputName: keyof FormikErrors<typeof initialValues>
  ): string | undefined => {
    return formikContext.errors[inputName];
  };

  type InputType = "text" | "email" | "password" | "number" | "checkbox" | "radio" | "file" | "submit" | "reset" | "button";

  type InputGroupType = {
    name: keyof FormikErrors<Omit<typeof initialValues, "role">>;
    label: string;
    placeholder: string;
    type: InputType;
    disabled?: boolean;
  };

  const inputGroup1: InputGroupType[] = [
    {
      name: "fullname",
      label: "Nama Lengkap",
      placeholder: "John Doe",
      type: "text",
    },
    {
      name: "username",
      label: "Username",
      placeholder: "johndoe",
      type: "text",
    },
  ];

  const inputGroup2: InputGroupType[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "you@email.com",
      type: "email",
    },
    {
      name: "phoneNumber",
      label: "Nomor Telepon",
      placeholder: "089 9999 9999",
      type: "text",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "********",
      type: "password",
      disabled: true,
    },
    {
      name: "address",
      label: "Alamat",
      placeholder: "Jl Mawar Rt Rw",
      type: "text",
    },
    {
      name: "confirmPassword",
      label: "Konfirmasi Password",
      placeholder: "********",
      type: "password",
      disabled: true,
    },
  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={Yup.object({
        fullname: Yup.string().required("Nama lengkap harus diisi"),
        username: Yup.string().required("Username harus diisi"),
        email: Yup.string().email("Email Anda tidak sesuai format").required("Username harus diisi"),
        password: formType === "NEW" ? Yup.string().min(8, "Password minimal 8 karakter").required("Password harus diisi") : Yup.string().notRequired(),
        confirmPassword:
          formType === "NEW"
            ? Yup.string()
                .oneOf([Yup.ref("password"), ""], "Konfirmasi Password tidak cocok")
                .required("Konfirmasi Password harus diisi")
            : Yup.string().notRequired(),
        phoneNumber: Yup.string()
          .matches(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/, "Nomor telepon tidak valid")
          .required("Nomor telepon harus diisi"),
        address: Yup.string().required("Alamat harus diisi"),
        role: Yup.string().required("Jabatan harus diisi"),
      })}
      onSubmit={async (values) => {
        const { address, email, fullname, password, phoneNumber, role, username } = values;

        try {
          let user;

          if (formType === "NEW") {
            user = await api.post("/pegawai", {
              namaLengkap: fullname,
              username,
              email,
              foto: "https://i.pravatar.cc/150?img=53",
              telepon: phoneNumber,
              password,
              alamat: address,
              role: role.toUpperCase(),
            });
          } else {
            user = await api.put(`/pegawai/${userId}`, {
              namaLengkap: fullname,
              username,
              email,
              foto: "https://i.pravatar.cc/150?img=53",
              telepon: phoneNumber,
              alamat: address,
              role: role.toUpperCase(),
            });
          }

          console.log(user);
          router.push("/dashboard/users");
        } catch (err) {
          console.log(err);
        }
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-9">
            <p>{initialValues.fullname}</p>
            <div className="space-y-12">
              {inputGroup1.map((input) => (
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
                  isInvalid={isInputError(formik, input.name)}
                  errorMessage={isInputError(formik, input.name) ? getInputErrorMessage(formik, input.name) : ""}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-9">
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
                isInvalid={isInputError(formik, input.name)}
                errorMessage={isInputError(formik, input.name) ? getInputErrorMessage(formik, input.name) : ""}
              />
            ))}

            <div>
              <Select
                id="role"
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                size="lg"
                label="Jabatan / Role"
                placeholder={initialValues.role ?? "Pilih Jabatan"}
                name="role"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={isInputError(formik, "role")}
                errorMessage={isInputError(formik, "role") ? getInputErrorMessage(formik, "role") : ""}
              >
                {/* selectedKeys={role}
                onSelectionChange={setRole} */}
                <SelectItem key="admin" value="admin">
                  Admin
                </SelectItem>
                <SelectItem key="owner" value="owner">
                  Owner
                </SelectItem>
              </Select>
            </div>
          </div>

          <div className="pt-10 flex justify-end items-center gap-3">
            <Button as={Link} href="/dashboard/users" variant="light" className="font-semibold">
              Batal
            </Button>
            <Button color="primary" type="submit" className="py-6 font-semibold">
              {formType === "NEW" ? "Tambah Karyawan" : "Edit Karyawan"}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
