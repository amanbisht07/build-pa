// export default Layout1Settings;
import Cookies from "js-cookie";

const theme = Cookies.get("theme") || "blue";

const Layout1Settings = { 
  leftSidebar: {
    show: true,
    mode: "compact", // full, close, compact, mobile,
    theme: theme, // View all valid theme colors inside MatxTheme/themeColors.js
    bgOpacity: 0.96, // 0 ~ 1
    bgImgURL: `${
      process.env.PUBLIC_URL + "/assets/images/sidebar/sidebar-bg-light.jpg"
    }`,
  },
  topbar: {
    show: true,
    fixed: true,
    theme: theme, // View all valid theme colors inside MatxTheme/themeColors.js
  },
  footer: {
    show: true,
    fixed: true,
    them: theme,
  },
  activeButton: {
    theme: theme,
  },
};

export default Layout1Settings;