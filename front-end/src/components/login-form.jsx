import { useState } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Email FE gửi:", email);
    console.log("Password FE gửi:", password);

    if (!email || !password) {
      alert("Vui lòng nhập email và password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email: email,
        password: password,
      });

      console.log("Login response:", res.data);

      localStorage.setItem("token", res.data.accessToken);
      alert("Đăng nhập thành công!");
    } catch (error) {
      console.log("Error FE:", error.response);
      alert(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <Card className="w-[380px] mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-center">Đăng nhập</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
