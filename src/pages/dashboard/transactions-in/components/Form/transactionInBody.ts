export type Item = {
  id: string;
  total: number;
  price: number;
};

export type TransactionInInitialForm = {
  id: string;
  lotNumber: string;
  date: string;
  totalPrice: number;
};

export type TransactionInBody = {
  id: string;
  lotNumber: string;
  date: string;
  items?: Item[];
  totalPrice: number;
};
