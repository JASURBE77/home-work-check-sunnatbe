import React from "react";
import { Layout, Menu, Drawer, Typography } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../assets/logo.png";

const { Sider } = Layout;
const { Text } = Typography;

const SIDER_WIDTH = 220;

export default function Sidebar({ mobileOpen, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "/",        icon: <HomeOutlined />,        label: t("nav.home") },
    { key: "/homework",icon: <BookOutlined />,         label: t("nav.homework") },
    { key: "/reviews", icon: <CheckSquareOutlined />,  label: t("nav.reviews") },
    { key: "/tasks",   icon: <FileTextOutlined />,     label: t("nav.tasks") },
    { key: "/profile", icon: <UserOutlined />,         label: t("nav.profile") },
  ];

  const selectedKey =
    location.pathname === "/" ? "/" : "/" + location.pathname.split("/")[1];

  const handleClick = ({ key }) => {
    navigate(key);
    onClose?.();
  };

  const logo = (
    <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
      <img src={Logo} alt="logo" style={{ width: 28, height: 28, objectFit: "contain" }} />
      <span>
        <Text strong style={{ fontSize: 16, color: "#1e293b" }}>Student</Text>
        <Text strong style={{ fontSize: 16, color: "#1935CA" }}>Control</Text>
      </span>
    </div>
  );

  const menuNode = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={items}
      onClick={handleClick}
      style={{ border: "none", padding: "8px 8px" }}
    />
  );

  return (
    <>
      {/* Desktop sider */}
      <Sider
        width={SIDER_WIDTH}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        className="hidden-mobile"
      >
        {logo}
        <div style={{ flex: 1, overflow: "auto" }}>{menuNode}</div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0" }}>
          <Text style={{ fontSize: 11, color: "#94a3b8" }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", marginRight: 6 }} />
            {t("sidebar.version")}
          </Text>
        </div>
      </Sider>

      {/* Mobile drawer */}
      <Drawer
        open={mobileOpen}
        onClose={onClose}
        placement="left"
        width={SIDER_WIDTH}
        styles={{ body: { padding: 0, display: "flex", flexDirection: "column" }, header: { display: "none" } }}
      >
        {logo}
        <div style={{ flex: 1 }}>{menuNode}</div>
      </Drawer>
    </>
  );
}
