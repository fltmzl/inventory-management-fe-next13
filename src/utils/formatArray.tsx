import { formatToRupiah } from "./formatToRupiah";

type ItemsProps = {
  id: string;
  nama: string;
  satuan: string;
  jumlah: number;
  hargaSatuan: string;
}[];

export const formatArrayOfItemToString = (items: ItemsProps) => {
  let itemsString = "";

  items.forEach((item, index) => {
    itemsString += `${item.nama} ( ${item.jumlah} ${item.satuan} x Rp${formatToRupiah(Number(item.hargaSatuan))})`;

    if (index !== items.length - 1) {
      itemsString += "\n";
    }
  });

  return itemsString;
};
