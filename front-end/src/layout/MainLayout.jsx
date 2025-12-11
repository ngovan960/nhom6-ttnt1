import React from "react";
import Header from "../components/header";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header></Header>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
