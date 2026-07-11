import brands from "../components/data/brand.json";

export const getBrands = (categoryId) => {
  if (!categoryId) return brands;
  return brands.filter((brand) => brand.categoryId === categoryId);
};

export const getBrandById = (brandId) =>
  brands.find((brand) => brand.id === brandId) ?? null;
