export const formatDate = (
  date
) => {
  return new Date(
    date
  ).toLocaleDateString(
    "en-KE",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};