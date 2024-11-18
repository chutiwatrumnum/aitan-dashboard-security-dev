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
  primaryColor: string;
  secondaryColor: string;
  loginColor: string;
  logoutColor: string;
  whiteColor: string;
  whiteTransColor: string;
  blackColor: string;
  grayColor: string;
  cardBGColor: string;
  grayTransColor: string;

  // Semantic Colors
  dangerColor: string;
  warningColor: string;
  successColor: string;

  // Text colors
  mainTextColor: string;
  whiteTextColor: string;
  menuTextColor: string;
  menuTextActiveColor: string;
  subMenuTextColor: string;
  subMenuTextActiveColor: string;
  warningTextColor: string;
  successTextColor: string;
  dangerTextColor: string;
  grayTextColor: string;

  // BG colors
  mainBgColor: string;
  menuBgColor: string;
  menuBgActiveColor: string;
  subMenuBgColor: string;
  subMenuBgActiveColor: string;

  // Button colors
  mainBtnColor: string;
  cancelBtnColor: string;
  mainBtnTextColor: string;
  cancelBtnTextColor: string;

  // Table Colors
  tableHeadBgColor: string;
  tableHeadTextColor: string;
  subTableHeadBgColor: string;

  // Font weights
  normalWeight: number;
  semiBoldWeight: number;
  boldWeight: number;
}

export const theme: object = {
  token: {
    fontFamily: "Prompt",
    colorPrimary: "#3C8BF1",
    colorText: "#3F3F3F",
    colorInfo: "#3F3F3F",
    colorLink: "#3F3F3F",
  },
};

export const whiteLabel: WhiteLabelType = {
  fontSizeSm: "0.75rem",
  fontSize1xl: "1.25rem",
  fontSize2xl: "1.5rem",
  fontSize3xl: "1.75rem",
  fontSize4xl: "2rem",
  fontSize5xl: "2.25rem",
  fontSize6xl: "2.5rem",
  fontSize7xl: "2.75rem",
  fontSize8xl: "3rem",

  buttonShape: "round",
  primaryColor: "#3C8BF1",
  secondaryColor: "#75a8ea",
  loginColor: "#413A39",
  logoutColor: "#221F20",
  whiteColor: "#FFFFFF",
  whiteTransColor: "rgba(255, 255, 255, 0.8)",
  blackColor: "#403D38",
  grayColor: "#595959",
  cardBGColor: "#6297de",
  grayTransColor: "#B0B0B0",

  // Semantic Colors
  dangerColor: "#DC2A31",
  warningColor: "#F28F1E",
  successColor: "#01A171",

  // Text colors
  mainTextColor: "#3F3F3F",
  whiteTextColor: "#FFFFFF",
  dangerTextColor: "#DC2A31",
  warningTextColor: "#F28F1E",
  successTextColor: "#63A164",
  menuTextColor: "#FFFFFF",
  menuTextActiveColor: "#3C8BF1",
  subMenuTextColor: "#7B7B7B",
  subMenuTextActiveColor: "#3C8BF1",
  grayTextColor: "#595959",

  // BG colors
  mainBgColor: "#3C8BF1",
  menuBgColor: "#75a8ea",
  menuBgActiveColor: "#5F2424",
  subMenuBgColor: "#FFFFFF",
  subMenuBgActiveColor: "#E4CFCF",

  // Button colors
  mainBtnColor: "#3C8BF1",
  cancelBtnColor: "#9F9C9B",
  mainBtnTextColor: "#FFFFFF",
  cancelBtnTextColor: "#3F3F3F",

  // Table colors
  tableHeadBgColor: "#75a8ea",
  tableHeadTextColor: "#FFFFFF",
  subTableHeadBgColor: "#9F9C9B",

  // Font weights
  normalWeight: 400,
  semiBoldWeight: 600,
  boldWeight: 700,
};
