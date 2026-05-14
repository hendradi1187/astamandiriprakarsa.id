/**
 * Service taxonomy AMP — sumber: Price_List_AMP.pdf (resmi dari founder).
 *
 * 4 service utama:
 * 1. arsitektur_baru   — Paket 1-4 (Rp 165rb - Rp 330rb/m²)
 * 2. interior_existing — Paket 5 (Rp 400rb/m²)
 * 3. rab_boq           — Paket 6 (Rp 2jt - 3jt+, tiered by size)
 * 4. imb               — Paket 7 (variable per kota, butuh quote manual)
 */

import type { ServiceType } from "./supabase";

export interface ServiceConfig {
  id: ServiceType;
  name: string;
  shortDesc: string;
  longDesc: string;
  durationLabel: string;
  startsFromLabel: string;
  cta: string;
  highlight?: boolean; // untuk badge "Paling Populer" di service picker
}

export const services: ServiceConfig[] = [
  {
    id: "arsitektur_baru",
    name: "Desain Rumah Baru",
    shortDesc: "Bangun rumah impian dari nol",
    longDesc:
      "Untuk Anda yang punya lahan dan ingin membangun rumah baru. Tim arsitek AMP akan mendesain dari konsep awal hingga gambar kerja lengkap (DED).",
    durationLabel: "2 minggu – 2 bulan",
    startsFromLabel: "Mulai Rp 165rb / m²",
    cta: "Mulai Desain Rumah",
    highlight: true,
  },
  {
    id: "interior_existing",
    name: "Desain Interior Existing",
    shortDesc: "Renovasi interior rumah Anda saat ini",
    longDesc:
      "Rumah Anda sudah jadi tapi ingin penataan interior yang lebih nyaman dan estetik. Cocok untuk rumah lama, apartemen, atau ruangan tertentu yang ingin di-makeover.",
    durationLabel: "± 4 minggu",
    startsFromLabel: "Rp 400rb / m²",
    cta: "Mulai Desain Interior",
  },
  {
    id: "rab_boq",
    name: "Hitung RAB / BOQ",
    shortDesc: "Rencana Anggaran Biaya untuk gambar yang sudah ada",
    longDesc:
      "Anda sudah punya gambar desain dan butuh perhitungan anggaran biaya detail (RAB) lengkap dengan analisa harga upah-bahan. Tim quantity surveyor AMP akan menyiapkan estimasi yang akurat.",
    durationLabel: "± 2 minggu",
    startsFromLabel: "Mulai Rp 2 juta",
    cta: "Pesan Layanan RAB",
  },
  {
    id: "imb",
    name: "Pengurusan IMB",
    shortDesc: "Urus perizinan IMB / PBG bangunan Anda",
    longDesc:
      "Kami bantu pengurusan IMB (Izin Mendirikan Bangunan) atau PBG di daerah Anda. Harga disesuaikan dengan regulasi dinas terkait dan kompleksitas proyek.",
    durationLabel: "Tergantung daerah",
    startsFromLabel: "Quote per kota",
    cta: "Konsultasi IMB",
  },
];

export const getService = (id: ServiceType): ServiceConfig | undefined =>
  services.find((s) => s.id === id);

/* ---------- Brief data schemas (untuk dokumentasi & type-safety di code) ---------- */

export interface ArsitekturBriefData {
  landSize: number;        // m² tanah
  floors: number;          // jumlah lantai
  bedrooms: number;        // jumlah kamar tidur
  style: "modern" | "tropical" | "minimalist" | "classic";
  budgetTier: "standard" | "premium" | "luxury"; // tier bangun
  designPackage: "p1" | "p2" | "p3" | "p4";       // paket desain
  builtArea?: number;      // derived = landSize × floors
}

export interface InteriorBriefData {
  buildingSize: number;    // m² bangunan existing
  scope: "full" | "partial";
  rooms: string[];         // ["ruang_tamu", "dapur", "kamar_utama", ...]
  style: "modern" | "tropical" | "minimalist" | "classic" | "industrial" | "scandinavian";
  hasFurniture: boolean;   // include pengadaan furniture atau hanya gambar
}

export interface RabBriefData {
  buildingSize: number;    // m² bangunan
  hasDesign: boolean;      // sudah punya gambar atau belum
  designSource?: "amp" | "external"; // jika ada, dari mana
}

export interface ImbBriefData {
  city: string;            // kota / kabupaten
  buildingType: "rumah_tinggal" | "komersial" | "ruko" | "lainnya";
  landSize: number;        // m² tanah
  buildingSize: number;    // m² bangunan
  hasExistingPermit: boolean;
}

export type BriefData =
  | ({ service_type: "arsitektur_baru" } & ArsitekturBriefData)
  | ({ service_type: "interior_existing" } & InteriorBriefData)
  | ({ service_type: "rab_boq" } & RabBriefData)
  | ({ service_type: "imb" } & ImbBriefData);

/* ---------- Pricing helpers ---------- */

export const tierMultiplier = {
  standard: 4_500_000,
  premium: 6_500_000,
  luxury: 9_500_000,
} as const;

export const designPackagePrices = {
  p1: 165_000,
  p2: 250_000,
  p3: 300_000,
  p4: 300_000,
  p4_3plus_floors: 330_000,
} as const;

export const designPackageDurations = {
  p1: 2,
  p2: 4,
  p3: 6,
  p4: 8,
  p4_3plus_floors: 10,
} as const;

export const INTERIOR_PRICE_PER_M2 = 400_000;

export const getRabPrice = (buildingSize: number): number => {
  if (buildingSize <= 250) return 2_000_000;
  if (buildingSize <= 400) return 2_650_000;
  if (buildingSize <= 600) return 3_000_000;
  return 0; // > 600m²: custom quote
};
