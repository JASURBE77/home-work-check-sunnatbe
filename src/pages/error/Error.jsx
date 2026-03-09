import React from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button } from "antd";

export default function Error() {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f0f2f5" }}>
      <Result
        status="500"
        title="500"
        subTitle="Server xatoligi yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."
        extra={
          <Button type="primary" onClick={() => navigate("/")} style={{ borderRadius: 10 }}>
            Bosh sahifaga qaytish
          </Button>
        }
      />
    </div>
  );
}
