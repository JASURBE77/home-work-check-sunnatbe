import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Card, Avatar, Row, Col, Progress, Typography, Spin, Empty, Descriptions, Tag,
} from "antd";
import {
  TrophyOutlined, CalendarOutlined, UserOutlined, AimOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import api from "../../utils/api";
import dayjs from "dayjs";

const { Text, Title } = Typography;

export default function Profile() {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.profile.data);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!token || !profile?._id) return;
      try {
        const res = await api({ url: `/submissions/${profile._id}`, method: "GET", headers: { Authorization: `Bearer ${token}` } });
        const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        setSubmissions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token, profile]);

  const user = submissions.length > 0 ? submissions[0] : null;

  const stats = {
    total: submissions.length,
    completed: submissions.filter((s) => s.submission?.status === "CHECKED" || s.submission?.status === "AGAIN CHECKED").length,
    pending: submissions.filter((s) => s.submission?.status === "PENDING").length,
    totalScore: submissions
      .filter((s) => s.submission?.status === "CHECKED" || s.submission?.status === "AGAIN CHECKED")
      .reduce((sum, s) => sum + (s.submission?.score || 0), 0),
  };

  const progressPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const courses = submissions.reduce((acc, item) => {
    if (item.group?.name) {
      const g = item.group.name;
      if (!acc[g]) acc[g] = { total: 0, completed: 0 };
      acc[g].total++;
      if (item.submission?.status === "CHECKED" || item.submission?.status === "AGAIN CHECKED") {
        acc[g].completed++;
      }
    }
    return acc;
  }, {});

  const courseProgress = Object.entries(courses)
    .map(([name, data]) => ({ name, percentage: Math.round((data.completed / data.total) * 100) }))
    .slice(0, 3);

  const initials = `${profile?.name?.[0] || ""}${profile?.surname?.[0] || ""}`.toUpperCase();

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div>;
  }

  if (!user) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Empty description={t("profile.not_found")} /></div>;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.32, ease: "easeOut" },
    }),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Profile header card */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
      <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Avatar
              size={72}
              style={{ background: "#1935CA", fontWeight: 700, fontSize: 24 }}
            >
              {initials}
            </Avatar>
            <span style={{
              position: "absolute", bottom: 2, right: 2,
              width: 14, height: 14, borderRadius: "50%",
              background: "#22c55e", border: "2px solid #fff",
            }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {user.name} {user.surname}
            </Title>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              <Tag icon={<UserOutlined />}>{t("profile.student")}</Tag>
              {user.group && <Tag icon={<CalendarOutlined />}>{user.group.name}</Tag>}
              {stats.completed > 0 && (
                <Tag color="gold" icon={<TrophyOutlined />}>
                  #{Math.ceil(stats.completed / 2)} {t("profile.rating")}
                </Tag>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <Row gutter={[12, 12]} style={{ marginTop: 20 }}>
          {[
            { label: t("profile.total"), value: stats.total, color: "#1e293b" },
            { label: t("profile.completed"), value: stats.completed, color: "#16a34a" },
            { label: t("profile.pending"), value: stats.pending, color: "#d97706" },
            { label: t("profile.total_score"), value: stats.totalScore, color: "#1935CA" },
          ].map((item, i) => (
            <Col key={i} xs={12} sm={6}>
              <div style={{
                background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: 12, padding: "14px 16px", textAlign: "center",
              }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{item.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      </motion.div>

      <Row gutter={[16, 16]}>
        {/* Contact info */}
        <Col xs={24} lg={12}>
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <Card
            title={<Text strong style={{ fontSize: 14 }}>{t("profile.contact")}</Text>}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("profile.full_name")}>
                <Text strong>{user.name} {user.surname}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                <Text code style={{ fontSize: 11 }}>{user.userId}</Text>
              </Descriptions.Item>
              {user.group && (
                <Descriptions.Item label={t("profile.group")}>
                  <Tag>{user.group.name}</Tag>
                </Descriptions.Item>
              )}
              <Descriptions.Item label={t("profile.last_submission")}>
                <Text>
                  {submissions[0]?.submission?.date
                    ? dayjs(submissions[0].submission.date).format("DD.MM.YYYY")
                    : t("profile.no_data")}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
          </motion.div>
        </Col>

        {/* Progress */}
        <Col xs={24} lg={12}>
          <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <Card
            title={
              <span>
                <AimOutlined style={{ color: "#1935CA", marginRight: 6 }} />
                <Text strong style={{ fontSize: 14 }}>{t("profile.learning_progress")}</Text>
              </span>
            }
            style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
          >
            {courseProgress.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {courseProgress.map((course, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <Text style={{ fontSize: 13, fontWeight: 500 }}>{course.name}</Text>
                      <Text strong style={{ fontSize: 13, color: course.percentage >= 80 ? "#22c55e" : course.percentage >= 50 ? "#1935CA" : "#f59e0b" }}>
                        {course.percentage}%
                      </Text>
                    </div>
                    <Progress
                      percent={course.percentage}
                      showInfo={false}
                      strokeColor={course.percentage >= 80 ? "#22c55e" : course.percentage >= 50 ? "#1935CA" : "#f59e0b"}
                      trailColor="#f1f5f9"
                      size="small"
                    />
                  </div>
                ))}
                <div style={{ paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text strong style={{ fontSize: 13 }}>{t("profile.overall_progress")}</Text>
                    <Text strong style={{ fontSize: 13, color: "#8b5cf6" }}>{progressPct}%</Text>
                  </div>
                  <Progress percent={progressPct} showInfo={false} strokeColor="#8b5cf6" trailColor="#f1f5f9" size="small" />
                </div>
              </div>
            ) : (
              <Empty description={t("profile.no_courses")} imageStyle={{ height: 48 }} />
            )}
          </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
