// type Inventory = {
//   id: string;
//   nama: string;
//   stok: number;
//   harga: number;
//   pembelianTerakhir: string;
// };
type Inventory = {
  id: string;
  nama: string;
  stok: number;
  harga: number;
  pembelianTerakhir: string;
  kategori: {
    id: string;
    kode: string;
    nama: string;
  };
  satuan: {
    id: string;
    kode: string;
    nama: string;
  };
  nomorLot: Array<string>;
};
