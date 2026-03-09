import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card, Row, Col, Statistic, Progress, Tag, List, Typography, Button, Spin,
} from "antd";
import {
  CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined, RiseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "../../hooks/useToast";
import { SubmissionsGet } from "../../store/slice/submissionsSlice";

const { Text, Title } = Typography;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Dashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();

  const profile = useSelector((state) => state.profile.data);
  const profileLoading = useSelector((state) => state.profile.loading);
  const { data: submissions, loading, error } = useSelector((state) => state.submissions);

  useEffect(() => {
    if (profile?._id) dispatch(SubmissionsGet());
  }, [dispatch, profile]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const completed = submissions.filter(
    (s) => s.submission.status === "CHECKED" || s.submission.status === "AGAIN CHECKED"
  ).length;

  const pending = submissions.filter((s) => s.submission.status === "PENDING").length;

  const totalPoints = submissions
    .filter((s) => s.submission.status === "CHECKED" || s.submission.status === "AGAIN CHECKED")
    .reduce((sum, s) => sum + (s.submission.score || 0), 0);

  const progressPct =
    submissions.length > 0 ? Math.round((completed / submissions.length) * 100) : 0;

  const recentSubmissions = submissions.slice(0, 5);
  const userName = profile?.name || "Talaba";

  if (loading || profileLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Button type="primary" onClick={() => dispatch(SubmissionsGet())} style={{ borderRadius: 10 }}>
          {t("home.retry")}
        </Button>
      </div>
    );
  }

  const getStatusTag = (status) => {
    switch (status) {
      case "CHECKED":
        return <Tag color="success">{t("home.status.checked")}</Tag>;
      case "AGAIN CHECKED":
        return <Tag color="purple">{t("home.status.rechecked")}</Tag>;
      case "PENDING":
        return <Tag color="warning">{t("home.status.pending")}</Tag>;
      default:
        return <Tag>{t("home.status.done")}</Tag>;
    }
  };

  const statCards = [
    {
      title: t("home.completed"),
      value: completed,
      prefix: <CheckCircleOutlined style={{ color: "#22c55e" }} />,
      sub: t("home.all_checked"),
      pct: progressPct,
      color: "#22c55e",
    },
    {
      title: t("home.pending"),
      value: pending,
      prefix: <ClockCircleOutlined style={{ color: "#f59e0b" }} />,
      sub: t("home.unchecked"),
      pct: submissions.length > 0 ? Math.round((pending / submissions.length) * 100) : 0,
      color: "#f59e0b",
    },
    {
      title: t("home.total_score"),
      value: totalPoints,
      prefix: <TrophyOutlined style={{ color: "#3b82f6" }} />,
      sub: t("home.from_all"),
      pct: 100,
      color: "#3b82f6",
    },
    {
      title: t("home.progress"),
      value: progressPct,
      suffix: "%",
      prefix: <RiseOutlined style={{ color: "#8b5cf6" }} />,
      sub: `${completed} / ${submissions.length} ${t("home.submitted_of")}`,
      pct: progressPct,
      color: "#8b5cf6",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title level={4} style={{ margin: 0, color: "#1e293b" }}>
          {t("home.greeting")}, <span style={{ color: "#1935CA" }}>{userName}!</span>
        </Title>
        <Text style={{ color: "#94a3b8", fontSize: 13 }}>{t("home.subtitle")}</Text>
      </motion.div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        {statCards.map((card, i) => (
          <Col key={i} xs={24} sm={12} lg={6}>
            <motion.div custom={i} variants={cardVariants} initial="hidden" animate="visible">
              <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
                <Statistic
                  title={<Text style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{card.title}</Text>}
                  value={card.value}
                  suffix={card.suffix}
                  prefix={card.prefix}
                  valueStyle={{ color: "#1e293b", fontWeight: 700 }}
                />
                <Text style={{ fontSize: 11, color: "#94a3b8" }}>{card.sub}</Text>
                <Progress percent={card.pct} showInfo={false} strokeColor={card.color} trailColor="#f1f5f9" size="small" style={{ marginTop: 8 }} />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Recent Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text strong style={{ fontSize: 14 }}>{t("home.recent")}</Text>
              <Text style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
                {submissions.length} {t("home.total_count")}
              </Text>
            </div>
          }
          style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}
          styles={{ body: { padding: 0 } }}
        >
          {recentSubmissions.length > 0 ? (
            <List
              dataSource={recentSubmissions}
              renderItem={(item) => {
                const sub = item.submission;
                const isPending = sub.status === "PENDING";
                return (
                  <List.Item
                    style={{ padding: "12px 20px" }}
                    extra={
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
                          {sub.score > 0 ? `${sub.score} ${t("home.ball")}` : "—"}
                        </div>
                        {getStatusTag(sub.status)}
                      </div>
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: isPending ? "#fffbeb" : "#f0fdf4",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {isPending
                            ? <ClockCircleOutlined style={{ color: "#f59e0b", fontSize: 16 }} />
                            : <CheckCircleOutlined style={{ color: "#22c55e", fontSize: 16 }} />
                          }
                        </div>
                      }
                      title={<Text style={{ fontSize: 13, fontWeight: 500 }}>{sub.description || "Topshiriq"}</Text>}
                      description={
                        <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                          {new Date(sub.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
                        </Text>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8", fontSize: 13 }}>
              {t("home.empty")}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
