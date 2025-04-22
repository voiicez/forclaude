// src/Pages/Authentication/ListUsers.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import { Table, Button, Spinner, Alert, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/list-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Kullanıcıları çekerken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

  const deleteUser = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await axiosInstance.delete(`/admin/delete-user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessage({ type: 'success', text: 'Kullanıcı başarıyla silindi.' });
        setUsers(users.filter((user) => user.Id !== id));
      } catch (err) {
        setMessage({ type: 'error', text: 'Kullanıcı silinirken bir hata oluştu.' });
      }
    }
  };

  const viewUserChats = (userId) => {
    navigate(`/admin/chat-interactions?userId=${userId}`);
  };

  // Sayfalamayla ilgili hesaplamalar
  const filteredUsers = users.filter((user) =>
    user.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="list-users-container page-content" style={{ padding: '100px 20px 50px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '90%', maxWidth: '2000px' }}>
        <h2>Kullanıcıları Listele</h2>
        {message && <Alert color={message.type === 'success' ? 'success' : 'danger'}>{message.text}</Alert>}
        <Input
          type="text"
          placeholder="Kullanıcı adı ara..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginBottom: '20px', maxWidth: '400px' }}
        />
        {loading ? (
          <div className="loading-spinner">
            <Spinner color="primary" />
          </div>
        ) : (
          <>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>ID</th>
                  <th>Kullanıcı Adı</th>
                  <th style={{ width: '180px' }}>Rol</th>
                  <th style={{ width: '180px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.Id}>
                      <td>{user.Id}</td>
                      <td>{user.Username}</td>
                      <td>{user.Role}</td>
                      <td>
                        <Button color="info" size="sm" onClick={() => viewUserChats(user.Id)}>
                          Sohbetler
                        </Button>
                        <Button color="danger" size="sm" onClick={() => deleteUser(user.Id)} style={{ marginLeft: '5px' }}>
                          Sil
                        </Button>
                       
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Hiç kullanıcı bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Pagination aria-label="Kullanıcı sayfaları">
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem active={index + 1 === currentPage} key={index}>
                  <PaginationLink onClick={() => handlePageChange(index + 1)}>{index + 1}</PaginationLink>
                </PaginationItem>
              ))}
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
};

export default ListUsers;
