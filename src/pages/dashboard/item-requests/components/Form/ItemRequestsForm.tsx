import { InputGroupType } from "@/typings/inputType";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Link,
  Spinner,
} from "@nextui-org/react";
import { FormikErrors, useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { LuPackagePlus } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { ItemsProps } from "../../add/AddItemRequest";
import {
  Item,
  ItemRequestsBody,
  ItemRequestsInitialForm,
} from "./itemRequestsBody";

const initialForm: ItemRequestsInitialForm = {
  id: "",
  customer_id: "",
  user_id: "",
  date: "",
};

type ItemList = {
  key: string;
} & Item;

type ItemRequestsFormProps = {
  initialValues?: typeof initialForm;
  initialValueOptions: {
    inventoryItems: Inventory[];
    customerItems: Customer[];
    userItems: User[];
    initialItemValue?: ItemList[];
  };
  formType: "NEW" | "EDIT";
  onSubmit: (values: ItemRequestsBody, items: ItemsProps[]) => Promise<void>;
  isMutate: boolean;
};

export default function ItemRequestsForm({
  initialValues = initialForm,
  formType,
  initialValueOptions: {
    inventoryItems,
    customerItems,
    userItems,
    initialItemValue = [
      {
        key: "a7ga7w7ha-awhawh",
        id: "",
        total: 1,
      },
    ],
  },
  onSubmit,
  isMutate,
}: ItemRequestsFormProps) {
  const [items, setItems] = useState<ItemList[]>([...initialItemValue]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: initialValues.id,
      customer_id: initialValues.customer_id,
      user_id: initialValues.user_id,
      date: initialValues.date,
    },
    validationSchema: Yup.object({
      id: Yup.string().required("ID Transaksi harus diisi"),
      customer_id: Yup.string().required("Pelanggan harus diisi"),
      user_id: Yup.string().required("Pegawai harus diisi"),
      date: Yup.date().required("Tanggal transaksi harus diisi"),
    }),
    onSubmit: (values) => {
      const mappeditems = items
        .filter((item) => item.id && item.total)
        .map((item) => {
          const { key, ...others } = item;
          return others;
        });

      onSubmit(values, mappeditems);
    },
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
      name: "id",
      label: "ID Permintaan Barang",
      placeholder: "PB-12022020",
      type: "text",
    },
    {
      name: "date",
      label: "Tanggal Transaksi Barang Masuk",
      placeholder: "Tanggal",
      type: "datetime-local",
    },
  ];

  const onItemChange = (
    inputName: string,
    value: string | number,
    index: number,
  ) => {
    const newItemsArray = items.map((item, i) => {
      if (i !== index) return item;

      return {
        ...item,
        [inputName]: value,
      };
    });

    setItems(newItemsArray);
  };

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
              value={formik.values[input.name].toString()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={isInputError(input.name)}
              errorMessage={
                isInputError(input.name) ? getInputErrorMessage(input.name) : ""
              }
            />
          ))}

          <div>{JSON.stringify(formik.values)}</div>

          <Autocomplete
            size="lg"
            radius="sm"
            id="user_id"
            name="user_id"
            value={formik.values["user_id"]}
            label="Pegawai"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Pilih Pegawai yang menerima Permintaan Barang"
            onSelectionChange={(value) => {
              formik.setFieldValue("user_id", value);
            }}
          >
            {userItems.map((item) => (
              <AutocompleteItem key={item.id} value={item.id}>
                {item.namaLengkap}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Autocomplete
            size="lg"
            radius="sm"
            id="customer_id"
            name="customer_id"
            value={formik.values["customer_id"]}
            label="Pelanggan"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Pilih Pelanggan"
            onSelectionChange={(value) => {
              formik.setFieldValue("customer_id", value);
            }}
          >
            {customerItems.map((item) => (
              <AutocompleteItem key={item.id} value={item.id}>
                {item.nama}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <div>{JSON.stringify(items, null, 2)}</div>

          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.key}
                variants={{
                  hidden: {
                    opacity: "0",
                    y: -50,
                  },
                  visible: {
                    opacity: "1",
                    y: 0,
                  },
                }}
                transition={{
                  type: "tween",
                  duration: 0.2,
                  bounce: 0.2,
                }}
                initial="hidden"
                animate="visible"
                className="flex items-end gap-10"
              >
                <div className="flex flex-wrap md:flex-nowrap gap-4">
                  <Autocomplete
                    isRequired
                    label="Barang"
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="Pilih Barang"
                    disabledKeys={items.map((item) => item.id)}
                    className="max-w-xs"
                    onSelectionChange={(value) => {
                      onItemChange("id", value as string, index);
                    }}
                  >
                    {inventoryItems.map((item) => (
                      <AutocompleteItem key={item.id} value={item.id}>
                        {`${item.nama} (${item.satuan.nama})`}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>

                <Input
                  isRequired
                  name="total"
                  type="number"
                  variant="bordered"
                  min="1"
                  label="Jumlah"
                  labelPlacement="outside"
                  placeholder="Total Barang"
                  className="max-w-xs"
                  value={item.total.toString()}
                  onValueChange={(value) =>
                    onItemChange("total", parseInt(value), index)
                  }
                />

                <Button
                  isIconOnly
                  onPress={() => {
                    setItems(items.filter((item, i) => i !== index));
                  }}
                  className={twMerge(items.length <= 1 && "hidden")}
                >
                  <RxCross2 />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            onPress={() => {
              setItems((prev) => [
                ...prev,
                {
                  key: uuidv4(),
                  id: "",
                  total: 1,
                },
              ]);
            }}
            startContent={<LuPackagePlus />}
            variant="flat"
          >
            Tambah Barang
          </Button>
        </div>
      </div>

      <div className="pt-10 flex justify-end items-center gap-3">
        <Button
          as={Link}
          href="/dashboard/item-requests"
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
          {formType === "NEW" ? "Simpan" : "Edit"}
        </Button>
      </div>
    </form>
  );
}
