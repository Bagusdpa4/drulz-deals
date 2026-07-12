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
  const hasBundling = Array.isArray(brand.modes?.bundling) && brand.modes.bundling.length > 0;
  return { hasSatuan, hasBundling };
};

export const getSatuanProducts = (brandId) => getBrandCatalog(brandId)?.modes?.satuan ?? null;
export const getBundlingProducts = (brandId) => getBrandCatalog(brandId)?.modes?.bundling ?? [];