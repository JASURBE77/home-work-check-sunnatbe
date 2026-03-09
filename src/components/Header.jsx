import React, { useEffect, useState } from "react";
import {
  Layout, Avatar, Dropdown, Button, Badge, Typography, Space, Divider,
} from "antd";
import {
  MenuOutlined, BellOutlined, LogoutOutlined,
  UserOutlined, SettingOutlined, CaretDownOutlined,
} from "@ant-design/icons";
import LanguageSelector from "./LanguageSelector";
import Logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, clearProfile } from "../store/slice/Profilestore";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header({ onMenuClick }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.data);
  const loading = useSelector((state) => state.profile.loading);

  useEffect(() => {
    if (!user) dispatch(fetchProfile());
  }, [dispatch, user]);

  const checkoutUser = () => {
    dispatch(clearProfile());
    localStorage.removeItem("persist:auth");
    window.location.href = "/login";
  };

  const initials = `${user?.name?.[0]?.toUpperCase() || ""}${user?.surname?.[0]?.toUpperCase() || ""}`;

  const dropdownItems = {
    items: [
      {
        key: "profile-info",
        label: (
          <div style={{ padding: "8px 4px", minWidth: 180 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar size={36} style={{ background: "#1935CA", fontWeight: 700, fontSize: 13 }}>
                {initials}
              </Avatar>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
                  {user?.name} {user?.surname}
                </div>
                <div style={{ fontSize: 11, color: "#1935CA", textTransform: "capitalize" }}>
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        ),
        disabled: true,
      },
      { type: "divider" },
      {
        key: "my-profile",
        icon: <UserOutlined />,
        label: "Profil",
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Sozlamalar",
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: <span style={{ color: "#ef4444" }}>Chiqish</span>,
        danger: true,
        onClick: checkoutUser,
      },
    ],
  };

  if (loading) {
    return (
      <AntHeader
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 20px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ width: 160, height: 32, background: "#f1f5f9", borderRadius: 8 }} />
        <div style={{ width: 36, height: 36, background: "#f1f5f9", borderRadius: "50%" }} />
      </AntHeader>
    );
  }

  return (
    <AntHeader
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 20px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        flexShrink: 0,
      }}
    >
      {/* LEFT */}
      <Space size={12}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuClick}
          style={{ display: "none" }}
          className="mobile-menu-btn"
        />
        <Space size={8}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#eff6ff", border: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={Logo} alt="logo" style={{ width: 20, height: 20, objectFit: "contain" }} />
          </div>
          <span className="brand-text">
            <Text strong style={{ fontSize: 16, color: "#1e293b" }}>Student</Text>
            <Text strong style={{ fontSize: 16, color: "#1935CA" }}>Control</Text>
          </span>
        </Space>
      </Space>

      {/* RIGHT */}
      <Space size={8}>
        <LanguageSelector />

        <Badge dot status="error" offset={[-3, 3]}>
          <Button type="text" shape="circle" icon={<BellOutlined />} />
        </Badge>

        <Divider type="vertical" style={{ height: 24, margin: "0 4px" }} />

        <Dropdown menu={dropdownItems} trigger={["click"]} placement="bottomRight">
          <Space style={{ cursor: "pointer", padding: "4px 8px", borderRadius: 10 }} className="user-trigger">
            <Avatar size={32} style={{ background: "#1935CA", fontWeight: 700, fontSize: 12 }}>
              {initials}
            </Avatar>
            <span className="user-name-text">
              <Text strong style={{ fontSize: 13, color: "#1e293b" }}>
                {user?.name} {user?.surname}
              </Text>
            </span>
            <CaretDownOutlined style={{ fontSize: 11, color: "#94a3b8" }} />
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
