import {
  CheckCircleOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App as AntdApp,
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useUpdateMyProfileMutation } from "../../services/profile/mutations";
import { useMyProfileQuery } from "../../services/profile/queries";
import { useSession } from "../../session/SessionProvider";

interface AccountFormValues {
  display_name: string;
  avatar_url: string;
}

const accountDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatAccountTimestamp(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return accountDateFormatter.format(date);
}

function formatAccountId(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

export function AccountPage() {
  const session = useSession();
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<AccountFormValues>();
  const profileQuery = useMyProfileQuery(session.user?.id ?? null);
  const saveProfile = useUpdateMyProfileMutation(
    session.user?.id ?? null,
    session.user?.email ?? null,
  );
  const profile = profileQuery.data ?? null;

  useEffect(() => {
    form.setFieldsValue({
      display_name: profile?.display_name ?? "",
      avatar_url: profile?.avatar_url ?? "",
    });
  }, [form, profile]);

  async function submit(values: AccountFormValues) {
    try {
      await saveProfile.mutateAsync({
        display_name: values.display_name.trim() || null,
        avatar_url: values.avatar_url.trim() || null,
      });
      message.success("信息已保存。");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "保存失败。");
    }
  }

  const displayName = profile?.display_name?.trim() || "未设置";
  const avatarUrl = profile?.avatar_url?.trim() || "";
  const profileErrorMessage =
    profileQuery.error instanceof Error ? profileQuery.error.message : "";

  return (
    <Space orientation="vertical" size={16} className="full-width">
      <Card className="overview-hero account-hero">
        <Space orientation="vertical" size={10} className="full-width">
          <Space wrap size={[8, 8]}>
            <Tag color="processing" icon={<UserOutlined />}>
              账户中心
            </Tag>
            <Tag
              color={
                profile
                  ? "success"
                  : profileQuery.isError
                    ? "error"
                    : "warning"
              }
            >
              {profile
                ? "已加载账户信息"
                : profileQuery.isError
                  ? "加载失败"
                  : "等待加载"}
            </Tag>
          </Space>

          <Typography.Title level={4}>在这里维护当前账户资料。</Typography.Title>
          <Typography.Paragraph>
            显示名和头像会直接复用于成员列表、评论作者和审计日志等展示位置。
          </Typography.Paragraph>
        </Space>
      </Card>

      {profileErrorMessage ? (
        <Alert
          type="warning"
          showIcon
          message="账户信息读取失败"
          description={profileErrorMessage}
        />
      ) : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card
            className="account-summary-card"
            title="账户信息"
            extra={
              <Button
                className="account-refresh-button"
                icon={<ReloadOutlined />}
                loading={profileQuery.isFetching}
                onClick={() => void profileQuery.refetch()}
              >
                刷新
              </Button>
            }
          >
            <Space orientation="vertical" size={20} className="full-width">
              <Space size={16} align="center" wrap className="account-profile-head">
                <Avatar
                  size={72}
                  src={avatarUrl || undefined}
                  icon={!avatarUrl ? <UserOutlined /> : undefined}
                  className="profile-avatar"
                >
                  {!avatarUrl ? session.userEmail.slice(0, 1).toUpperCase() : null}
                </Avatar>
                <div className="account-profile-meta">
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {displayName}
                  </Typography.Title>
                  <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                    {profile?.email || session.userEmail}
                  </Typography.Paragraph>
                </div>
              </Space>

              <Descriptions column={1} size="small">
                <Descriptions.Item label="用户 ID">
                  {session.user?.id ? (
                    <Typography.Text copyable={{ text: session.user.id }}>
                      {formatAccountId(session.user.id)}
                    </Typography.Text>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {formatAccountTimestamp(profile?.created_at)}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {formatAccountTimestamp(profile?.updated_at)}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card className="account-form-card" title="编辑账户信息">
            <Form
              className="account-form"
              form={form}
              layout="vertical"
              onFinish={submit}
              initialValues={{
                display_name: "",
                avatar_url: "",
              }}
            >
              <Form.Item
                label="显示名"
                name="display_name"
                rules={[
                  {
                    max: 48,
                    message: "显示名不要超过 48 个字符。",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="例如：张三 / Acme Team / Demo User"
                />
              </Form.Item>

              <Form.Item
                label="头像 URL"
                name="avatar_url"
                rules={[
                  {
                    validator: async (_, value) => {
                      const input = String(value ?? "").trim();
                      if (!input) {
                        return;
                      }

                      try {
                        new URL(input);
                      } catch {
                        throw new Error("请输入有效的 URL。");
                      }
                    },
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="https://example.com/avatar.png"
                />
              </Form.Item>

              <Space wrap className="account-form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckCircleOutlined />}
                  loading={saveProfile.isPending}
                >
                  保存信息
                </Button>
                <Button
                  onClick={() =>
                    form.setFieldsValue({
                      display_name: profile?.display_name ?? "",
                      avatar_url: profile?.avatar_url ?? "",
                    })
                  }
                >
                  恢复当前值
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
