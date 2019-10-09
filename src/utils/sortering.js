export const sortBy = key => (a, b) => {
  if (a[key] > b[key]) return 1;
  return ((b[key] > a[key]) ? -1 : 0);
};
