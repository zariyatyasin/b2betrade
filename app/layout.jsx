import { Provider } from "react-redux";
import "./globals.css";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReduxProvider } from "../store/provider";
import AuthProvider from "../components/provider/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "../components/provider/QueryProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "B2BeTrade",
  description: "A B2B Wholesale E-commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          name="google-site-verification"
          content="f7itwVimUVUgsmoN2Hb8fn79r85GGP5afxv6rv7z7yY"
        />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ReduxProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <SpeedInsights />
            <AuthProvider>
              {children} <Analytics />
            </AuthProvider>
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
