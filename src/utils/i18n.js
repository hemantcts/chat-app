import en from "../i18n/en";
import de from "../i18n/de";
import it from "../i18n/it";
import fr from "../i18n/fr";
import es from "../i18n/es";
import pt from "../i18n/pt";
import dk from "../i18n/dk";
import sv from "../i18n/sv";

const languages = {
  en,
  de,
  it,
  fr,
  es,
  pt,
  dk,
  sv
};

export function t(key) {
  const lang = window.ChatWidget?.config?.lang || "en";
  console.log('i18n', lang);
  return languages[lang]?.[key] || languages["en"][key] || key;
}