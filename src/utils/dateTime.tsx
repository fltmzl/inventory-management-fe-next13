export const ISODateToLocal = (isoDateString: string) => {
  const date = new Date(isoDateString);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const today = () => {
  return new Date();
};

export const addDays = (numberOfDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + numberOfDays);
  return date;
};

export const setTimeToEndOfDay = (dateObject: Date) => {
  const date = dateObject;

  date.setUTCHours(23);
  date.setUTCMinutes(59);
  date.setUTCSeconds(59);

  console.log("COBA", date);
  return date;
};

export const convertToDateString = (dateObject: Date) => {
  return dateObject.toISOString().split("T")[0];
};

export const convertToLocaleDateString = (dateObject: Date, monthType: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined = "numeric") => {
  return dateObject.toLocaleDateString("id-ID", {
    day: "numeric",
    month: monthType,
    year: "numeric",
  });
};
