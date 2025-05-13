import { Layout, Menu } from "antd";
import { PictureOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/MainLayout.module.css";

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className={styles.mainLayout}>
      {/* Top header with logo */}
      <Header className={styles.header}>
        <div className={styles.logoContainer} onClick={() => navigate("/albums")}>
          <img src="/src/assets/geekup-logo-general.svg" alt="GeekUp" />
        </div>
      </Header>

      <Layout className={styles.contentLayout}>
        {/* Sidebar navigation */}
        <Sider width={200} className={styles.sidebar}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname.startsWith("/users") ? "/users" : "/albums"]}
            onClick={({ key }) => navigate(key)}
            items={[
              {
                key: "/albums",
                icon: <PictureOutlined />,
                label: "Albums",
              },
              {
                key: "/users",
                icon: <UserOutlined />,
                label: "Users",
              },
            ]}
          />
        </Sider>

        {/* Main content area */}
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
