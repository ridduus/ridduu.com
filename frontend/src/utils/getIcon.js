import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

// normalize function (handles reactjs, nodejs, etc.)
const normalize = (name = "") => {
  return name
    .toLowerCase()
    .replace("js", "")
    .replace(".js", "")
    .replace(" ", "")
    .trim();
};

export const getIcon = (iconName) => {
  if (!iconName) return FaIcons.FaReact;

  const clean = normalize(iconName);

  const formatted =
    clean.charAt(0).toUpperCase() + clean.slice(1);

  // Try both libraries
  const faIcon = FaIcons[`Fa${formatted}`];
  const siIcon = SiIcons[`Si${formatted}`];

  return faIcon || siIcon || FaIcons.FaReact; // fallback
};