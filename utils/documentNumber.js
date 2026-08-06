const random = () => Math.floor(1000 + Math.random() * 9000);

export const createDocumentNumber = (prefix) => {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  return `${prefix}-${stamp}-${random()}`;
};
