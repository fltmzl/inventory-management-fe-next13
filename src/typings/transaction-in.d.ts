type TransactionIn = {
  id: string;
  nomorLot_id: string;
  tanggal: string;
  hargaTotal: string;
  createdAt: string;
  updatedAt: string;
  barang: [
    {
      id: string;
      nama: string;
      satuan: string;
      jumlah: number;
      hargaSatuan: string;
    }
  ];
  nomorLot?: {
    id: string;
    kode: string;
  };
};
