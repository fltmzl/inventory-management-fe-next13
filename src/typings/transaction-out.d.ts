type TransactionOut = {
  id: string;
  permintaanBarang_id: string;
  tanggal: string;
  hargaTotal: string;
  createdAt: string;
  updatedAt: string;
  pelanggan: {
    nama: string;
    telepon: string;
    alamat: string;
    email: string;
  };
  barang: [
    {
      id: string;
      nama: string;
      satuan: string;
      jumlah: number;
      hargaSatuan: string;
    }
  ];
};
