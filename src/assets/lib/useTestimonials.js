// Otomatis ambil semua gambar di src/assets/testimonial/.
// Tinggal drop file baru ke folder ini, gak perlu edit kode apapun.
const modules = import.meta.glob(
  "/src/assets/img/testimonial/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" },
);

export const getTestimonials = () =>
  Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url], index) => ({
      id: `testi-${index}`,
      image: url,
    }));
