import { createRoot } from "react-dom/client";
import { ConfigProvider, App as AntApp } from "antd";
import AppRouter from "./routers/AppRouter";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import 'antd/dist/reset.css';
import './index.css';
import './i18n';

const theme = {
  token: {
    colorPrimary: '#1935CA',
    colorLink: '#1935CA',
    borderRadius: 10,
    fontFamily: '"Poppins", sans-serif',
    colorBgLayout: '#f0f2f5',
    colorBgContainer: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      headerBg: '#ffffff',
      bodyBg: '#f0f2f5',
    },
    Menu: {
      itemBorderRadius: 10,
      itemSelectedBg: '#1935CA',
      itemSelectedColor: '#ffffff',
      itemHoverBg: '#f0f2f5',
    },
    Card: {
      borderRadiusLG: 14,
    },
    Button: {
      borderRadius: 10,
    },
  },
};

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider theme={theme}>
        <AntApp>
          <AppRouter />
        </AntApp>
      </ConfigProvider>
    </PersistGate>
  </Provider>
);
