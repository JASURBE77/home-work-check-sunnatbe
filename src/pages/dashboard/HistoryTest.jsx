import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card, Row, Col, Tag, List, Typography, Button, Spin, Empty,
} from "antd";
import {
  ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const HistoryTest = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { result: initialResult } = location.state || {};
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(!initialResult);

  useEffect(() => {
    if (result) setLoading(false);
  }, [result]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div>;
  }

  if (!result) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Empty description={t("history.no_result") || "Natija topilmadi"} />
      </div>
    );
  }

  const scorePercentage = Math.round((result.totalScore / result.maxScore) * 100);
  const isGood = scorePercentage >= 70;
  const displayScore = result.totalScore < 99 ? result.totalScore.toFixed(1) : Math.ceil(result.maxScore);

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {result.student?.name} {result.student?.surname}
          </Title>
          <Text style={{ color: "#94a3b8", fontSize: 13 }}>Imtihon natijasi</Text>
        </div>
        <Link to="/tasks">
          <Button icon={<ArrowLeftOutlined />} style={{ borderRadius: 10 }}>
            {t("history.back") || "Orqaga"}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]}>
        <Col xs={12} md={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "14px 12px" } }}>
            <Text style={{ fontSize: 11, color: "#94a3b8", display: "block", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Holati</Text>
            <Tag color="blue">{result.status || "Yakunlangan"}</Tag>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "14px 12px" } }}>
            <Text style={{ fontSize: 11, color: "#94a3b8", display: "block", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Boshlangan</Text>
            <Text style={{ fontSize: 12, fontWeight: 500 }}>
              {result.startedAt ? new Date(result.startedAt).toLocaleString("uz-UZ") : "—"}
            </Text>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "14px 12px" } }}>
            <Text style={{ fontSize: 11, color: "#94a3b8", display: "block", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Tugatilgan</Text>
            <Text style={{ fontSize: 12, fontWeight: 500 }}>
              {result.finishedAt ? new Date(result.finishedAt).toLocaleString("uz-UZ") : "—"}
            </Text>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            style={{ borderRadius: 12, border: `1px solid ${isGood ? "#bbf7d0" : "#fecaca"}`, background: isGood ? "#f0fdf4" : "#fff5f5", textAlign: "center" }}
            styles={{ body: { padding: "14px 12px" } }}
          >
            <Text style={{ fontSize: 11, color: "#94a3b8", display: "block", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Ball</Text>
            <Text style={{ fontSize: 22, fontWeight: 700, color: isGood ? "#16a34a" : "#ef4444" }}>
              {displayScore}
              <Text style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400, marginLeft: 4 }}>
                / {Math.ceil(result.maxScore)}
              </Text>
            </Text>
            <br />
            <Tag color={isGood ? "success" : "error"}>{scorePercentage}% · {isGood ? "Yaxshi" : "Yaxshilash kerak"}</Tag>
          </Card>
        </Col>
      </Row>

      {/* Answers */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircleOutlined style={{ color: "#1935CA" }} />
            <Text strong>{t("history.questions") || "Savollar va javoblar"}</Text>
            <Text style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
              {result.answers?.length || 0} ta
            </Text>
          </div>
        }
        style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}
        styles={{ body: { padding: 0 } }}
      >
        {!result.answers?.length ? (
          <div style={{ padding: 40 }}>
            <Empty description={t("history.no_questions") || "Savollar mavjud emas"} />
          </div>
        ) : (
          <List
            dataSource={result.answers}
            renderItem={(ans, index) => {
              const isCorrect = ans.score > 0;
              return (
                <List.Item style={{ padding: "16px 20px", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 14, width: "100%" }}>
                    {/* Number */}
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: isCorrect ? "#f0fdf4" : "#fff5f5",
                      border: `1px solid ${isCorrect ? "#bbf7d0" : "#fecaca"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                      color: isCorrect ? "#16a34a" : "#ef4444",
                      marginTop: 2,
                    }}>
                      {index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: 13 }}>
                        {ans.questionText || "Savol matni mavjud emas"}
                      </Text>

                      <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
                        <Col xs={24} sm={12}>
                          <div style={{
                            borderRadius: 10, padding: "10px 12px",
                            background: isCorrect ? "#f0fdf4" : "#fff5f5",
                            border: `1px solid ${isCorrect ? "#bbf7d0" : "#fecaca"}`,
                          }}>
                            <Text style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: 4, letterSpacing: 1 }}>
                              Sizning javobingiz
                            </Text>
                            <Text style={{ fontSize: 13, fontWeight: 500, color: isCorrect ? "#16a34a" : "#ef4444" }}>
                              {ans.selectedAnswer?.value || "—"}
                            </Text>
                          </div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <div style={{ borderRadius: 10, padding: "10px 12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                            <Text style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: 4, letterSpacing: 1 }}>
                              To'g'ri javob
                            </Text>
                            <Text style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
                              {ans.correctAnswer?.value || "—"}
                            </Text>
                          </div>
                        </Col>
                      </Row>

                      <Tag
                        color={isCorrect ? "success" : "error"}
                        icon={isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        style={{ marginTop: 8 }}
                      >
                        {isCorrect ? "+" : ""}{ans.score || 0} ball
                      </Tag>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default HistoryTest;
