// Password WiFi khusus outlet Kopken, berganti tiap tanggal (1-31), berulang tiap bulan.
// SSID & username sama untuk semua tanggal.
export const KOPKEN_WIFI_SSID = "Teman Kenangan";
export const KOPKEN_WIFI_USERNAME = "kopikenangan";

export const KOPKEN_WIFI_PASSWORDS = {
  1: "TemanKenangan#01",
  2: "SelaluSeru@02",
  3: "WorkFromKenangan+03",
  4: "SahabatSetia=4",
  5: "PaduanPas!05",
  6: "AndalanMantan#06",
  7: "NyantaiNgopi@07",
  8: "KenanganNyaman+08",
  9: "SepenuhHati=09",
  10: "AsliAsik!10",
  11: "KopiKenanganMantan#11",
  12: "CafeMaltLatte@12",
  13: "SparksAmericano+13",
  14: "KenanganFrappe=14",
  15: "SusuGrassJelly!15",
  16: "AdamAyam#16",
  17: "FriendChip@17",
  18: "CoklatKlasik+18",
  19: "SaudiSpicy=19",
  20: "ChiMateNikmat!20",
  21: "ColorpopBubble#21",
  22: "TwinsTumbler@22",
  23: "CuteCapybara+23",
  24: "BaliKintamani=24",
  25: "JuwaraBeans!25",
  26: "SelfRewardDulu#26",
  27: "WorkLifeNgopi@27",
  28: "SetegukEspresso+28",
  29: "JajanKenangan=29",
  30: "SehidupSehati!30",
  31: "KopiFavoritmu#31",
};

// Ambil password sesuai tanggal hari ini (1-31). Kalau bulan cuma 28/29/30 hari,
// tanggal 31 dst otomatis gak akan pernah kepanggil karena Date bawaan JS gak akan
// pernah return tanggal yang gak ada di bulan itu.
export const getTodayWifiPassword = () => {
  const dayOfMonth = new Date().getDate();
  return KOPKEN_WIFI_PASSWORDS[dayOfMonth] ?? null;
};

// Format tanggal hari ini ke Bahasa Indonesia, mis. "7 Juni 2026"
export const getTodayFormatted = () =>
  new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Wifi Fore
export const FORE_WIFI_PASSWORD = "Foreveryone";
