import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../helpers/axiosConfig"; // Yeni axios config import
import { Row, Col, Input, Button, Container, Card, CardBody } from "reactstrap";
import './Chat.css';

const Chat = () => {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const username = localStorage.getItem("username") || "User";
  const messagesEndRef = useRef(null);

  // Önceki thread'leri yükleme
  useEffect(() => {
    const getThreads = async () => {
      try {
        const response = await axiosInstance.get(`/chat/get-user-threads/${username}`);
        console.log("Threads Response:", response);
        setPreviousChats(response.data);
      } catch (error) {
        console.error("Error fetching records:", error.response ? error.response.data : error.message);
      }
    };

    getThreads();
  }, [username]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  // Sorgu gönderme fonksiyonu
  const handleSendQuery = async () => {
    if (!query.trim()) return; // Boş sorguları engelle
    const userId = localStorage.getItem("userId"); // userId'yi localStorage'dan al

    try {
        setIsLoading(true); // 🟢 Loading başlasın

        // Kullanıcının mesajını ekle
        setResponses((prevResponses) => [
            ...prevResponses,
            { text: query, isUser: true, username },
            { text: "Düşünüyor...", isUser: false, username: "LimoAI" } // AI cevabı yerine geçici mesaj
        ]);

        const requestBody = { userId, query };

        if (threadId) {
            requestBody.threadId = threadId;
        }

        const response = await fetch("https://limonianai.online/api/chat/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            aiResponse += chunk;

            // "Düşünüyor..." mesajını gerçek yanıtla değiştir
            setResponses((prevResponses) => {
                const updatedResponses = [...prevResponses];
                updatedResponses[updatedResponses.length - 1] = {
                    text: aiResponse,
                    isUser: false,
                    username: "LimoAI",
                };
                return updatedResponses;
            });
        }

        const newThreadId = response.headers.get("thread-id");
        if (newThreadId) {
            setThreadId(newThreadId);
        }

        setQuery(""); // Sorgu alanını temizle
    } catch (err) {
        console.error("Sorgu gönderilemedi:", err);
        setResponses((prevResponses) => [
            ...prevResponses,
            { text: "Yanıt alınamadı, lütfen tekrar deneyin.", isUser: false, username: "LimoAI" },
        ]);
    } finally {
        setIsLoading(false); // 🔴 Loading bitti
    }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) { // Shift+Enter yerine sadece Enter çalışsın
      e.preventDefault(); // Enter'ın yeni satır eklemesini engelle
      handleSendQuery(); // Mesajı gönder
  }
};
  // Thread seçildiğinde mesajları yükleme
  const handleChatClick = (chatThreadId) => {
    const selectedThread = previousChats.find((chat) => chat.Id === chatThreadId);
    const openAIThreadId = selectedThread?.ThreadId;

    if (!openAIThreadId) {
      console.error('OpenAI Thread ID bulunamadı.');
      return;
    }

    console.log('Seçilen OpenAI Thread ID:', openAIThreadId);
    setThreadId(openAIThreadId);

    const getThreadMessages = async () => {
      try {
        const response = await axiosInstance.get(`/chat/get-thread-messages/${openAIThreadId}`);
        const fetchedMessages = response.data.flatMap((msg) => [
          { text: msg.Query, isUser: true, username },
          { text: msg.Response, isUser: false, username: "AI Assistant" },
        ]);

        setResponses(fetchedMessages);
      } catch (error) {
        console.error('Thread mesajları alınamadı:', error);
      }
    };

    getThreadMessages();
  };

  return (
    <div className="page-content chat-page">
      <Container fluid className="h-100">
      <Row className="h-100">
  <Col md={2} className="bg-light border-end chat-sidebar h-100"> {/* md={3} => md={2} */}
    <Card className="h-100">
      <CardBody>
        <h5 className="mt-3">Önceki Konuşmalar</h5>
        <ul className="list-unstyled chat-thread-list">
          {Array.isArray(previousChats) &&
            previousChats.map((chat) => (
              <li key={chat.Id} className="mb-2">
                <Button
                  color="light"
                  className="w-100 text-start chat-thread-button"
                  onClick={() => handleChatClick(chat.Id)}
                >
                  {chat.Title} - {new Date(chat.CreatedAt).toLocaleString()}
                </Button>
              </li>
            ))}
        </ul>
      </CardBody>
    </Card>
  </Col>

  <Col md={10} className="d-flex flex-column chat-area h-100"> {/* md={9} => md={10} */}
    <div className="flex-grow-1 overflow-auto chat-messages">
      {responses.map((response, index) => (
        <div
          key={index}
          className={`d-flex ${response.isUser ? "justify-content-end" : "justify-content-start"} mb-2`}
        >
          <div
            className={`p-2 rounded ${response.isUser ? "bg-success text-white" : "bg-light"}`}
            style={{ maxWidth: "70%" }}
          >
            <strong>{response.username}:</strong>
            <p className="mb-0">{response.text}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    <div className="d-flex align-items-center mt-3 chat-input-area">
      <Input
        type="text"
        placeholder="Sorgunuzu buraya yazın..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)} 
        className="me-2"
      />
      <Button color="primary" onClick={handleSendQuery} disabled={isLoading}>
    {isLoading ? "Gönderiliyor..." : "Gönder"}
</Button>
    </div>
  </Col>
</Row>

      </Container>
    </div>
  );
};

export default Chat;
