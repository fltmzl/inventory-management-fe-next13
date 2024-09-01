export type Item = {
  id: string;
  total: number;
  price: number;
};

export type TransactionOutInitialForm = {
  id: string;
  itemRequest_id: string;
  date: string;
  totalPrice: number;
};

export type TransactionOutBody = {
  id: string;
  itemRequest_id: string;
  date: string;
  items?: Item[];
  totalPrice: number;
};
