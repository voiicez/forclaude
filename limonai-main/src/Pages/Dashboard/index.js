// src/Pages/Admin/Dashboard/index.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import { Card, CardBody, Row, Col, Container, Spinner, Progress } from 'reactstrap';
import Chart from 'react-apexcharts';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, interactions: 0, files: 0 });
  const [topUsers, setTopUsers] = useState([]);
  const [departmentData, setDepartmentData] = useState({ labels: [], series: [] });
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
    fetchDepartmentStats();
    fetchSummary();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(response.data);

      const topUsersResponse = await axiosInstance.get('/admin/top-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTopUsers(topUsersResponse.data);

      const fileCountResponse = await axiosInstance.get('/admin/file-count', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats((prevStats) => ({ ...prevStats, files: fileCountResponse.data.count }));
    } catch (err) {
      console.error('Dashboard verileri alınırken hata oluştu:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/department-chat-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const labels = response.data.map((item) => item.Department || 'Bilinmeyen');
      const series = response.data.map((item) => item.ChatCount);
      setDepartmentData({ labels, series });
    } catch (err) {
      console.error('Departman bazında chat kullanım istatistikleri alınırken hata oluştu:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('https://limonianai.online/api/admin/summary', {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      if (!response.body) {
        throw new Error('Yanıt akışı başlatılamadı.');
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      let receivedLength = 0;
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedLength += value.length;
        setProgress(Math.min((receivedLength / 10000) * 100, 100)); // Örnek olarak 10KB üzerinden yüzde hesaplama
  
        let chunk = decoder.decode(value, { stream: true });
        chunk = chunk.replace(/【\d+:\d+†source】/g, ''); // Kaynak referanslarını temizle
chunk = chunk.replace(/^{"summary":"|"}$/g, ''); // "summary": anahtarını temizle
chunk = chunk.replace(/\\n/g, '<br>'); // \n karakterlerini alt satıra geçirecek şekilde değiştir

        
        result += chunk;
        setSummary((prev) => prev + chunk);
      }
  
      console.log('Tamamlanan özet:', result.summary);
      setProgress(100);
    } catch (err) {
      console.error('Özet alınırken hata oluştu:', err);
      setProgress(0);
    }
  };
  
  

  const renderStatCard = (iconClass, title, value) => (
    <Card className="stat-card h-100">
      <CardBody className="d-flex align-items-center">
        <div className="stat-icon-large" style={{ fontSize: '50px', color: '#cc7952' }}>
          <i className={iconClass}></i>
        </div>
        <div className="stat-info" style={{ marginLeft: '20px' }}>
          <h5 className="stat-title" style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h5>
          <h3 className="stat-value" style={{ fontSize: '32px', fontWeight: 'bold',color: '#cc7952' }}>{value}</h3>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Admin" breadcrumbItem="Dashboard" />
          {loading ? (
            <div className="loading-spinner">
              <Spinner color="primary" />
            </div>
          ) : (
            <>
              <Row>
                <Col md="3">{renderStatCard('mdi mdi-account-group', 'Toplam Kullanıcı Sayısı', stats.users)}</Col>
                <Col md="3">{renderStatCard('mdi mdi-message-text', 'Toplam Sohbet Sayısı', stats.interactions)}</Col>
                <Col md="3">{renderStatCard('mdi mdi-folder', 'Toplam Dosya Sayısı', stats.files)}</Col>
                <Col md="3">
                  <Card className="stat-card h-100">
                    <CardBody className="d-flex align-items-center">
                      <div className="stat-icon-large" style={{ fontSize: '50px', color: '#cc7952' }}>
                        <i className="mdi mdi-crown-outline"></i>
                      </div>
                      <div className="stat-info" style={{ marginLeft: '20px' }}>
                        <h5 className="stat-title" style={{ fontSize: '18px', fontWeight: '600' }}>En Aktif Kullanıcılar</h5>
                        <ul className="active-users-list">
                          {topUsers.map((user, index) => (
                            <li key={user.UserId}>
                              {index + 1}. {user.Username} - {user.MessageCount} mesaj
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row style={{ marginTop: '20px' }}>
                <Col md="6">
                  <Card className="chat-card">
                    <CardBody>
                      <h5 className="chat-title">Dosya Özetleri</h5>
                   
                      <div className="chat-content" dangerouslySetInnerHTML={{ __html: summary.replace(/\\n/g, '<br>') }}>
                       
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="6">
                  <Card className="chart-card">
                    <CardBody>
                      <h5 className="chart-title">Departmanlara Göre Chat Kullanım Oranı</h5>
                      <Chart
                        options={{
                          labels: departmentData.labels,
                          legend: { position: 'bottom' },
                          colors: ['#ffd782', '#e79476', '#f1ba85','#943d2c','#f1ba85','#f1ba85']
                        }}
                        series={departmentData.series}
                        type="pie"
                        width="100%"
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
