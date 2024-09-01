export const formatToRupiah = (number: number) => {
  const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  })
    .format(number)
    .split(",")[0];

  return rupiah.slice(3);
};
