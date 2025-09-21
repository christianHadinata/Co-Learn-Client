export const formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "long", // 'long' -> pake buat bulan ky September, klo 'short' jdnya Sept
    day: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
};
