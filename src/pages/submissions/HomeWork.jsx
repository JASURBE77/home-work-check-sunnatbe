import React, { useState, useEffect } from "react";
import {
  Card, Form, Input, Select, Button, Typography, Space,
} from "antd";
import {
  CloudUploadOutlined, LinkOutlined, MessageOutlined, SendOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sendHomework, resetSendState } from "../../store/slice/submissionsSlice";
import { useToast } from "../../hooks/useToast";

const { Title, Text } = Typography;
const { TextArea } = Input;

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" },
  }),
};

export default function HouseDonationPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [form] = Form.useForm();
  const { sendLoading, sendError, sendSuccess } = useSelector((state) => state.submissions);

  useEffect(() => {
    if (sendSuccess) {
      toast.success(t("homework.success_title"));
      form.resetFields();
      const timer = setTimeout(() => dispatch(resetSendState()), 3000);
      return () => clearTimeout(timer);
    }
  }, [sendSuccess]);

  useEffect(() => {
    if (sendError) {
      toast.error(sendError);
    }
  }, [sendError]);

  const onFinish = (values) => {
    if (!isValidUrl(values.link)) {
      form.setFields([{ name: "link", errors: [t("homework.errors.link_invalid")] }]);
      toast.warning(t("homework.errors.link_invalid"));
      return;
    }
    dispatch(sendHomework({ link: values.link, comment: values.comment }));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#1935CA", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloudUploadOutlined style={{ color: "#fff", fontSize: 18 }} />
          </div>
          <div>
            <Title level={5} style={{ margin: 0 }}>{t("homework.page_title")}</Title>
            <Text style={{ color: "#94a3b8", fontSize: 13 }}>{t("homework.subtitle")}</Text>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <Form form={form} layout="vertical" onFinish={onFinish} size="large">
              <Form.Item
                name="type"
                label={<Text style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{t("homework.type_label")}</Text>}
                initialValue="github"
              >
                <Select style={{ borderRadius: 10 }}>
                  <Select.Option value="github">GitHub</Select.Option>
                  <Select.Option value="vercel">Vercel</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="link"
                label={
                  <Space>
                    <LinkOutlined style={{ color: "#64748b" }} />
                    <Text style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{t("homework.link_label")}</Text>
                  </Space>
                }
                rules={[{ required: true, message: t("homework.errors.link_required") }]}
                extra={<Text style={{ fontSize: 12, color: "#94a3b8" }}>{t("homework.link_hint")}</Text>}
              >
                <Input placeholder={t("homework.link_placeholder")} style={{ borderRadius: 10 }} />
              </Form.Item>

              <Form.Item
                name="comment"
                label={
                  <Space>
                    <MessageOutlined style={{ color: "#64748b" }} />
                    <Text style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{t("homework.comment_label")}</Text>
                  </Space>
                }
                rules={[
                  { required: true, message: t("homework.errors.comment_required") },
                  { max: 200, message: t("homework.errors.comment_max") },
                ]}
              >
                <TextArea
                  placeholder={t("homework.comment_placeholder")}
                  rows={4}
                  maxLength={200}
                  showCount
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={sendLoading}
                  icon={<SendOutlined />}
                  block
                  size="large"
                  style={{ borderRadius: 12, fontWeight: 600 }}
                >
                  {sendLoading ? t("homework.sending") : t("homework.send")}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </motion.div>

        {/* Tips */}
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <Card
            title={<Text strong style={{ fontSize: 13 }}>💡 {t("homework.tips_title")}</Text>}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}
            size="small"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[t("homework.tip1"), t("homework.tip2"), t("homework.tip3")].map((tip, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1935CA", marginTop: 6, flexShrink: 0 }} />
                  <Text style={{ fontSize: 13, color: "#64748b" }}>{tip}</Text>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
