import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

const THEME_KEY = "damulink-access-theme";

const OPTIONS = [
  {
    value: "default",
    label: "Default",
    description: "Original warm DamuLink colors",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Lower glare with preserved ruby accents",
  },
  {
    value: "contrast",
    label: "High contrast",
    description: "Sharper edges and stronger color separation",
  },
];

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("display");
  const { language, setLanguage, t, languages } = useLanguage();
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "default";
    return localStorage.getItem(THEME_KEY) || "default";
  });
  const panelRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "default") {
      root.removeAttribute("data-access-theme");
      localStorage.removeItem(THEME_KEY);
    } else {
      root.setAttribute("data-access-theme", theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={panelRef} className="accessibility-menu">
      <button
        type="button"
        className="accessibility-trigger"
        aria-label={t("access.open")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <AccessibilityIcon />
      </button>

      {open && (
        <div className="accessibility-panel" role="dialog" aria-label={t("access.dialog")}>
          <div className="accessibility-tabs" role="tablist" aria-label={t("access.dialog")}>
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === "display"}
              className={activePanel === "display" ? "accessibility-tab accessibility-tab--active" : "accessibility-tab"}
              onClick={() => setActivePanel("display")}
            >
              {t("access.display")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === "language"}
              className={activePanel === "language" ? "accessibility-tab accessibility-tab--active" : "accessibility-tab"}
              onClick={() => setActivePanel("language")}
            >
              {t("access.language")}
            </button>
          </div>

          <div className="accessibility-panel__header">
            <p>{activePanel === "display" ? t("access.display") : t("access.language")}</p>
            <span>{activePanel === "display" ? t("access.colorMode") : t("access.languageMode")}</span>
          </div>

          {activePanel === "display" ? (
            <div className="accessibility-options" role="radiogroup" aria-label={t("access.colorMode")}>
              {OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`accessibility-option ${
                    theme === option.value ? "accessibility-option--active" : ""
                  }`}
                  role="radio"
                  aria-checked={theme === option.value}
                  onClick={() => setTheme(option.value)}
                >
                  <span className={`accessibility-swatch accessibility-swatch--${option.value}`} />
                  <span>
                    <strong>{t(`access.${option.value}.label`)}</strong>
                    <small>{t(`access.${option.value}.description`)}</small>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="accessibility-options" role="radiogroup" aria-label={t("access.languageMode")}>
              {languages.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`accessibility-option ${
                    language === option.value ? "accessibility-option--active" : ""
                  }`}
                  role="radio"
                  aria-checked={language === option.value}
                  onClick={() => setLanguage(option.value)}
                >
                  <span className="accessibility-language-mark">{option.value.toUpperCase()}</span>
                  <span>
                    <strong>{option.nativeLabel}</strong>
                    <small>
                      {option.value === "sw"
                        ? t("access.swahili.description")
                        : t("access.english.description")}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AccessibilityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="4.5" r="2" fill="currentColor" />
      <path
        d="M4.5 8.2c4.9 1.6 10.1 1.6 15 0M12 10v8M8.2 21l3.8-7.5L15.8 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
