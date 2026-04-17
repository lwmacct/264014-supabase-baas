import {
  Avatar,
  Button,
  Drawer,
  Grid,
  Menu,
  Popover,
} from "antd";
import {
  CloudOutlined,
  DeleteOutlined,
  DownOutlined,
  MenuOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import {
  appMenuItems,
  resolveCurrentNavItem,
} from "../app/routes";
import { useMyProfileQuery } from "../services/profile/queries";
import { useSession } from "../session/SessionProvider";
import { ThemeToggle } from "./ThemeToggle";

function resolveHealthTone(configured: boolean, authenticated: boolean) {
  if (!configured) {
    return "error";
  }
  if (!authenticated) {
    return "warning";
  }
  return "success";
}

export function AppLayout({ children }: { children: ReactNode }) {
  const session = useSession();
  const profileQuery = useMyProfileQuery(session.user?.id ?? null);
  const navigate = useNavigate();
  const location = useLocation();
  const buildVersion = import.meta.env.DEV
    ? "开发构建"
    : import.meta.env.VITE_APP_VERSION || "未知版本";
  const screens = Grid.useBreakpoint();
  const mobile = !screens.lg;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentItem = resolveCurrentNavItem(location.pathname);
  const authenticated = Boolean(session.user);
  const healthTone = resolveHealthTone(session.configured, authenticated);
  const healthLabel = !session.configured
    ? "缺少配置"
    : authenticated
      ? "已登录"
      : "需要登录";
  const authStatusLabel = session.userEmail || "未登录";
  const accountName =
    profileQuery.data?.display_name?.trim() || session.userEmail || "当前账户";
  const authTone = authenticated
    ? "success"
    : session.configured
      ? "warning"
      : "neutral";
  const accountPanel = (
    <div className="cf-auth-panel-menu">
      <button
        type="button"
        className="cf-auth-panel-summary"
        onClick={() => {
          navigate("/account");
          setDrawerOpen(false);
        }}
      >
        <span className="cf-auth-menu-meta">
          <strong>{accountName}</strong>
          <span>{authStatusLabel}</span>
        </span>
        <RightOutlined className="cf-auth-panel-arrow" />
      </button>

      <div className="cf-auth-panel-actions">
        <Button
          type="text"
          danger
          disabled={!session.user}
          className="cf-auth-panel-action is-danger"
          icon={<DeleteOutlined />}
          onClick={() => void session.signOut()}
        >
          退出登录
        </Button>
      </div>
    </div>
  );

  const sidebar = (
    <div className="cf-sidebar-shell">
      <button
        type="button"
        className="cf-brand"
        onClick={() => {
          navigate("/overview");
          setDrawerOpen(false);
        }}
      >
        <span className="cf-brand-mark">
          <CloudOutlined />
        </span>
        <span className="cf-brand-copy">
          <strong>项目控制台</strong>
          <span>用户与工作区</span>
        </span>
      </button>

      <div className="cf-sidebar-nav">
        <Menu
          mode="inline"
          selectedKeys={[currentItem.key]}
          items={appMenuItems}
          onClick={({ key }) => {
            navigate(key);
            setDrawerOpen(false);
          }}
        />
      </div>

      <div className="cf-sidebar-footer">
        <ThemeToggle />

        <Popover
          trigger="click"
          placement={mobile ? "topLeft" : "top"}
          overlayClassName="cf-auth-popover"
          getPopupContainer={(node) =>
            node?.closest(".app-theme-root") ?? document.body
          }
          content={accountPanel}
        >
          <Button
            className="cf-account-card"
            aria-label={`认证状态：${authStatusLabel}`}
          >
            <span className="cf-account-card-main">
              <Avatar
                size={36}
                className={`cf-auth-avatar is-${authTone}`}
                icon={!session.userEmail ? <UserOutlined /> : undefined}
              >
                {session.userEmail.slice(0, 1).toUpperCase()}
              </Avatar>
              <span className="cf-account-card-copy">
                <strong>{accountName}</strong>
                <span>{authStatusLabel}</span>
              </span>
            </span>
            <DownOutlined className="cf-auth-trigger-arrow" />
          </Button>
        </Popover>

        <div className="cf-system-card">
          <div className="cf-system-row">
            <span>服务状态</span>
            <span className={`cf-health-pill is-${healthTone}`}>{healthLabel}</span>
          </div>
          <div className="cf-system-row">
            <span>构建版本</span>
            <strong className="cf-build-version">{buildVersion}</strong>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-layout cf-shell">
      {mobile ? (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          closable={false}
          getContainer={false}
          styles={{ body: { padding: 0 } }}
          rootClassName="cf-sidebar-drawer"
        >
          {sidebar}
        </Drawer>
      ) : (
        <aside className="cf-sidebar">{sidebar}</aside>
      )}

      <div className="cf-main">
        {mobile ? (
          <header className="cf-mobilebar">
            <Button
              type="text"
              className="cf-mobilebar-menu"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
            />
            <div className="cf-mobilebar-title">{currentItem.label}</div>
            <Popover
              trigger="click"
              placement="bottomRight"
              overlayClassName="cf-auth-popover"
              getPopupContainer={(node) =>
                node?.closest(".app-theme-root") ?? document.body
              }
              content={accountPanel}
            >
              <Button
                className="cf-mobilebar-account"
                aria-label={`认证状态：${authStatusLabel}`}
              >
                <Avatar
                  size={28}
                  className={`cf-auth-avatar is-${authTone}`}
                  icon={!session.userEmail ? <UserOutlined /> : undefined}
                >
                  {session.userEmail.slice(0, 1).toUpperCase()}
                </Avatar>
              </Button>
            </Popover>
          </header>
        ) : null}

        <main className="cf-content">{children}</main>
      </div>
    </div>
  );
}
