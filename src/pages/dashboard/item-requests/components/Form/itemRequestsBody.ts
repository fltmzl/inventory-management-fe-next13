export type Item = {
  id: string;
  total: number;
};

export type ItemRequestsInitialForm = {
  id: string;
  customer_id: string;
  user_id: string;
  date: string;
};

export type ItemRequestsBody = {
  id: string;
  customer_id: string;
  user_id: string;
  date: string;
  items?: Item[];
};
