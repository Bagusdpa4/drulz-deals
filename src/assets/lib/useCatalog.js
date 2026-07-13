import data from "../components/data/product.json";

const getShopCategories = () => data.filter((c) => c.type === "shop");

export const getBrandCatalog = (brandId) => {
  for (const category of getShopCategories()) {
    const brand = category.brands.find((b) => b.id === brandId);
    if (brand) return brand;
  }
  return null;
};

export const getAvailableModes = (brandId) => {
  const brand = getBrandCatalog(brandId);
  if (!brand) return { hasSatuan: false, hasBundling: false };
  const hasSatuan = Boolean(brand.modes?.satuan);
  const hasBundling =
    Array.isArray(brand.modes?.bundling) && brand.modes.bundling.length > 0;
  return { hasSatuan, hasBundling };
};

// UBAH: terima query opsional, dipakai untuk menyesuaikan filter menu
export const getSatuanCategories = (brandId, query) => {
  const sections = query
    ? searchFlattenedSatuanProducts(brandId, query)
    : getFlattenedSatuanProducts(brandId);
  return sections.map((s) => ({ id: s.groupKey, label: s.groupLabel }));
};

export const getSatuanProducts = (brandId) =>
  getBrandCatalog(brandId)?.modes?.satuan ?? null;
export const getBundlingProducts = (brandId) =>
  getBrandCatalog(brandId)?.modes?.bundling ?? [];

const formatSeriesLabel = (key) =>
  key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const getFlattenedSatuanProducts = (brandId) => {
  const satuan = getSatuanProducts(brandId);
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

// filter produk satuan berdasarkan nama, per brand yang aktif
export const searchFlattenedSatuanProducts = (brandId, query) => {
  const sections = getFlattenedSatuanProducts(brandId);
  const q = query?.trim().toLowerCase();
  if (!q) return sections;

  return sections
    .map((s) => ({
      ...s,
      items: s.items.filter((item) => item.name.toLowerCase().includes(q)),
    }))
    .filter((s) => s.items.length > 0);
};

// filter bundling berdasarkan nama
export const searchBundlingProducts = (brandId, query) => {
  const bundles = getBundlingProducts(brandId);
  const q = query?.trim().toLowerCase();
  if (!q) return bundles;
  return bundles.filter((b) => b.name.toLowerCase().includes(q));
};

export const formatRupiah = (value) =>
  value == null ? "" : `Rp${value.toLocaleString("id-ID")}`;
