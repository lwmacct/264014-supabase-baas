import { FolderOpenOutlined } from "@ant-design/icons";
import { Card, Space, Tag, Typography } from "antd";

export function SampleWorkspacePage() {
  return (
    <Space orientation="vertical" size={16} className="full-width">
      <Card className="overview-hero placeholder-hero">
        <div className="overview-hero-copy">
          <Space wrap size={[8, 8]} className="placeholder-hero-topline">
            <span className="overview-kicker">
              <FolderOpenOutlined />
              占位模块
            </span>
            <Tag color="processing">待接业务</Tag>
          </Space>
          <Typography.Title level={4}>工作区模块待接入。</Typography.Title>
          <Typography.Paragraph>
            后续可以在这里承接项目列表、文件流或主业务面板。
          </Typography.Paragraph>
        </div>
      </Card>
    </Space>
  );
}
