import RpIcon from "@/icons/RpIcon";
import { InputGroupType } from "@/typings/inputType";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Link,
  Select,
  SelectItem,
  SelectedItems,
  Spinner,
} from "@nextui-org/react";
import { FormikErrors, useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { LuPackagePlus } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { ItemsProps } from "../../add/AddTransactionIn";
import {
  Item,
  TransactionInBody,
  TransactionInInitialForm,
} from "./transactionInBody";
import { formatToRupiah } from "@/utils/formatToRupiah";

const initialForm: TransactionInInitialForm = {
  id: "",
  lotNumber: "",
  date: "",
  totalPrice: 0,
};

type ItemList = {
  key: string;
} & Item;

type TransactionInFormProps = {
  initialValues?: typeof initialForm;
  initialValueOptions: {
    inventoryItems: Inventory[];
    initialItemValue?: ItemList[];
  };
  formType: "NEW" | "EDIT";
  onSubmit: (values: TransactionInBody, items: ItemsProps[]) => Promise<void>;
  isMutate: boolean;
};

export default function TransactionInForm({
  initialValues = initialForm,
  formType,
  initialValueOptions: {
    inventoryItems,
    initialItemValue = [
      { key: "a7ga7w7ha-awhawh", id: "", price: 0, total: 1 },
    ],
  },
  onSubmit,
  isMutate,
}: TransactionInFormProps) {
  const [items, setItems] = useState<ItemList[]>([...initialItemValue]);
  const totalPrice = useMemo(() => {
    const total = items.reduce((prev, current) => {
      const currentPrice = isNaN(current.price) ? 0 : current.price;
      const currentTotal = isNaN(current.total) ? 0 : current.total;
      const subTotal = currentPrice * currentTotal;
      return prev + subTotal;
    }, 0);

    return total;
  }, [items]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: initialValues.id,
      lotNumber: initialValues.lotNumber,
      date: initialValues.date,
      totalPrice: initialValues.totalPrice,
    },
    validationSchema: Yup.object({
      id: Yup.string().required("ID Transaksi harus diisi"),
      lotNumber: Yup.string().required("Nomot LOT harus diisi"),
      date: Yup.date().required("Tanggal transaksi harus diisi"),
    }),
    onSubmit: (values) => {
      const mappeditems = items.map((item) => {
        const { key, ...others } = item;
        return others;
      });

      values.totalPrice = totalPrice;

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
      label: "ID Transaksi",
      placeholder: "TR-12022020",
      type: "text",
    },
    {
      name: "lotNumber",
      label: "Nomor LOT",
      placeholder: "LOT-1351",
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

                <Input
                  isRequired
                  name="total"
                  type="number"
                  variant="bordered"
                  min="1"
                  label="Jumlah"
                  labelPlacement="outside"
                  placeholder="Total Barang"
                  value={item.total.toString()}
                  onValueChange={(value) =>
                    onItemChange("total", parseInt(value), index)
                  }
                />

                <Input
                  isRequired
                  name="price"
                  startContent={<RpIcon />}
                  type="number"
                  variant="bordered"
                  label="Harga"
                  labelPlacement="outside"
                  placeholder="Harga per satuan"
                  value={item.price.toString()}
                  onValueChange={(value) =>
                    onItemChange("price", parseInt(value), index)
                  }
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">,00</span>
                    </div>
                  }
                />
                <Button
                  isIconOnly
                  onPress={() => {
                    setItems(items.filter((item, i) => i !== index));
                  }}
                  className={twMerge(items.length <= 1 && "hidden")}
                >
                  X
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-10">
            <Input
              startContent={<RpIcon />}
              disabled
              className="col-start-3"
              name="totalPrice"
              type="text"
              variant="underlined"
              label="Total Harga"
              labelPlacement="outside-left"
              placeholder="Total Harga"
              value={formatToRupiah(totalPrice).toString()}
            />
          </div>

          <Button
            onPress={() => {
              setItems((prev) => [
                ...prev,
                {
                  key: uuidv4(),
                  id: "",
                  price: 0,
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
          href="/dashboard/transactions-in"
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
