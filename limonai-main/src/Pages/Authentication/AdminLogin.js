import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  Label,
} from "reactstrap";


function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "https://limonianai.online/api/account/login",
        {
          username,
          password,
        }
      );
  
      console.log("Login response:", response);
  
      if (response && response.token) {
        const token = response.token;
        localStorage.setItem("token", token);
  
        try {
          // Admin kontrolü
          const isAdminResponse = await axios.get(
            "https://limonianai.online/api/admin/is-admin",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          console.log("Admin check response:", isAdminResponse);
  
          if (isAdminResponse && isAdminResponse.isAdmin) {
            // Admin bilgisi kaydediliyor
            localStorage.setItem("isAdmin", JSON.stringify(true));
            navigate("/dashboard");
          } else {
            setError("Yalnızca admin kullanıcıları bu sayfaya erişebilir.");
            localStorage.removeItem("token");
          }
        } catch (adminErr) {
          console.error("Admin kontrolü sırasında hata:", adminErr);
          setError("Admin kontrolü başarısız. Lütfen tekrar deneyin.");
          localStorage.removeItem("token");
        }
      } else {
        setError("Giriş Başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      console.error("Giriş hatası:", err);
      setError("Giriş Başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };
  
  return (
    <React.Fragment>
      <div className="bg-overlay"></div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
              <Card>
                <CardBody className="p-4">
                  <div>
                    <div className="text-center">
                     
                    </div>
                    <h4 className="font-size-18 text-muted mt-2 text-center">
                      Admin Girişi
                    </h4>
                    <p className="mb-5 text-center">
                      LimonianAI Yönetim Paneli için giriş yapınız.
                    </p>
                    {error && <Alert color="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                      <Row>
                        <Col md={12}>
                          <div className="mb-4">
                            <Label className="form-label">Kullanıcı Adı</Label>
                            <Input
                              name="username"
                              className="form-control"
                              placeholder="Enter username"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <Label className="form-label">Şifre</Label>
                            <Input
                              name="password"
                              className="form-control"
                              placeholder="Enter Password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="d-grid mt-4">
                            <button
                              className="btn btn-primary waves-effect waves-light"
                              type="submit"
                            >
                              Giriş Yap
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p className="text-white-50">
                  © {new Date().getFullYear()} Limonian. Crafted with
                  <i className="mdi mdi-heart text-danger"></i> by Behlul.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default AdminLogin;
