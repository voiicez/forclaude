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

function HowTo() {
  return (
    <div class="page-content">
    <div class="card m-b-30">
      <div class="card-body">
        <div class="p-lg-3">
          <h3 id="giris-yapma" class="mt-0 mb-2 font-weight-bold">1. Giriş Yapma</h3>
          <p>Uygulamaya erişim sağlamak için bir kullanıcı hesabına ihtiyacınız vardır. Kullanıcı adı ve şifrenizi girerek giriş yapabilirsiniz.</p>
        </div>

        <div class="p-lg-3">
          <h3 id="chat-kullanma" class="mt-0 mb-2 font-weight-bold">2. Chat Asistanı Kullanma</h3>
          <p>Chat ekranı, uygulamanın ana bölümüdür. Burada yapay zeka destekli asistan ile iletişim kurabilirsiniz. Sorgunuzu yazıp gönder butonuna basarak yanıt alabilirsiniz.</p>
        </div>

        <div class="p-lg-3">
          <h3 id="eski-sohbetler" class="mt-0 mb-2 font-weight-bold">3. Eski Sohbetlere Erişim</h3>
          <p>Sol taraftaki menüde, daha önce yaptığınız sohbetlerin listesi bulunur. Listeden seçim yaparak eski sohbetlere devam edebilirsiniz.</p>
        </div>

        <div class="p-lg-3">
          <h3 id="admin-paneli" class="mt-0 mb-2 font-weight-bold">4. Admin Paneli</h3>
          <p>Admin yetkisine sahip kullanıcılar, admin panelinden kullanıcı yönetimi ve chat kayıtlarını görüntüleme işlemleri yapabilir.</p>
        </div>

        <div class="p-lg-3">
          <h3 id="profil" class="mt-0 mb-2 font-weight-bold">5. Profil Sayfası</h3>
          <p>Profil sayfasında kullanıcı avatarı, adı, rolü ve departman bilgileri görüntülenir.</p>
        </div>
      </div>
    </div>
  </div>

  );
}

export default HowTo;
