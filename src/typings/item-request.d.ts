type ItemRequest = {
  id: string;
  pelanggan_id: string;
  tanggal: string;
  permintaanTerpenuhi: boolean;
  pegawai_id: string;
  createdAt: string;
  updatedAt: string;
  barang: [
    {
      id: string;
      nama: string;
      satuan: string;
      jumlah: number;
    }
  ];
  pegawai: {
    namaLengkap: string;
    telepon: string;
    email: string;
    role: string;
  };
  pelanggan: {
    nama: string;
    telepon: string;
    alamat: string;
    email: string;
  };
};
