import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import { useTranslation } from "react-i18next";
import {
  Card, Row, Col, Statistic, Tag, Typography, Button, Spin, Rate, Empty,
} from "antd";
import {
  CheckCircleOutlined, StarOutlined, TrophyOutlined, ExportOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useToast } from "../../hooks/useToast";

const { Text, Title } = Typography;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.32, ease: "easeOut" },
  }),
};

const Review = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.profile.data);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = async (showToast = false) => {
    if (!token || !profile?._id) return;
    setLoading(true);
    try {
      const res = await api({
        url: `/submissions/${profile._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data.data || []);
      if (showToast) toast.success(t("review.refreshed") || "Yangilandi!");
    } catch (err) {
      console.error("Submissions fetch error:", err);
      if (showToast) toast.error(t("review.refresh_error") || "Yangilashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, [token, profile?._id]);

  const checkedSubmissions = submissions.filter(
    (s) =>
      s.submission.status === "CHECKED" ||
      s.submission.status === "AGAIN CHECKED" ||
      s.submission.status === "PENDING"
  );

  const stats = {
    total: checkedSubmissions.length,
    avgScore: checkedSubmissions.length > 0
      ? Math.round(checkedSubmissions.reduce((sum, s) => sum + (s.submission.score || 0), 0) / checkedSubmissions.length)
      : 0,
    totalScore: checkedSubmissions.reduce((sum, s) => sum + (s.submission.score || 0), 0),
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#22c55e";
    if (score >= 70) return "#f59e0b";
    return "#ef4444";
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "CHECKED": return <Tag color="success">{t("review.status.checked")}</Tag>;
      case "AGAIN CHECKED": return <Tag color="purple">{t("review.status.rechecked")}</Tag>;
      default: return <Tag color="warning">{t("review.status.pending")}</Tag>;
    }
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div>;
  }

  if (checkedSubmissions.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Empty description={t("review.empty")} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Title level={4} style={{ margin: 0 }}>{t("review.title")}</Title>
        <Text style={{ color: "#94a3b8", fontSize: 13 }}>{t("review.subtitle")}</Text>
      </motion.div>

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {[
          {
            title: t("review.total"),
            value: stats.total,
            prefix: <CheckCircleOutlined style={{ color: "#22c55e" }} />,
          },
          {
            title: t("review.avg_score"),
            value: stats.avgScore,
            suffix: "%",
            prefix: <StarOutlined style={{ color: "#3b82f6" }} />,
          },
          {
            title: t("review.total_score"),
            value: stats.totalScore,
            prefix: <TrophyOutlined style={{ color: "#f59e0b" }} />,
          },
        ].map((stat, i) => (
          <Col key={i} xs={24} sm={8}>
            <motion.div
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  valueStyle={{ color: "#1e293b", fontWeight: 700 }}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {checkedSubmissions.map((item, idx) => {
          const sub = item.submission;
          const score = sub.score || 0;
          const scoreColor = getScoreColor(score);
          const repoName = sub.HwLink?.includes("github.com")
            ? sub.HwLink.split("/").slice(-1)[0]
            : sub.description || "Loyiha";

          return (
            <motion.div
              key={sub._id || idx}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card
                style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}
                styles={{ body: { padding: "16px 20px" } }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  {/* Score badge */}
                  <div style={{
                    minWidth: 56, height: 56, borderRadius: 14,
                    background: `${scoreColor}15`,
                    border: `1px solid ${scoreColor}30`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>/100</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                      <Text strong style={{ fontSize: 14 }}>{repoName}</Text>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {getStatusTag(sub.status)}
                        {sub.HwLink && (
                          <a href={sub.HwLink} target="_blank" rel="noopener noreferrer">
                            <Button type="link" icon={<ExportOutlined />} size="small" style={{ padding: 0, fontSize: 12 }}>
                              {t("review.view")}
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                      <Rate disabled value={Math.min(Math.floor(score / 20), 5)} style={{ fontSize: 12 }} />
                      <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                        {new Date(sub.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
                      </Text>
                    </div>

                    {sub.description && (
                      <Text style={{ fontSize: 13, color: "#64748b", display: "block", marginTop: 6 }}>
                        {sub.description}
                      </Text>
                    )}

                    {sub.teacherDescription && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                        <Text style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>
                          {t("review.teacher_comment")} {sub.checkedBy && `· ${sub.checkedBy}`}
                        </Text>
                        <Text style={{ fontSize: 13, color: "#475569" }}>{sub.teacherDescription}</Text>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Refresh button */}
      <Button
        type="primary"
        shape="circle"
        icon={<ReloadOutlined />}
        onClick={() => fetchSubmissions(true)}
        loading={loading}
        size="large"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 48, height: 48, zIndex: 50,
          boxShadow: "0 4px 14px rgba(25,53,202,0.35)",
        }}
      />
    </div>
  );
};

export default Review;
