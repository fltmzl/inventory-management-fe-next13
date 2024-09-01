import RpIcon from "@/icons/RpIcon";
import { InputGroupType } from "@/typings/inputType";
import { Autocomplete, AutocompleteItem, Button, Input, Link } from "@nextui-org/react";
import { FormikErrors, useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { LuPackagePlus } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { RxCross2 } from "react-icons/rx";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { ItemsProps } from "../../add/AddTransactionOut";
import { Item, TransactionOutBody, TransactionOutInitialForm } from "./transactionOutBody";
import { api } from "@/utils/axios";
import { formatToRupiah } from "@/utils/formatToRupiah";

const initialForm: TransactionOutInitialForm = {
  id: "",
  itemRequest_id: "",
  date: "",
  totalPrice: 0,
};

type ItemList = {
  key: string;
} & Item;

type TransactionOutFormProps = {
  initialValues?: typeof initialForm;
  initialValueOptions: {
    inventoryItems: Inventory[];
    itemRequestItems: ItemRequest[];
    initialItemValue?: ItemList[];
  };
  formType: "NEW" | "EDIT";
  onSubmit: (values: TransactionOutBody, items: ItemsProps[]) => Promise<void>;
};

export default function TransactionOutForm({ initialValues = initialForm, formType, initialValueOptions: { inventoryItems, itemRequestItems, initialItemValue = [] }, onSubmit }: TransactionOutFormProps) {
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

  const handleItemRequestChange = async (itemRequestId: string) => {
    if (!itemRequestId) return setItems([]);

    const res = await api.get<ApiSuccessResponse<ItemRequest>>(`/permintaan-barang/${itemRequestId}`);

    const mappedItems = res.data.data.barang.map((barangItem) => ({
      key: uuidv4(),
      id: barangItem.id,
      price: 0,
      total: barangItem.jumlah,
    }));

    setItems(mappedItems);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: initialValues.id,
      itemRequest_id: initialValues.itemRequest_id,
      date: initialValues.date,
      totalPrice: initialValues.totalPrice,
    },
    validationSchema: Yup.object({
      id: Yup.string().required("ID Transaksi harus diisi"),
      itemRequest_id: Yup.string().required("Permintaan Barang harus diisi"),
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

  const isInputError = (inputName: keyof FormikErrors<typeof initialValues>): boolean => {
    return Boolean(formik.errors[inputName] && formik.touched[inputName]);
  };

  const getInputErrorMessage = (inputName: keyof FormikErrors<typeof initialValues>): string | undefined => {
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
      name: "date",
      label: "Tanggal Transaksi Barang Keluar",
      placeholder: "Tanggal",
      type: "datetime-local",
    },
  ];

  const onItemChange = (inputName: string, value: string | number, index: number) => {
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
              value={formik.values[input.name]?.toString()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={isInputError(input.name)}
              errorMessage={isInputError(input.name) ? getInputErrorMessage(input.name) : ""}
            />
          ))}

          <Autocomplete
            size="lg"
            radius="sm"
            id="itemRequest_id"
            name="itemRequest_id"
            value={formik.values["itemRequest_id"]}
            label="Permintaan Barang"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Pilih Permintaan Barang"
            onSelectionChange={(value) => {
              handleItemRequestChange(value as string);
              formik.setFieldValue("itemRequest_id", value);
            }}
          >
            {itemRequestItems.map((item) => (
              <AutocompleteItem key={item.id} value={item.id}>
                {`${item.id} - ${item.pelanggan.nama}`}
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
                <Autocomplete
                  isRequired
                  label="Barang"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Pilih Barang"
                  className="max-w-xs"
                  onSelectionChange={(value) => {
                    onItemChange("id", value, index);
                  }}
                  defaultSelectedKey={item.id}
                  isDisabled
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
                  onValueChange={(value) => onItemChange("total", parseInt(value), index)}
                  isDisabled
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
                  onValueChange={(value) => onItemChange("price", parseInt(value), index)}
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
                  <RxCross2 />
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
              value={formatToRupiah(totalPrice)}
            />
          </div>

          {/* <Button
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
          </Button> */}
        </div>
      </div>

      <div className="pt-10 flex justify-end items-center gap-3">
        <Button as={Link} href="/dashboard/transactions-out" variant="light" className="font-semibold">
          Batal
        </Button>
        <Button color="primary" type="submit" className="py-6 font-semibold">
          {formType === "NEW" ? "Simpan" : "Edit"}
        </Button>
      </div>
    </form>
  );
}
