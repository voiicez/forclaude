import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";
import axiosInstance from "../../helpers/axiosConfig";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axiosInstance.post('/account/login', { username, password });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('isAdmin', response.data.isAdmin);
      localStorage.setItem('userId',response.data.userid);

      if (response.data.isAdmin) {
        navigate('/dashboard'); // Admin kullanıcıyı dashboard'a yönlendir
      } else {
        navigate('/chat'); // Normal kullanıcıyı chat ekranına yönlendir
      }
    }
  } catch (err) {
    setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
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
                      Hoşgeldiniz!
                    </h4>
                    <p className="mb-5 text-center">
                      LimonianAI için giriş yapınız.
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
                  <i className="mdi mdi-heart text-danger"></i> by Behlul 0.0.2
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default Login;
