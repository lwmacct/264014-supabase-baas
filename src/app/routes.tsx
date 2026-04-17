import {
  AppstoreOutlined,
  BarChartOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { ReactNode } from "react";
import { AccountPage } from "../pages/account";
import { OverviewPage } from "../pages/overview";
import { SampleInboxPage } from "../pages/sample-inbox";
import { SampleReportsPage } from "../pages/sample-reports";
import { SampleWorkspacePage } from "../pages/sample-workspace";

export interface AppNavItem {
  key: string;
  label: string;
  icon: ReactNode;
  element: ReactNode;
}

export interface AppNavGroup {
  key: string;
  label: string;
  items: AppNavItem[];
}

export const appNavGroups: AppNavGroup[] = [
  {
    key: "overview",
    label: "总览",
    items: [
      {
        key: "/overview",
        label: "概览",
        icon: <AppstoreOutlined />,
        element: <OverviewPage />,
      },
      {
        key: "/account",
        label: "账户中心",
        icon: <UserOutlined />,
        element: <AccountPage />,
      },
    ],
  },
  {
    key: "samples",
    label: "示例",
    items: [
      {
        key: "/sample-inbox",
        label: "收件箱",
        icon: <InboxOutlined />,
        element: <SampleInboxPage />,
      },
      {
        key: "/sample-workspace",
        label: "工作区",
        icon: <FolderOpenOutlined />,
        element: <SampleWorkspacePage />,
      },
      {
        key: "/sample-reports",
        label: "报表",
        icon: <BarChartOutlined />,
        element: <SampleReportsPage />,
      },
    ],
  },
];

export const appNavItems = appNavGroups.flatMap((group) => group.items);

export const appMenuItems: MenuProps["items"] = appNavGroups.map((group) => ({
  key: group.key,
  type: "group",
  label: group.label,
  children: group.items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  })),
}));

export function resolveCurrentNavItem(pathname: string) {
  return appNavItems.find((item) => item.key === pathname) ?? appNavItems[0];
}
