import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import sidebarData from "./SidebarData"; // Tüm menü verileri burada
import SimpleBar from "simplebar-react"; // Simple bar
import MetisMenu from "metismenujs"; // MetisMenu
import withRouter from "../../components/Common/withRouter";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

const Sidebar = (props) => {
  const ref = useRef();

  // Kullanıcının admin olup olmadığını kontrol ediyoruz
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const allowedLabels = ["Sohbet Et", "Nasıl Kullanılır?", "Yardım","Menu"]; // İzin verilen menüler

  const filteredSidebarData = sidebarData.filter((item) => {
    if (isAdmin) return true; // Adminse tüm menüler göster
  
    return allowedLabels.includes(item.label); // Normal kullanıcıya sadece izin verilen menüleri göster
  });
  

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }
    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;
      if (parent2) {
        parent2.classList.add("mm-show");
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add("mm-active");
          parent3.childNodes[0].classList.add("mm-active");
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-show");
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show");
              parent5.childNodes[0].classList.add("mm-active");
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      const parent = items[i].parentElement;
      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }
        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.remove("mm-show");
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active");
            parent3.childNodes[0].classList.remove("mm-active");
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.remove("mm-show");
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show");
                parent5.childNodes[0].classList.remove("mm-active");
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = props.router.location.pathname;
    const fullPath = pathName;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu-item");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);
    for (let i = 0; i < items.length; ++i) {
      if (fullPath === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [props.router.location.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu-item");
    activeMenu();
  }, []);

  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <div className="vertical-menu">
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu-item">
            {(filteredSidebarData || []).map((item, key) => (
              <React.Fragment key={key}>
                {item.isMainMenu ? (
                  <li className="menu-title">{props.t(item.label)}</li>
                ) : (
                  <li>
                    <Link to={item.url || "/#"}>
                      <i className={item.icon}></i>
                      <span>{props.t(item.label)}</span>
                    </Link>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </SimpleBar>
    </div>
  );
};

Sidebar.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(Sidebar));
