import React, { useEffect } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useToast } from "../../hooks/useToast";
import LoginImg from "../../assets/LoginImg.svg";
import Logo from "../../assets/logo.png";

const { Title, Text } = Typography;

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, error } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onFinish = async (values) => {
    const resultAction = await dispatch(
      loginUser({ login: values.login, password: values.password })
    );
    if (loginUser.fulfilled.match(resultAction)) {
      localStorage.setItem("accessToken", resultAction.payload.accessToken);
      toast.success(t("login.success") || "Muvaffaqiyatli kirdingiz!");
      navigate("/");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#e7ecf3" }}>
      {/* Left image */}
      <div style={{ flex: 1, display: "none", position: "relative" }} className="login-img-side">
        <img src={LoginImg} alt="login" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative" }}>
        <img
          src={Logo}
          alt="logo"
          style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, objectFit: "contain" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          <Card
            style={{ borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
            styles={{ body: { padding: "36px 32px" } }}
          >
            <Title level={3} style={{ color: "#1935CA", marginBottom: 4 }}>
              {t("login.title")}
            </Title>
            <Text style={{ color: "#1935CA", fontSize: 13, display: "block", marginBottom: 28 }}>
              {t("login.subtitle")}
            </Text>

            <Form form={form} layout="vertical" onFinish={onFinish} size="large">
              <Form.Item
                name="login"
                label={<span style={{ fontWeight: 600, color: "#696F79" }}>{t("login.login_label")}</span>}
                rules={[{ required: true, message: t("login.error_login") }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                  placeholder={t("login.login_label")}
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span style={{ fontWeight: 600, color: "#696F79" }}>{t("login.password_label")}</span>}
                rules={[
                  { required: true, message: t("login.error_password") },
                  { min: 6, message: t("login.error_password_min") },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                  placeholder={t("login.password_label")}
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{ height: 48, fontWeight: 600, letterSpacing: 1, borderRadius: 12 }}
                >
                  {t("login.button")}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
