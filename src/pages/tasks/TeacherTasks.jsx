import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card, Button, Modal, Tag, Input, Typography, Row, Col, Spin, Empty, Space,
} from "antd";
import {
  ExportOutlined, LinkOutlined, WarningOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useToast } from "../../hooks/useToast";
import api from "../../utils/api";

const { Text, Title } = Typography;

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
  }),
};

const TeacherTasks = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [groupId, setGroupId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startingId, setStartingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [practiceLinks, setPracticeLinks] = useState({});
  const navigate = useNavigate();

  const getme = async () => {
    try {
      const res = await api({ url: "/users/me", method: "GET" });
      setGroupId(res.data.group?._id);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const res = await api({ url: `/exam-session/group`, method: "GET" });
      setTasks(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const startexam = async (sessionId) => {
    try {
      setStartingId(sessionId);
      const res = await api({ url: "/student-exam/start", method: "POST", data: { sessionId } });
      navigate(`/student-exam/${res.data.content.examSession}`);
    } catch (error) {
      toast.error(t("tasks.start_error") || "Imtihonni boshlashda xatolik");
      console.error(error);
    } finally {
      setStartingId(null);
      setShowModal(false);
    }
  };

  const viewResult = async (sessionId) => {
    try {
      setStartingId(sessionId);
      const res = await api({ url: `/student-exam/status`, method: "GET", params: { sessionId } });
      navigate("/historytask", { state: { result: res.data } });
    } catch (err) {
      toast.error(t("tasks.result_error") || "Natijani olishda xatolik");
      console.error(err);
    } finally {
      setStartingId(null);
    }
  };

  const sendPracticeLink = async (taskId) => {
    const link = practiceLinks[taskId];
    if (!link) return;
    try {
      setStartingId(taskId);
      await api({ url: "/exam-session/practice/submit", method: "POST", data: { sessionId: taskId, link } });
      toast.success(t("tasks.submitted") || "Havola muvaffaqiyatli yuborildi!");
      await fetchTasks();
      setPracticeLinks((prev) => ({ ...prev, [taskId]: "" }));
    } catch (err) {
      toast.error(t("tasks.send_error") || "Yuborishda xatolik yuz berdi");
      console.error(err);
    } finally {
      setStartingId(null);
    }
  };

  useEffect(() => { getme(); }, []);
  useEffect(() => { fetchTasks(); }, [groupId]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin size="large" /></div>;
  }

  if (tasks.length === 0) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Empty description={t("tasks.empty")} /></div>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 16 }}
      >
        <Title level={4} style={{ margin: 0 }}>{t("tasks.title")}</Title>
        <Text style={{ color: "#94a3b8", fontSize: 13 }}>{tasks.length} {t("tasks.count")}</Text>
      </motion.div>

      <Row gutter={[16, 16]}>
        {tasks.map((task, idx) => {
          const isFinished = task.studentExam?.status === "finished";
          const isPending = task.status === "pending";
          const isStarting = startingId === task._id;
          const isPractice = task.examId?.type === "practice";

          return (
            <Col key={task._id} xs={24} md={12} lg={8}>
              <motion.div
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{ height: "100%" }}
              >
                <Card
                  style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%", display: "flex", flexDirection: "column" }}
                  styles={{ body: { display: "flex", flexDirection: "column", flex: 1, gap: 12 } }}
                >
                  {/* Title + type */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <Text strong style={{ fontSize: 14, flex: 1 }}>
                      {task.examId?.title || t("tasks.unnamed")}
                    </Text>
                    <Tag color={isPractice ? "purple" : "blue"} style={{ flexShrink: 0 }}>
                      {isPractice ? t("tasks.practice") : t("tasks.test")}
                    </Tag>
                  </div>

                  {task.examId?.description && (
                    <Text style={{ fontSize: 13, color: "#64748b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {task.examId.description}
                    </Text>
                  )}

                  {/* Group + status */}
                  <Space size={6} wrap>
                    {task.groupId?.groupName && (
                      <Tag>{task.groupId.groupName}</Tag>
                    )}
                    <Tag color={isFinished ? "success" : isPending ? "warning" : "processing"}>
                      {isFinished ? t("tasks.finished") : isPending ? t("tasks.waiting") : t("tasks.active")}
                    </Tag>
                  </Space>

                  {/* Practice extras */}
                  {isPractice && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {task.examId?.link && (
                        <a href={task.examId.link} target="_blank" rel="noreferrer">
                          <Button type="link" icon={<ExportOutlined />} style={{ padding: 0, fontSize: 13 }}>
                            {t("tasks.open_layout")}
                          </Button>
                        </a>
                      )}

                      {task.examId?.requireds && (
                        <div>
                          <Text style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>
                            {t("tasks.requirements")}
                          </Text>
                          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#475569", maxHeight: 100, overflow: "auto", whiteSpace: "pre-wrap" }}>
                            {task.examId.requireds}
                          </div>
                        </div>
                      )}

                      {!isFinished ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <Input
                            placeholder={t("tasks.placeholder_link")}
                            value={practiceLinks[task._id] || ""}
                            onChange={(e) => setPracticeLinks((prev) => ({ ...prev, [task._id]: e.target.value }))}
                            style={{ borderRadius: 10, fontSize: 13 }}
                          />
                          <Button
                            type="primary"
                            icon={<LinkOutlined />}
                            onClick={() => sendPracticeLink(task._id)}
                            loading={isStarting}
                            disabled={!practiceLinks[task._id]?.trim()}
                            style={{ borderRadius: 10, flexShrink: 0 }}
                          >
                            {t("tasks.send")}
                          </Button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px" }}>
                          <CheckCircleOutlined style={{ color: "#22c55e" }} />
                          <Text style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }}>{t("tasks.submitted")}</Text>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Test button */}
                  {!isPractice && (
                    <Button
                      type="primary"
                      block
                      loading={isStarting}
                      disabled={isPending}
                      style={{
                        marginTop: "auto",
                        borderRadius: 12,
                        fontWeight: 600,
                        background: isFinished ? "#16a34a" : undefined,
                        borderColor: isFinished ? "#16a34a" : undefined,
                      }}
                      onClick={() =>
                        isFinished
                          ? viewResult(task._id)
                          : (setSelectedSession(task._id), setShowModal(true))
                      }
                    >
                      {isStarting
                        ? t("tasks.starting")
                        : isFinished
                        ? t("tasks.view_result")
                        : isPending
                        ? t("tasks.waiting_start")
                        : t("tasks.start")}
                    </Button>
                  )}
                </Card>
              </motion.div>
            </Col>
          );
        })}
      </Row>

      {/* Warning Modal */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        width={380}
        styles={{ body: { padding: "24px" } }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22 }}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WarningOutlined style={{ color: "#f59e0b", fontSize: 20 }} />
          </div>
          <Title level={5} style={{ margin: 0 }}>{t("tasks.warning")}</Title>
          <Text style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
            {t("tasks.warning_text")}
          </Text>
          <div style={{ display: "flex", gap: 12 }}>
            <Button block onClick={() => setShowModal(false)} style={{ borderRadius: 10 }}>
              {t("tasks.cancel")}
            </Button>
            <Button
              type="primary"
              block
              style={{ borderRadius: 10, fontWeight: 600 }}
              onClick={() => startexam(selectedSession)}
              loading={!!startingId}
            >
              {t("tasks.begin")}
            </Button>
          </div>
        </motion.div>
      </Modal>
    </div>
  );
};

export default TeacherTasks;
