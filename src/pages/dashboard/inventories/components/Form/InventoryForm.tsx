"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FormikErrors, useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Link, Select, SelectItem, Spinner } from "@nextui-org/react";
import { InputGroupType } from "@/typings/inputType";
import { InventoryBody } from "./inventoryBody";
import useSWR from "swr";

const initialForm: InventoryBody = {
  id: "",
  name: "",
  stock: 0,
  price: 0,
  category_id: "",
  unit_id: "",
};

type UserFormProps = {
  initialValues?: typeof initialForm;
  formType: "NEW" | "EDIT";
  onSubmit: (values: InventoryBody) => Promise<void>;
  isMutate: boolean;
  initialSelectedCategory?: {
    id: string;
    kode: string;
    nama: string;
  };
  initialSelectedUnit?: {
    id: string;
    kode: string;
    nama: string;
  };
};

export default function InventoryForm({ initialValues = initialForm, formType, onSubmit, initialSelectedCategory, initialSelectedUnit, isMutate }: UserFormProps) {
  const { data: categories, isLoading: isLoadingCategories } = useSWR<ApiSuccessResponse<Category[]>>("/kategori");
  const { data: units, isLoading: isLoadingUnits } = useSWR<ApiSuccessResponse<Unit[]>>("/satuan");

  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [unitsData, setUnitsData] = useState<Unit[]>([]);

  useEffect(() => {
    if (isLoadingCategories) return;

    setCategoriesData(categories?.data ?? []);
  }, [categories, isLoadingCategories]);

  useEffect(() => {
    if (isLoadingUnits) return;

    setUnitsData(units?.data ?? []);
  }, [units, isLoadingUnits]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      id: Yup.string().required("ID Pelanggan harus diisi"),
      name: Yup.string().required("Nama Pelanggan harus diisi"),
      stock: Yup.number(),
      price: Yup.number().required("Harga harus diisi"),
      category_id: Yup.string().required("Kategori harus diisi"),
      unit_id: Yup.string().required("Satuan barang harus diisi"),
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
      label: "ID Barang",
      placeholder: "BRG001",
      type: "text",
    },
    {
      name: "name",
      label: "Nama",
      placeholder: "Nama Barang",
      type: "text",
    },
    {
      name: "price",
      label: "Harga",
      placeholder: "Harga barang",
      type: "number",
    },
    {
      name: "stock",
      label: "Stok",
      placeholder: "Stok barang saat ini",
      type: "number",
    },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
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
              value={formik.values[input.name].toString()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={isInputError(input.name)}
              errorMessage={isInputError(input.name) ? getInputErrorMessage(input.name) : ""}
            />
          ))}
        </div>

        {isLoadingUnits ? (
          <div>Loading satuan</div>
        ) : (
          <Select
            id="unit_id"
            variant="bordered"
            classNames={{
              value: "text-black",
            }}
            radius="sm"
            labelPlacement="outside"
            size="lg"
            label="Satuan Barang"
            placeholder={initialValues.unit_id ? initialSelectedUnit?.nama : "Pilih Satuan"}
            name="unit_id"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={isInputError("unit_id")}
            errorMessage={isInputError("unit_id") ? getInputErrorMessage("unit_id") : ""}
          >
            {unitsData.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.nama}
              </SelectItem>
            ))}
          </Select>
        )}

        {isLoadingCategories ? (
          <div>Loading kategori</div>
        ) : (
          <Select
            id="category_id"
            variant="bordered"
            classNames={{
              value: "text-black",
            }}
            radius="sm"
            labelPlacement="outside"
            size="lg"
            label="Kategori Barang"
            placeholder={initialValues.category_id ? initialSelectedCategory?.nama : "Pilih Kategori"}
            name="category_id"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={isInputError("category_id")}
            errorMessage={isInputError("category_id") ? getInputErrorMessage("category_id") : ""}
          >
            {categoriesData.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.nama}
              </SelectItem>
            ))}
          </Select>
        )}
      </div>

      <div className="pt-10 flex justify-end items-center gap-3">
        <Button as={Link} href="/dashboard/inventories" variant="light" className="font-semibold">
          Batal
        </Button>
        <Button color="primary" type="submit" className="py-6 font-semibold" isDisabled={isMutate}>
          {isMutate && <Spinner color="default" size="sm" />}
          {formType === "NEW" ? "Tambah Barang" : "Edit Barang"}
        </Button>
      </div>
    </form>
  );
}
