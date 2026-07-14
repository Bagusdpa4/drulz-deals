import { formatRupiah } from "./useCatalog";

const DRINK_INDICATOR_KEYS = [
  "sizes",
  "noHot",
  "noIce",
  "noSugar",
  "allowedEspresso",
  "allowedDairy",
  "allowedSweet",
  "sweetness",
];

const isDrinkItem = (item) =>
  DRINK_INDICATOR_KEYS.some((key) => item?.[key] !== undefined);

const getItemCategory = (item) => {
  if (item.isBundling) return "Bundling";
  return isDrinkItem(item) ? "Minuman" : "Makanan";
};

const buildVariantParts = (item) => {
  const parts = [];

  if (item.isBundling) {
    if (item.selectedFixedOption?.label)
      parts.push(item.selectedFixedOption.label);
    if (item.chosenProducts?.length) {
      parts.push(item.chosenProducts.map((p) => p.name).join(", "));
    }
  } else {
    if (item.selectedSize) parts.push(item.selectedSize);
    if (item.temperature === "hot") {
      parts.push("Hot");
    } else if (item.temperature === "ice" && !item.ice) {
      parts.push("Ice");
    }
    if (item.ice) parts.push(item.ice.replace("_", " "));
    if (item.sugar) parts.push(item.sugar.replace("_", " "));
    if (item.sweetness) parts.push(item.sweetness.replace("_", " "));
    if (item.dairy) parts.push(item.dairy.replace("_", " "));
    if (item.espresso && item.espresso !== "normal_shot") {
      parts.push(item.espresso.replace("_", " "));
    }
    if (item.toppings?.length) {
      parts.push(item.toppings.map((t) => t.name).join(", "));
    }
  }

  return parts;
};

// Harga asli 1 unit sebelum diskon (buat item satuan). Bundling dianggap fix, tanpa diskon per-item.
const getOriginalUnitPrice = (item) => {
  if (item.isBundling)
    return item.unitPrice ?? (item.finalPrice ?? 0) / (item.qty || 1);
  const base = item.sizes
    ? item.sizes[item.selectedSize]
    : { price: item.price, discPrice: item.discPrice };
  const toppingsTotal = (item.toppings ?? []).reduce((s, t) => s + t.price, 0);
  return (base?.price ?? 0) + toppingsTotal;
};

const getOrderModeLabel = (cart) => {
  const hasBundling = cart.some((item) => item.isBundling);
  const hasSatuan = cart.some((item) => !item.isBundling);
  if (hasBundling && hasSatuan) return "CAMPURAN";
  return hasBundling ? "BUNDLING" : "SATUAN";
};

export const buildWhatsAppOrderMessage = ({ cart, brandLabel, formData }) => {
  const modeLabel = getOrderModeLabel(cart);
  const lines = [];

  lines.push(`*PESANAN ${brandLabel.toUpperCase()} - ${modeLabel}*`);
  lines.push("");
  lines.push(`Nama Customer : ${formData.customerName}`);
  lines.push(`Alamat Outlet : ${formData.outlet}`);
  lines.push(`Jam Pengambilan: ${formData.pickupTime}`);
  lines.push(`Catatan : ${formData.globalNotes?.trim() || "-"}`);
  if (formData.useKantong) {
    lines.push(`Kantong  : Kantong (+${formatRupiah(formData.kantongFee)})`);
  }
  lines.push("");

  let originalTotal = 0;

  cart.forEach((item) => {
    const category = getItemCategory(item);
    const variantParts = buildVariantParts(item);
    const variantText = variantParts.length
      ? ` (${variantParts.join(", ")})`
      : "";
    const qty = item.qty ?? 1;

    const originalLineTotal = getOriginalUnitPrice(item) * qty;
    const finalLineTotal = item.finalPrice ?? 0;
    originalTotal += originalLineTotal;

    const priceText =
      originalLineTotal !== finalLineTotal
        ? `~${formatRupiah(originalLineTotal)}~ ${formatRupiah(finalLineTotal)}`
        : formatRupiah(finalLineTotal);

    lines.push(
      `• [${category}]: ${item.name}${variantText} x${qty} - ${priceText}`,
    );

    if (item.notes) {
      lines.push(`  Catatan: "${item.notes}"`);
    }
  });

  const grandTotal = formData.totalPrice ?? 0;

  lines.push("");
  if (originalTotal !== grandTotal) {
    lines.push(`Harga Asli: ~${formatRupiah(originalTotal)}~`);
  }
  lines.push(`*Total: ${formatRupiah(grandTotal)}*`);

  return lines.join("\n");
};

export const sendWhatsAppOrder = (message) => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};
