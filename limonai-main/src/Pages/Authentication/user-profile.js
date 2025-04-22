// UserProfile.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody
} from 'reactstrap';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    useEffect(() => {
        // Fetch user profile data from backend
        axiosInstance.get(`/account/profile/${username}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                setUserData(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
      <Container fluid className="user-profile-page" style={{ padding: '20px', marginTop: '80px' }}>
          <Row>
              <Col lg="12">
                  <Card>
                      <CardBody>
                          <div className="d-flex" style={{ alignItems: 'center' }}>
                              <div style={{ marginRight: '20px' }}>
                                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                      <span style={{ fontSize: '24px', color: '#555' }}>{userData.Username[0].toUpperCase()}</span>
                                  </div>
                              </div>
                              <div>
                                  <h4 style={{ margin: 0 }}>{userData.Username}</h4>
                                  <p style={{ margin: '5px 0' }}><strong>Role:</strong> {userData.Role}</p>
                                  <p style={{ margin: 0 }}><strong>Department:</strong> {userData.Department}</p>
                              </div>
                          </div>
                      </CardBody>
                  </Card>
              </Col>
          </Row>
      </Container>
  );
};


export default UserProfile;
