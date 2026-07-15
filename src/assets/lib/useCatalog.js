import data from "../components/data/product.json";

const getShopCategories = () => data.filter((c) => c.type === "shop");

export const getBrandCatalog = (brandId) => {
  for (const category of getShopCategories()) {
    const brand = category.brands.find((b) => b.id === brandId);
    if (brand) return brand;
  }
  return null;
};

// BARU: konfigurasi mode brand — bisa "standard" (satuan/bundling) atau "variants" (biasa/culture, dst)
export const getBrandModeConfig = (brandId) => {
  const brand = getBrandCatalog(brandId);
  if (!brand) return { type: "none" };

  if (brand.modes?.variants) {
    const variants = Object.entries(brand.modes.variants).map(([id, v]) => ({
      id,
      label: v.label || formatSeriesLabel(id),
    }));
    return { type: "variants", variants };
  }

  return {
    type: "standard",
    hasSatuan: Boolean(brand.modes?.satuan),
    hasBundling:
      Array.isArray(brand.modes?.bundling) && brand.modes.bundling.length > 0,
  };
};

// DIUBAH: sekarang terima param `variantId` opsional, dipakai kalau brand tipe "variants"
export const getSatuanProducts = (brandId, variantId) => {
  const brand = getBrandCatalog(brandId);
  if (!brand) return null;

  if (brand.modes?.variants) {
    return brand.modes.variants[variantId]?.satuan ?? null;
  }
  return brand.modes?.satuan ?? null;
};

export const getBundlingProducts = (brandId) =>
  getBrandCatalog(brandId)?.modes?.bundling ?? [];

const formatSeriesLabel = (key) =>
  key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// DIUBAH: terima `variantId` opsional
export const getFlattenedSatuanProducts = (brandId, variantId) => {
  const satuan = getSatuanProducts(brandId, variantId);
  if (!satuan) return [];
  const sections = [];
  for (const type of ["minuman", "makanan"]) {
    const groupObj = satuan[type];
    if (!groupObj) continue;
    for (const [groupKey, items] of Object.entries(groupObj)) {
      if (!Array.isArray(items) || items.length === 0) continue;
      sections.push({
        groupKey,
        groupLabel: formatSeriesLabel(groupKey),
        type,
        items: items.map((item) => ({
          ...item,
          hasSizes: Boolean(item.sizes),
        })),
      });
    }
  }
  return sections;
};

// DIUBAH: terima `variantId` opsional, diteruskan ke getFlattenedSatuanProducts
export const searchFlattenedSatuanProducts = (brandId, query, variantId) => {
  const sections = getFlattenedSatuanProducts(brandId, variantId);
  const q = query?.trim().toLowerCase();
  if (!q) return sections;

  return sections
    .map((s) => ({
      ...s,
      items: s.items.filter((item) => item.name.toLowerCase().includes(q)),
    }))
    .filter((s) => s.items.length > 0);
};

export const searchBundlingProducts = (brandId, query) => {
  const bundles = getBundlingProducts(brandId);
  const q = query?.trim().toLowerCase();
  if (!q) return bundles;
  return bundles.filter((b) => b.name.toLowerCase().includes(q));
};

export const getAvailableModes = (brandId) => {
  const brand = getBrandCatalog(brandId);
  if (!brand) return { hasSatuan: false, hasBundling: false };
  const hasSatuan = Boolean(brand.modes?.satuan);
  const hasBundling =
    Array.isArray(brand.modes?.bundling) && brand.modes.bundling.length > 0;
  return { hasSatuan, hasBundling };
};

export const getSatuanCategories = (brandId, query, variantId) => {
  const sections = query
    ? searchFlattenedSatuanProducts(brandId, query, variantId)
    : getFlattenedSatuanProducts(brandId, variantId);
  return sections.map((s) => ({ id: s.groupKey, label: s.groupLabel }));
};

export const formatRupiah = (value) =>
  value == null ? "" : `Rp${value.toLocaleString("id-ID")}`;
