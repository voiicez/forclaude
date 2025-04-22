import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Token ve diğer verileri temizle
    localStorage.clear();

    // Kullanıcıyı giriş sayfasına yönlendir
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;
