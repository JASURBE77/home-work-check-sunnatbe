import React from "react";
import { Dropdown, Button } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("ru") ? "ru" : "uz";

  const items = [
    {
      key: "uz",
      label: "🇺🇿 O'zbekcha",
      onClick: () => i18n.changeLanguage("uz"),
    },
    {
      key: "ru",
      label: (
        <span>
          🇷🇺 Русский{" "}
          <span style={{ fontSize: 10, background: "#ef4444", color: "#fff", padding: "1px 6px", borderRadius: 4, marginLeft: 4 }}>
            BETA
          </span>
        </span>
      ),
      onClick: () => i18n.changeLanguage("ru"),
    },
  ];

  return (
    <Dropdown menu={{ items, selectedKeys: [currentLang] }} trigger={["click"]} placement="bottomRight">
      <Button
        icon={<GlobalOutlined />}
        style={{ borderRadius: 10 }}
      >
        {currentLang === "uz" ? "O'zbekcha" : "Русский"}
      </Button>
    </Dropdown>
  );
};

export default LanguageSelector;
