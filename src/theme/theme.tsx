import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { App as AntdApp, ConfigProvider, theme, type ThemeConfig } from "antd";
import type { Locale } from "antd/es/locale";

export type ThemeMode = "light" | "dark";

interface ThemeModeContextValue {
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const THEME_STORAGE_KEY = "supabase-starter.theme-mode";
const ACCENT_COLOR = "#f48120";

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredThemeMode(): ThemeMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedMode === "light" || storedMode === "dark") {
    return storedMode;
  }

  return null;
}

function resolveInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function parseHexColor(input: string) {
  const normalized = input.trim();
  const shortMatch = normalized.match(/^#([\da-f]{3})$/i);
  if (shortMatch) {
    const [r, g, b] = shortMatch[1].split("").map((segment) => {
      return Number.parseInt(segment.repeat(2), 16);
    });
    return { r, g, b };
  }

  const longMatch = normalized.match(/^#([\da-f]{6})$/i);
  if (longMatch) {
    return {
      r: Number.parseInt(longMatch[1].slice(0, 2), 16),
      g: Number.parseInt(longMatch[1].slice(2, 4), 16),
      b: Number.parseInt(longMatch[1].slice(4, 6), 16),
    };
  }

  return null;
}

function withAlpha(color: string, alpha: number) {
  const parsed = parseHexColor(color);
  if (!parsed) {
    return color;
  }

  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`;
}

function buildThemeConfig(mode: ThemeMode): ThemeConfig {
  const isDark = mode === "dark";
  const primaryStrong = isDark ? "#ffb15e" : "#8b3f1f";

  return {
    hashed: false,
    cssVar: {
      prefix: "cc",
      key: "supabase-starter",
    },
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: ACCENT_COLOR,
      borderRadius: 16,
      borderRadiusLG: 20,
      borderRadiusSM: 12,
      colorInfo: "#1677ff",
      fontFamily:
        '"IBM Plex Sans", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      fontFamilyCode:
        '"IBM Plex Mono", "SFMono-Regular", "Consolas", "Liberation Mono", monospace',
      wireframe: false,
    },
    components: {
      Layout: {
        bodyBg: "transparent",
        headerBg: "transparent",
        siderBg: "transparent",
        footerBg: "transparent",
      },
      Menu: {
        itemBg: "transparent",
        subMenuItemBg: "transparent",
        itemBorderRadius: 12,
        itemSelectedBg: isDark
          ? withAlpha(ACCENT_COLOR, 0.18)
          : withAlpha(ACCENT_COLOR, 0.08),
        itemSelectedColor: isDark ? "#fff3e8" : "#1f232b",
        itemHoverColor: ACCENT_COLOR,
        iconSize: 16,
        groupTitleColor: isDark ? "#8f96a3" : "#8d94a3",
      },
      Card: {
        headerBg: "transparent",
      },
      Button: {
        primaryShadow: "none",
      },
      Table: {
        headerBg: isDark ? "#161b23" : "#f8f9fb",
      },
      Input: {
        activeShadow: `0 0 0 2px ${withAlpha(ACCENT_COLOR, 0.16)}`,
      },
      InputNumber: {
        activeShadow: `0 0 0 2px ${withAlpha(ACCENT_COLOR, 0.16)}`,
      },
      Select: {
        optionSelectedBg: isDark
          ? withAlpha(ACCENT_COLOR, 0.16)
          : withAlpha(ACCENT_COLOR, 0.08),
      },
      Segmented: {
        itemSelectedBg: isDark
          ? withAlpha(ACCENT_COLOR, 0.16)
          : withAlpha(ACCENT_COLOR, 0.1),
      },
      Switch: {
        colorPrimary: ACCENT_COLOR,
        colorPrimaryHover: primaryStrong,
      },
      Drawer: {
        colorBgElevated: isDark ? "#11161d" : "#ffffff",
      },
    },
  };
}

function buildThemeVariables(
  token: ReturnType<typeof theme.getDesignToken>,
  mode: ThemeMode,
): CSSProperties {
  const isDark = mode === "dark";
  const primary = token.colorPrimary;
  const info = token.colorInfo;
  const panelSoft = isDark
    ? withAlpha(token.colorBgElevated, 0.9)
    : withAlpha(token.colorBgContainer, 0.96);
  const overlay = isDark
    ? withAlpha(token.colorBgElevated, 0.82)
    : withAlpha(token.colorBgElevated, 0.88);

  return {
    colorScheme: mode,
    "--app-body-bg": isDark
      ? `radial-gradient(circle at top left, ${withAlpha(primary, 0.16)}, transparent 18%), linear-gradient(180deg, #0c1016 0%, ${token.colorBgLayout} 100%)`
      : `radial-gradient(circle at top left, ${withAlpha(primary, 0.08)}, transparent 18%), linear-gradient(180deg, #fbfbfc 0%, ${token.colorBgLayout} 100%)`,
    "--shell-bg": token.colorBgLayout,
    "--shell-panel": token.colorBgContainer,
    "--shell-panel-muted": token.colorBgElevated,
    "--shell-panel-soft": panelSoft,
    "--shell-panel-overlay": overlay,
    "--shell-panel-card-start": token.colorBgContainer,
    "--shell-panel-card-end": isDark ? "#151a21" : "#fcfcfd",
    "--shell-line": token.colorBorderSecondary,
    "--shell-line-strong": token.colorBorder,
    "--shell-ink": token.colorText,
    "--shell-ink-soft": token.colorTextSecondary,
    "--shell-ink-dim": token.colorTextTertiary,
    "--shell-orange": primary,
    "--shell-orange-strong": isDark ? "#ffb15e" : "#a95217",
    "--shell-orange-soft": withAlpha(primary, isDark ? 0.18 : 0.12),
    "--shell-orange-contrast": "#fff",
    "--shell-shadow": isDark
      ? "0 18px 40px rgba(0, 0, 0, 0.28)"
      : "0 18px 40px rgba(15, 23, 42, 0.08)",
    "--shell-glow": withAlpha(primary, isDark ? 0.24 : 0.18),
    "--shell-glow-soft": withAlpha(primary, isDark ? 0.18 : 0.08),
    "--shell-menu-text": token.colorTextSecondary,
    "--shell-menu-icon": token.colorTextTertiary,
    "--shell-table-head-bg": isDark
      ? withAlpha(token.colorFillSecondary, 0.45)
      : token.colorFillAlter,
    "--shell-code-bg": isDark ? "#0d1117" : "#171a20",
    "--shell-code-ink": isDark ? "#d9e2f2" : "#eef2f7",
    "--shell-neutral-chip-bg": isDark
      ? withAlpha(token.colorFillSecondary, 0.48)
      : token.colorFillAlter,
    "--shell-neutral-chip-text": token.colorTextSecondary,
    "--shell-success-soft": withAlpha(token.colorSuccess, 0.14),
    "--shell-success-ink": token.colorSuccess,
    "--shell-warning-soft": withAlpha(token.colorWarning, 0.16),
    "--shell-warning-ink": token.colorWarning,
    "--shell-error-soft": withAlpha(token.colorError, 0.14),
    "--shell-error-ink": token.colorError,
    "--shell-status-bg": isDark
      ? `radial-gradient(circle at top left, ${withAlpha(primary, 0.16)}, transparent 22%), linear-gradient(180deg, #0c1016 0%, ${token.colorBgLayout} 100%)`
      : `radial-gradient(circle at top left, ${withAlpha(primary, 0.14)}, transparent 22%), linear-gradient(180deg, #fbfbfc 0%, ${token.colorBgLayout} 100%)`,
    "--shell-status-badge-bg": withAlpha(
      token.colorBgContainer,
      isDark ? 0.7 : 0.8,
    ),
    "--shell-auth-ink": token.colorText,
    "--shell-auth-soft-ink": token.colorTextSecondary,
    "--shell-auth-line": token.colorBorderSecondary,
    "--shell-auth-panel": withAlpha(
      token.colorBgContainer,
      isDark ? 0.7 : 0.78,
    ),
    "--shell-auth-panel-strong": withAlpha(
      token.colorBgElevated,
      isDark ? 0.88 : 0.92,
    ),
    "--shell-auth-accent": primary,
    "--shell-auth-accent-deep": isDark ? "#ffb15e" : "#8b3f1f",
    "--shell-auth-glow": withAlpha(primary, isDark ? 0.28 : 0.18),
    "--shell-auth-bg": isDark
      ? `radial-gradient(circle at top left, ${withAlpha(primary, 0.2)}, transparent 30%), radial-gradient(circle at right 20%, ${withAlpha(info, 0.18)}, transparent 24%), linear-gradient(135deg, #11161d 0%, #0e1620 52%, #0b1118 100%)`
      : `radial-gradient(circle at top left, ${withAlpha(primary, 0.18)}, transparent 30%), radial-gradient(circle at right 20%, ${withAlpha(info, 0.2)}, transparent 24%), linear-gradient(135deg, #f5efe6 0%, #eef3f8 52%, #f5f8fc 100%)`,
  } as CSSProperties;
}

export function ThemeProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale?: Locale;
}) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return readStoredThemeMode() ?? resolveInitialThemeMode();
  });

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const themeConfig = useMemo(() => buildThemeConfig(mode), [mode]);
  const designToken = useMemo(
    () => theme.getDesignToken(themeConfig),
    [themeConfig],
  );
  const themeStyle = useMemo(
    () => buildThemeVariables(designToken, mode),
    [designToken, mode],
  );
  const value = useMemo<ThemeModeContextValue>(() => {
    return {
      isDark: mode === "dark",
      mode,
      setMode,
      toggleMode: () =>
        setMode((current) => (current === "dark" ? "light" : "dark")),
    };
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider locale={locale} theme={themeConfig}>
        <AntdApp>
          <div className="app-theme-root" style={themeStyle}>
            {children}
          </div>
        </AntdApp>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }

  return context;
}
