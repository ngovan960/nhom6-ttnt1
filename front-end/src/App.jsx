import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import MainLayout from "./layout/MainLayout";
import TrangChu from "./pages/TrangChu";
import SanPham from "./pages/SanPham";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<TrangChu />} />
          <Route path="/products" element={<SanPham />} />

          {/* Trang không có header / footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/logup" element={<SignUp />} />
        </Routes>
      </MainLayout>
    </>
  );
}

export default App;
