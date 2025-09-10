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

export const formatArrayOfItemToStringWithLotNumber = (
  items: {
    id: string;
    nama: string;
    satuan: string;
    jumlah: number;
    hargaSatuan: string;
    nomorLot: {
      kode: string;
      totalBarang: number;
      createdAt: string;
    }[];
  }[],
) => {
  let itemsString = "";

  items.forEach((item, index) => {
    itemsString += `${item.nama} ( ${item.jumlah} ${item.satuan} x Rp${formatToRupiah(Number(item.hargaSatuan))}) - ${item.nomorLot[0]?.kode || "LOT000000"}`;

    if (index !== items.length - 1) {
      itemsString += "\n";
    }
  });

  return itemsString;
};
