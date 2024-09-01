type User = {
  id: string;
  namaLengkap: string;
  username: string;
  email: string;
  foto: string;
  telepon: string;
  alamat: string;
  role: "ADMIN" | "OWNER";
  createdAt: string;
  updatedAt: string;
  exp: number;
  iat: number;
};
