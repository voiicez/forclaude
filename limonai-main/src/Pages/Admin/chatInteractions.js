// src/Pages/Admin/ChatInteractions.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helpers/axiosConfig';
import { Table, Spinner, Alert, Input, Pagination, PaginationItem, PaginationLink, Button } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

const ChatInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const interactionsPerPage = 10;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      const endpoint = userId ? `/admin/chat-interactions?userId=${userId}` : '/admin/chat-interactions';
      const response = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInteractions(response.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Sohbet geçmişi alınırken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

  const downloadExcel = () => {
    const dataToExport = interactions.map((interaction) => ({
      'Kullanıcı Adı': interaction.Username,
      'Sohbet Başlığı': interaction.Title,
      'Mesaj': interaction.Message,
      'Yanıt': interaction.Response,
      'Tarih': new Date(interaction.Timestamp).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sohbetler');

    XLSX.writeFile(workbook, userId ? `Kullanici_${userId}_Sohbetler.xlsx` : 'Tum_Sohbetler.xlsx');
  };

  // Sayfalamayla ilgili hesaplamalar
  const filteredInteractions = interactions.filter((interaction) =>
    interaction.Username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interaction.Message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastInteraction = currentPage * interactionsPerPage;
  const indexOfFirstInteraction = indexOfLastInteraction - interactionsPerPage;
  const currentInteractions = filteredInteractions.slice(indexOfFirstInteraction, indexOfLastInteraction);
  const totalPages = Math.ceil(filteredInteractions.length / interactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="chat-interactions-container page-content" style={{ padding: '100px 20px 50px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '90%', maxWidth: '2000px' }}>
        <h2>{userId ? 'Kullanıcı Sohbetleri' : 'Tüm Sohbetler'}</h2>
        {message && <Alert color={message.type === 'success' ? 'success' : 'danger'}>{message.text}</Alert>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Input
            type="text"
            placeholder="Kullanıcı adı veya mesaj ara..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ maxWidth: '400px' }}
          />
          <Button color="success" onClick={downloadExcel}>
            Excel Olarak İndir
          </Button>
        </div>
        {loading ? (
          <div className="loading-spinner">
            <Spinner color="primary" />
          </div>
        ) : (
          <>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Kullanıcı Adı</th>
                  <th>Sohbet Başlığı</th>
                  <th>Mesaj</th>
                  <th style={{ width: '300px' }}>Yanıt</th>
                  <th style={{ width: '180px' }}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {currentInteractions.length > 0 ? (
                  currentInteractions.map((interaction) => (
                    <tr key={interaction.Id}>
                      <td>{interaction.Username}</td>
                      <td>{interaction.Title}</td>
                      <td>{interaction.Message}</td>
                      <td>
                        <div style={{ maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}>
                          {interaction.Response}
                        </div>
                      </td>
                      <td>{new Date(interaction.Timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Hiç sohbet bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Pagination aria-label="Sohbet sayfaları">
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

export default ChatInteractions;
