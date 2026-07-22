export const isPromoActive = (promo) => {
  if (!promo) return false;
  const now = new Date();
  return now >= new Date(promo.startDate) && now <= new Date(promo.endDate);
};

// sizeKey: "R"/"L"/dst, atau undefined untuk produk tanpa size
export const getEffectivePrice = (product, sizeKey) => {
  const base = product.sizes
    ? product.sizes[sizeKey]
    : { price: product.price, discPrice: product.discPrice };

  const promoPrice = sizeKey
    ? product.promo?.prices?.[sizeKey]
    : product.promo?.prices?.default;

  if (isPromoActive(product.promo) && promoPrice != null) {
    return { ...base, discPrice: promoPrice, isPromo: true };
  }
  return { ...base, isPromo: false };
};

export const formatPromoRange = (promo) => {
  const opts = { day: "numeric", month: "long" };
  const start = new Date(promo.startDate).toLocaleDateString("id-ID", opts);
  const end = new Date(promo.endDate).toLocaleDateString("id-ID", opts);
  return `${start} - ${end}`;
};
