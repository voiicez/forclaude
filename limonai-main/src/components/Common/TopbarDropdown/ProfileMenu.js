import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false);
  const [username, setUsername] = useState("User");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername &&!isAdmin) {
      setUsername(storedUsername);
    }else{
      setUsername("Admin");
    }
  }, []);

  // Rastgele bir renk oluşturucu
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Kullanıcı avatarı için ilk harfi al
  const avatarInitial = username.charAt(0).toUpperCase();
  const avatarColor = generateRandomColor();

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item"
          id="page-header-user-dropdown"
          tag="button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px", // Avatar ile kullanıcı adı arasında boşluk
          }}
        >
          {/* Dinamik Avatar */}
          <div
            className="rounded-circle"
            style={{
              backgroundColor: avatarColor,
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "18px",
              overflow: "hidden",
            }}
          >
            {avatarInitial}
          </div>
          <span className="d-none d-xl-inline-block ms-2 me-2">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/userprofile">
            <i className="ri-user-line align-middle me-2" />
            Hesap
          </DropdownItem>
          <DropdownItem tag="a" href="auth-lock-screen">
            <i className="ri-lock-unlock-line align-middle me-2" />
            Kilit Ekranı
          </DropdownItem>
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="ri-shut-down-line align-middle me-2 text-danger" />
            Çıkış
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileMenu;
