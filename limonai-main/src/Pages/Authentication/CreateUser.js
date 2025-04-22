import React, { useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from 'reactstrap';

const CreateUser = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'User', department: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await axiosInstance.post('/admin/create-user', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage({ type: 'success', text: response.data.message });
      setFormData({ username: '', password: '', role: 'User', department: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-container page-content" style={{ padding: '100px 20px' }}>
      <h2>Kullanıcı Oluştur</h2>
      {message && <Alert color={message.type === 'success' ? 'success' : 'danger'}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Kullanıcı Adı</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Kullanıcı adını girin"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Şifre</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Şifre girin"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="role">Rol</Label>
          <Input
            type="select"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="department">Departman</Label>
          <Input
            type="select"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Departman seçin</option>
            <option value="İk">İk</option>
            <option value="Yazılım">Yazılım</option>
            <option value="Grafik">Grafik</option>
            <option value="Sosyal Medya">Sosyal Medya</option>
            <option value="CRM">CRM</option>
          </Input>
        </FormGroup>
        <Button color="primary" type="submit" disabled={loading} block>
          {loading ? <Spinner size="sm" /> : 'Oluştur'}
        </Button>
      </Form>
    </div>
  );
};

export default CreateUser;
