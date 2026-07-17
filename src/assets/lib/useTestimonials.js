import { supabase } from "./supabaseClient";

export const getTestimonials = async () => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const uploadTestimonial = async (file) => {
  const ext = file.name.split(".").pop();
  const storagePath = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("testimonials")
    .upload(storagePath, file);
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("testimonials")
    .getPublicUrl(storagePath);

  const { error: insertError } = await supabase.from("testimonials").insert({
    image_url: publicUrlData.publicUrl,
    storage_path: storagePath,
  });
  if (insertError) throw insertError;
};

export const deleteTestimonial = async (id, storagePath) => {
  await supabase.storage.from("testimonials").remove([storagePath]);
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
};