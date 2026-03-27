'use client';

import { App, ConfigProvider } from 'antd';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Primary color — matches React version's hsl(199 89% 36%)
          colorPrimary: '#0d8ab5',
          colorPrimaryHover: '#0a7299',

          // Typography
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: 13,
          borderRadius: 8,
          borderRadiusLG: 12,

          // Colors
          colorBgContainer: '#ffffff',
          colorBgLayout: 'hsl(210, 20%, 98%)',
          colorBorder: 'hsl(214, 20%, 90%)',
          colorText: 'hsl(220, 20%, 10%)',
          colorTextSecondary: 'hsl(220, 10%, 46%)',
          colorTextTertiary: 'hsl(220, 10%, 60%)',

          // Success / warning / error
          colorSuccess: 'hsl(142, 71%, 40%)',
          colorWarning: 'hsl(38, 92%, 50%)',
          colorError: 'hsl(0, 72%, 51%)',

          // Shadows
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          boxShadowSecondary: '0 4px 12px rgba(0,0,0,0.08)',

          // Control heights
          controlHeight: 36,
          controlHeightSM: 28,
        },
        components: {
          Layout: {
            siderBg: 'hsl(220, 20%, 10%)',
            headerBg: '#ffffff',
            bodyBg: 'hsl(210, 20%, 98%)',
          },
          Menu: {
            darkItemBg: 'transparent',
            darkItemSelectedBg: 'hsl(220, 18%, 16%)',
            darkItemHoverBg: 'hsl(220, 18%, 16%)',
            darkItemColor: 'hsl(210, 14%, 83%)',
            darkItemSelectedColor: 'hsl(199, 89%, 48%)',
            darkItemHoverColor: 'hsl(210, 14%, 93%)',
            itemBorderRadius: 8,
          },
          Table: {
            headerBg: '#ffffff',
            headerColor: 'hsl(220, 10%, 46%)',
            rowHoverBg: 'hsl(210, 18%, 97%)',
            borderColor: 'hsl(214, 20%, 90%)',
          },
          Card: {
            borderRadiusLG: 12,
          },
          Button: {
            borderRadius: 8,
            fontWeight: 500,
          },
          Input: {
            borderRadius: 8,
          },
          Select: {
            borderRadius: 8,
          },
          Modal: {
            borderRadiusLG: 12,
          },
          Drawer: {
            borderRadiusLG: 12,
          },
          Tag: {
            borderRadiusSM: 6,
          },
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}
