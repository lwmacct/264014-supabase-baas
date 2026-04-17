import { AppstoreOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Card, Col, Row, Space, Tag, Typography } from "antd";

export function OverviewPage() {
  return (
    <Space orientation="vertical" size={16} className="full-width">
      <Card className="overview-hero home-hero">
        <div className="overview-hero-copy">
          <span className="overview-kicker">
            <CheckCircleOutlined />
            控制台底座
          </span>
          <Typography.Title level={3}>
            前端脚手架已经接入完整账户体系。
          </Typography.Title>
          <Typography.Paragraph>
            当前保留了原项目的布局、主题和几个轻量页面，同时已经具备登录、
            注册和账户维护能力。这个首页现在只作为项目入口，不再承载账户页内容。
          </Typography.Paragraph>
          <Space wrap size={[8, 8]}>
            <Tag color="success">邮箱注册/登录已接好</Tag>
            <Tag color="processing">登录态已接好</Tag>
            <Tag color="default">示例页面已补齐</Tag>
          </Space>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="overview-feature-card">
            <Space size={12} align="start">
              <AppstoreOutlined style={{ fontSize: 20 }} />
              <div>
                <Typography.Title level={4}>首页入口</Typography.Title>
                <Typography.Paragraph type="secondary">
                  用来承接项目介绍、快捷入口和最近动态。
                </Typography.Paragraph>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="overview-feature-card">
            <Typography.Title level={4}>账户中心</Typography.Title>
            <Typography.Paragraph type="secondary">
              账户信息已经单独拆到账户中心，不再占用首页空间。
            </Typography.Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="overview-feature-card">
            <Typography.Title level={4}>业务模块</Typography.Title>
            <Typography.Paragraph type="secondary">
              左侧新增了几个空的示例页面，后续可以直接替换成真实模块。
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
