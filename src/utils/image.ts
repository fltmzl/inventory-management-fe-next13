export async function convertImageToBase64(imagePath: string): Promise<string> {
  // Fetch gambar dari folder public/assets
  const response = await fetch(imagePath);
  const blob = await response.blob();

  // Konversi blob ke base64 menggunakan FileReader
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
