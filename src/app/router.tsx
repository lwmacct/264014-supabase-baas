import { Alert, Button, Layout, Spin, Typography } from "antd";
import {
  createHashRouter,
  isRouteErrorResponse,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { appNavItems } from "./routes";
import { AppLayout } from "../components/AppLayout";
import { AuthPage } from "../pages/auth";
import { useSession } from "../session/SessionProvider";

function RootShell() {
  return <Outlet />;
}

function ProtectedLayout() {
  const session = useSession();
  const location = useLocation();

  if (session.initializing) {
    return (
      <Layout className="fullscreen-layout">
        <Spin size="large" />
      </Layout>
    );
  }

  if (!session.user) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?from=${encodeURIComponent(next)}`} replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let description = "页面加载失败";
  if (isRouteErrorResponse(error)) {
    description = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <Layout className="fullscreen-layout">
      <Alert
        type="error"
        showIcon
        message="路由加载失败"
        description={
          <div>
            <Typography.Text>{description}</Typography.Text>
            <div style={{ marginTop: 12 }}>
              <Button type="primary" onClick={() => navigate(0)}>
                重试
              </Button>
            </div>
          </div>
        }
      />
    </Layout>
  );
}

const router = createHashRouter([
  {
    path: "/",
    element: <RootShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/overview" replace />,
          },
          ...appNavItems.map((item) => ({
            path: item.key,
            element: item.element,
          })),
        ],
      },
      {
        path: "*",
        element: <Navigate to="/overview" replace />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
