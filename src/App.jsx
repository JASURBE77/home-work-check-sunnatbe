import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const { Content } = Layout;

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.18, ease: "easeIn" } },
};

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Layout style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Header
          onMenuClick={() => setMobileOpen(!mobileOpen)}
          isSidebarOpen={mobileOpen}
        />
        <Content
          style={{
            flex: 1,
            overflow: "auto",
            padding: "16px",
            background: "#f0f2f5",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ height: "100%" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
