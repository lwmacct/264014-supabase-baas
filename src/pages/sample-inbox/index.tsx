import { InboxOutlined } from "@ant-design/icons";
import { Card, Space, Tag, Typography } from "antd";

export function SampleInboxPage() {
  return (
    <Space orientation="vertical" size={16} className="full-width">
      <Card className="overview-hero placeholder-hero">
        <div className="overview-hero-copy">
          <Space wrap size={[8, 8]} className="placeholder-hero-topline">
            <span className="overview-kicker">
              <InboxOutlined />
              占位模块
            </span>
            <Tag color="processing">待接业务</Tag>
          </Space>
          <Typography.Title level={4}>收件箱模块待接入。</Typography.Title>
          <Typography.Paragraph>
            后续可以在这里接消息列表、通知流和待办任务。
          </Typography.Paragraph>
        </div>
      </Card>
    </Space>
  );
}
