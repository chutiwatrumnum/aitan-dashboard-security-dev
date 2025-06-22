// src/configs/theme.ts - Central Pattana Residence Theme
interface WhiteLabelType {
  fontSizeSm: string;
  fontSize1xl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontSize4xl: string;
  fontSize5xl: string;
  fontSize6xl: string;
  fontSize7xl: string;
  fontSize8xl: string;

  buttonShape: "default" | "round";

  // Central Pattana Brand Colors
  primaryColor: string;          // สีทองหลัก (PATTANA)
  secondaryColor: string;        // สีดำ (CENTRAL/RESIDENCE)
  accentGold: string;           // สีทองเข้ม
  lightGold: string;            // สีทองอ่อน

  // Neutral Colors
  whiteColor: string;
  whiteTransColor: string;
  blackColor: string;           // ดำของแบรนด์
  charcoalColor: string;        // เทาดำ
  grayColor: string;
  grayTransColor: string;
  platinumColor: string;        // เงินอ่อน

  // Semantic Colors (ปรับให้เข้ากับแบรนด์)
  dangerColor: string;
  warningColor: string;
  successColor: string;

  // Text Colors
  mainTextColor: string;
  whiteTextColor: string;
  goldTextColor: string;        // ข้อความสีทอง
  mutedTextColor: string;       // ข้อความอ่อน
  menuTextColor: string;
  menuTextActiveColor: string;
  subMenuTextColor: string;
  subMenuTextActiveColor: string;

  // Background Colors
  mainBgColor: string;
  luxuryBgColor: string;        // พื้นหลังหรู
  menuBgColor: string;
  menuBgActiveColor: string;
  subMenuBgColor: string;
  subMenuBgActiveColor: string;
  cardBgColor: string;

  // Button Colors
  mainBtnColor: string;
  goldBtnColor: string;         // ปุ่มทอง
  cancelBtnColor: string;
  mainBtnTextColor: string;
  cancelBtnTextColor: string;

  // Table Colors
  tableHeadBgColor: string;
  tableHeadTextColor: string;
  subTableHeadBgColor: string;

  // Font Weights
  normalWeight: number;
  semiBoldWeight: number;
  boldWeight: number;
}

export const theme: object = {
  token: {
    fontFamily: "Prompt",
    colorPrimary: "#C9A96E",      // สีทอง Central Pattana
    colorText: "#1A1A1A",        // ดำอ่อน
    colorInfo: "#C9A96E",
    colorLink: "#C9A96E",
    colorBgContainer: "#FFFFFF",
    colorBorder: "#E8E8E8",
    borderRadius: 8,

    // Component specific tokens
    colorSuccess: "#52C41A",
    colorWarning: "#FAAD14",
    colorError: "#FF4D4F",
  },
};

export const whiteLabel: WhiteLabelType = {
  // Font Sizes
  fontSizeSm: "0.75rem",
  fontSize1xl: "1.25rem",
  fontSize2xl: "1.5rem",
  fontSize3xl: "1.75rem",
  fontSize4xl: "2rem",
  fontSize5xl: "2.25rem",
  fontSize6xl: "2.5rem",
  fontSize7xl: "2.75rem",
  fontSize8xl: "3rem",

  // Central Pattana Design System
  buttonShape: "round",

  // Brand Colors - ตามโลโก้ Central Pattana
  primaryColor: "#C9A96E",        // สีทองหลัก (PATTANA)
  secondaryColor: "#1A1A1A",      // สีดำ (CENTRAL/RESIDENCE)
  accentGold: "#B8860B",          // ทองเข้ม
  lightGold: "#F4E4BC",           // ทองอ่อน

  // Neutral Palette
  whiteColor: "#FFFFFF",
  whiteTransColor: "rgba(255, 255, 255, 0.9)",
  blackColor: "#1A1A1A",          // ดำของแบรนด์
  charcoalColor: "#2C2C2C",       // เทาดำ
  grayColor: "#6B6B6B",
  grayTransColor: "#B0B0B0",
  platinumColor: "#F5F5F5",       // เงินอ่อน

  // Semantic Colors - ปรับให้สอดคล้องกับแบรนด์
  dangerColor: "#D32F2F",         // แดงเข้ม
  warningColor: "#F57C00",        // ส้มทอง
  successColor: "#388E3C",        // เขียวเข้ม

  // Typography Colors
  mainTextColor: "#1A1A1A",       // ดำหลัก
  whiteTextColor: "#FFFFFF",
  goldTextColor: "#C9A96E",       // ทองสำหรับไฮไลท์
  mutedTextColor: "#6B6B6B",      // เทาสำหรับข้อความรอง
  menuTextColor: "#FFFFFF",
  menuTextActiveColor: "#C9A96E", // ทองเมื่อ active
  subMenuTextColor: "#6B6B6B",
  subMenuTextActiveColor: "#C9A96E",

  // Background Colors
  mainBgColor: "#C9A96E",         // ทองหลัก
  luxuryBgColor: "#F8F6F0",       // ครีมหรู
  menuBgColor: "#1A1A1A",         // ดำสำหรับเมนู
  menuBgActiveColor: "#2C2C2C",   // เทาดำเมื่อ active
  subMenuBgColor: "#FFFFFF",
  subMenuBgActiveColor: "#F4E4BC", // ทองอ่อน
  cardBgColor: "#FFFFFF",

  // Button System
  mainBtnColor: "#C9A96E",        // ปุ่มหลักสีทอง
  goldBtnColor: "#B8860B",        // ปุ่มทองเข้ม
  cancelBtnColor: "#F5F5F5",      // ปุ่มยกเลิก
  mainBtnTextColor: "#FFFFFF",
  cancelBtnTextColor: "#1A1A1A",

  // Table Design
  tableHeadBgColor: "#1A1A1A",    // หัวตารางดำ
  tableHeadTextColor: "#FFFFFF",
  subTableHeadBgColor: "#F4E4BC", // หัวตารางรองทองอ่อน

  // Typography Weights
  normalWeight: 400,
  semiBoldWeight: 600,
  boldWeight: 700,
};