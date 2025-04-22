import axios from "axios";
import config from "../config";

// default
axios.defaults.baseURL = config.API_URL;

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    let message;
    switch (error.response?.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Data not found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

/**
 * Retrieves the logged-in user from localStorage
 */
const getLoggedinUser = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token || !username) {
    return null;
  }

  return {
    token,
    username,
    isAdmin,
  };
};

class APIClient {
  get = (url, params) => {
    return axios.get(url, params);
  };

  create = (url, data) => {
    return axios.post(url, data);
  };

  update = (url, data) => {
    return axios.put(url, data);
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

export { APIClient, setAuthorization, getLoggedinUser };
