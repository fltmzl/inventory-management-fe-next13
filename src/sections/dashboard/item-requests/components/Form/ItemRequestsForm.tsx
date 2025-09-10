import { InputGroupType } from "@/typings/inputType";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Link,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { FormikErrors, useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
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
} from "@/types/itemRequestsBody";
import { IdGenerator } from "@/utils/core/idGenerator";
import useCtrlEnter from "@/hooks/custom/useCtrlEnter";
import Fuse from "fuse.js";
import useSWR from "swr";

const initialForm: ItemRequestsInitialForm = {
  id: IdGenerator.itemRequestId(),
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
  const [message, setMessage] = useState("");
  const { data: user, isLoading } = useSWR<User>("/auth/profile");
  const [notFoundItemsInInventory, setNotFoundItemsInInventory] = useState<
    {
      item: string;
      qty: number;
      price: number | null;
    }[]
  >([]);

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

  useEffect(() => {
    if (formType === "EDIT") return;

    formik.values.id = IdGenerator.itemRequestId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType]);

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
      label: "Tanggal Permintaan",
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

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        key: uuidv4(),
        id: "",
        total: 1,
      },
    ]);
  };

  const disabledKeysItems = useMemo(() => {
    const selectedItems = items.map((item) => item.id);
    const outOfStockItems = inventoryItems
      .filter((item) => item.stok < 1)
      .map((item) => item.id);

    return [...selectedItems, ...outOfStockItems];
  }, [items, inventoryItems]);

  useCtrlEnter({
    callback: addItem,
  });

  const getTotalStock = (
    inventoryItems: Inventory[],
    item: ItemList,
  ): number => {
    const selectedItem = inventoryItems.find(
      (inventoryItem) => inventoryItem.id === item.id,
    );
    if (!selectedItem) return 0;
    return selectedItem.stok;
  };

  function normalizeMessage(message: string) {
    return message
      .replace(/^[-•⦁*]\s*/, "") // buang bullet
      .replace(/([a-zA-Z])[,\.]([a-zA-Z])/g, "$1 $2") // koma/titik antara huruf jadi spasi
      .replace(/[,\.]/g, "") // hapus koma/titik sisa
      .replace(/\s+/g, " ") // ganti banyak spasi jadi 1
      .trim();
  }

  function extractItemsFromMessage(message: string) {
    // regex for extract items and quantity / price
    const regex = /^(.+?)\s+((\d+\/\d+)|(\d+(\.\d+)?)|(\d+)?\s*rb)?$/i;

    const lines = message
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const items = [];

    for (let line of lines) {
      // Bersihkan titik/koma di dalam nama
      const cleanedLine = normalizeMessage(line);

      const match = cleanedLine.match(regex);

      if (match) {
        let item = match[1];
        let qtyRaw = match[2] || "";

        let qty = null;
        let price = null;

        if (/rb$/i.test(qtyRaw)) {
          price = parseInt(qtyRaw.replace(/\D/g, "")) * 1000;
        } else if (qtyRaw.includes("/")) {
          const [a, b] = qtyRaw.split("/").map(Number);
          qty = a / b;
        } else if (qtyRaw) {
          qty = parseFloat(qtyRaw);
        }

        items.push({ item, qty, price });
      } else {
        console.log(`Gagal parsing: ${line}`);
      }
    }

    return items;
  }

  function parseWAOrder(rawText: string) {
    const lines = rawText
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    // Ambil header
    const headerMatch = lines[0].match(
      /^Order\s+([a-zA-Z\s]+)\s+(\d{1,2}\/\d{1,2})$/i,
    );
    const restoran = headerMatch ? headerMatch[1].trim().toLowerCase() : null;

    const tanggal = headerMatch ? headerMatch[2] : null;
    const [date, month] = tanggal?.split("/") as [string, string];
    const tanggalFormatted = `${new Date().getFullYear()}-${month.padStart(2, "0")}-${date.padStart(2, "0")}T08:00`;

    // Ambil list item dari baris ke-2 sampai sebelum baris terakhir
    const listLines = lines.slice(
      1,
      lines.length > 2 ? lines.length - 1 : undefined,
    );
    const listText = listLines.join("\n");
    const items = extractItemsFromMessage(listText);

    // Ambil catatan jika ada
    const possibleNote = lines.length > 2 ? lines[lines.length - 1] : null;
    const isNote =
      possibleNote && !possibleNote.toLowerCase().includes("bayam");
    const catatan = isNote ? possibleNote : null;

    return { restoran, tanggal: tanggalFormatted, items, catatan };
  }

  const fuseInventoryItems = useMemo(() => {
    return new Fuse(inventoryItems, {
      keys: ["nama"],
      threshold: 0.3,
    });
  }, [inventoryItems]);

  const fuseCustomerItems = useMemo(() => {
    return new Fuse(customerItems, {
      keys: ["nama"],
      threshold: 0.3,
    });
  }, [customerItems]);

  const handleConvertMessage = () => {
    const result = parseWAOrder(message);

    formik.setFieldValue("date", result.tanggal);
    formik.setFieldValue("user_id", user?.id || "");

    const foundedCustomer = fuseCustomerItems.search(result?.restoran || "");

    if (foundedCustomer.length > 0) {
      formik.setFieldValue("customer_id", foundedCustomer[0].item.id);
    }

    const found: any[] = [];
    const notFound: any[] = [];

    for (const item of result.items) {
      const result = fuseInventoryItems.search(item.item);

      if (result.length > 0) {
        // Ambil hasil terbaik (paling mirip)
        found.push({
          ...item,
          matchedWith: result[0].item,
        });
      } else {
        notFound.push(item);
      }
    }

    const mappedMatchedItems: ItemList[] = found.map((item) => ({
      key: uuidv4(),
      id: item.matchedWith.id,
      total: item.qty,
    }));

    setItems(mappedMatchedItems);
    setNotFoundItemsInInventory(notFound);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-9">
        <div className="grid gap-5">
          <Input
            key={"id"}
            size="lg"
            variant="bordered"
            labelPlacement="outside"
            placeholder={"PB-12022020"}
            radius="sm"
            type={"text"}
            label={"ID Permintaan Barang"}
            id={"id"}
            name={"id"}
            value={formik.values["id"].toString()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={isInputError("id")}
            errorMessage={isInputError("id") ? getInputErrorMessage("id") : ""}
          />

          <div>
            <Textarea
              size="lg"
              variant="bordered"
              labelPlacement="outside"
              placeholder={`Masukkan Pesan dari Whatsapp untuk dikonversi otomatis, Contoh Format Text: \n\nOrder gama 3/1\n\n- bayam 10\n- beby buncis muda 5\n- gingseng 5\n- glandir 10\n- jeruk nipis 1\n- kangkung 20\n- tiimun ijo 5\n- tomat ijo 1\n- wortel besar 3 \n\nDatang jam 8`}
              radius="sm"
              label="Pesan Permintaan Barang dari Whatsapp"
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button
              className="w-full font-bold tracking-wide mt-2"
              size="sm"
              type="button"
              color="primary"
              onClick={handleConvertMessage}
              disabled={!message}
            >
              Convert
            </Button>
          </div>

          <Input
            key={"date"}
            size="lg"
            variant="bordered"
            labelPlacement="outside"
            placeholder={"Tanggal"}
            radius="sm"
            type={"datetime-local"}
            label={"Tanggal Permintaan"}
            id={"date"}
            name={"date"}
            value={formik.values["date"].toString()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={isInputError("date")}
            errorMessage={
              isInputError("date") ? getInputErrorMessage("date") : ""
            }
          />

          <Autocomplete
            size="lg"
            radius="sm"
            id="user_id"
            name="user_id"
            value={formik.values["user_id"]}
            selectedKey={formik.values["user_id"]}
            defaultSelectedKey={formik.values["user_id"]}
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
            selectedKey={formik.values["customer_id"]}
            defaultSelectedKey={formik.values["customer_id"]}
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
                className="flex items-start gap-10"
              >
                <div className="flex flex-wrap md:flex-nowrap gap-4">
                  <Autocomplete
                    isRequired
                    label="Barang"
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="Pilih Barang"
                    disabledKeys={disabledKeysItems}
                    defaultSelectedKey={item.id}
                    isInvalid={false}
                    className="max-w-xs"
                    onSelectionChange={(value) => {
                      onItemChange("id", value as string, index);
                    }}
                  >
                    {inventoryItems.map((item) => (
                      <AutocompleteItem key={item.id} value={item.id}>
                        {`${item.nama} (${item.satuan.nama}) ${item.stok < 1 ? " - Stok Habis" : ""}`}
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
                  max={getTotalStock(inventoryItems, item)}
                  errorMessage={`Stok Kurang, Total Stok: ${getTotalStock(inventoryItems, item)}`}
                  isInvalid={
                    Boolean(item.id) &&
                    item.total > getTotalStock(inventoryItems, item)
                  }
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
                  className={twMerge(
                    "self-end mb-2",
                    items.length <= 1 && "hidden",
                  )}
                >
                  <RxCross2 />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            onPress={addItem}
            startContent={<LuPackagePlus />}
            variant="flat"
          >
            Tambah Barang / Ctrl + Enter
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
