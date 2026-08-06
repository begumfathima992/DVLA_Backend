const money = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

export const normaliseLineItem = (item, defaultVat = 0) => {
  const quantity = Number(item.quantity ?? item.qty ?? 0);
  const unitPrice = Number(item.unitPrice ?? item.rate ?? 0);
  const vat = Number(item.vat ?? defaultVat ?? 0);
  const lineSubtotal = money(quantity * unitPrice);
  const lineVatAmount = money((lineSubtotal * vat) / 100);

  return {
    itemType: item.itemType ?? item.type ?? "Part",
    description: item.description ?? item.desc ?? "",
    quantity,
    unitPrice,
    vat,
    totalPrice: lineSubtotal,
    vatAmount: lineVatAmount,
  };
};

export const calculateDocumentTotals = ({
  items = [],
  vatPercentage = 0,
  discount = 0,
  labourCharge = 0,
}) => {
  const normalisedItems = items.map((item) => normaliseLineItem(item, vatPercentage));
  const subtotal = money(normalisedItems.reduce((sum, item) => sum + item.totalPrice, 0));
  const vatAmount = money(normalisedItems.reduce((sum, item) => sum + item.vatAmount, 0));
  const safeDiscount = money(discount);
  const safeLabourCharge = money(labourCharge);
  const total = money(Math.max(0, subtotal + vatAmount + safeLabourCharge - safeDiscount));

  return {
    items: normalisedItems,
    subtotal,
    vatAmount,
    discount: safeDiscount,
    labourCharge: safeLabourCharge,
    total,
  };
};
