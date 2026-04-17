import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Space, Switch, Tooltip, Typography } from "antd";
import { useThemeMode } from "../theme/theme";

export function ThemeToggle({ showLabel = true }: { showLabel?: boolean }) {
  const { isDark, setMode } = useThemeMode();

  return (
    <Space size={8} className="theme-toggle-shell">
      {showLabel ? (
        <Typography.Text type="secondary" className="theme-toggle-label">
          {isDark ? "夜间主题" : "日间主题"}
        </Typography.Text>
      ) : null}
      <Tooltip title={isDark ? "切换到浅色主题" : "切换到深色主题"}>
        <Switch
          size="small"
          checked={isDark}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          onChange={(checked) => setMode(checked ? "dark" : "light")}
        />
      </Tooltip>
    </Space>
  );
}
