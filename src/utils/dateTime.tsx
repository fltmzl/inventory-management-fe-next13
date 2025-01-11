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

export const convertToLocaleDateString = (
  dateObject: Date | undefined,
  monthType:
    | "numeric"
    | "2-digit"
    | "long"
    | "short"
    | "narrow"
    | undefined = "numeric",
) => {
  if (!dateObject) return "undefine object DATE";

  return dateObject.toLocaleDateString("id-ID", {
    day: "numeric",
    month: monthType,
    year: "numeric",
  });
};

// '2025-01-11T01:01:49.994Z'
export const getInputDateTimeLocal = () => {
  const now = new Date();

  // Format tahun, bulan, dan tanggal
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
  const date = String(now.getDate()).padStart(2, "0");

  // Format jam dan menit
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // Gabungkan semuanya dalam format "YYYY-MM-DDTHH:mm"
  return `${year}-${month}-${date}T${hours}:${minutes}`;

  // return new Date().toISOString().slice(0, 16);
};
