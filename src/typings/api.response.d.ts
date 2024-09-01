type ApiSuccessResponse<T> = {
  data: T;
  meta?: {
    totalItems?: number;
  };
  message?: string;
};
