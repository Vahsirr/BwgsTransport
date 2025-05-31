import AppUtils from "../../../utils/AppUtils";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtServiceConfig from "./jwtServiceConfig";

class JwtService extends AppUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response &&
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }
          reject(err);
        });
      }
    );
  };

  handleAuthentication = async () => {
    const access_token = await this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");
      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  // createUser = async (data) => {
  //   try {
  //     const body = {
  //       email: data.email,
  //       mobile: data.mobilenumber,
  //       name: data.name,
  //       password_hash: data.password,
  //       role: "user",
  //     };
  //     const response = await axios.post(`${jwtServiceConfig.signUp}?organization_id=${data.organization_id}&stop_id=${data.stop_id}`, body);
  //     return response;
  //   } catch (error) {
  //     return error;
  //   }
  // };
  createUser = async (data) => {
    try {
      const body = {
        email: data.email,
        mobile: data.mobilenumber,
        name: data.name,
        password_hash: data.password,
        role: "user",
      };
      const response = await axios.post(`${jwtServiceConfig.signUp}?organization_id=${data.organization_id}&stop_id=${data.stop_id}`, body);
      return response;
    } catch (error) {
      // Check if the error is a response error with status code and data
      if (error.response) {
        // If it's a "recently deleted account" error, return it properly structured
        if (error.response.status === 400 && error.response.data.message.includes("recently deleted")) {
          return {
            status: error.response.status,
            data: error.response.data
          };
        }
      }
      // For other errors, return the error object
      return error;
    }
  };
  // signInWithEmailAndPassword = (email, password) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .post(jwtServiceConfig.signIn, { email, password })
  //       .then((response) => {
  //         console.log("response",response)
  //         if (response.data.data) {
  //           if (
  //             response.data.data.user.role === "software_admin" ||
  //             response.data.data.user.role === "admin"
  //           ) {
  //             this.emit(
  //               "onAutoLogout",
  //               "Only User role is allowed for this portal!",
  //               "error"
  //             );
  //             this.setSession(null);
  //           } else {
  //             this.setSession(response.data.data.token);
  //             resolve(response.data.data.user);
  //             this.emit("onLogin", response.data.data.user);
  //           }
  //         } else {
  //           reject(response.data.error);
  //         }
  //       })
  //       .catch((error) => {
  //         if (error.response && error.response.status === 401) {
  //           reject(new Error("Invalid credentials!"));
  //         } else {
  //           reject(new Error("Login failed. Please try again later."));
  //         }
  //       });
  //   });
  // };
  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.signIn, { email, password })
        .then((response) => {
          if (response.data.data) {
            if (
              response.data.data.user.role === "software_admin" ||
              response.data.data.user.role === "admin"
            ) {
              this.emit(
                "onAutoLogout",
                "Only User role is allowed for this portal!",
                "error"
              );
              this.setSession(null);
            } else {
              this.setSession(response.data.data.token);
              resolve(response.data.data.user);
              this.emit("onLogin", response.data.data.user);
            }
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.accessToken)
        .then((response) => {
          if (response.data.data) {
            this.setSession(response.data.data.token);
            resolve(response.data.data.user);
          } else {
            this.logout();
            reject(new Error("Failed to login with token."));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error("Failed to login with token."));
        });
    });
  };

  sendOtp = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(jwtServiceConfig.sendOtp, data).then((response) => {
        if (response.status === 200) {
          resolve(response.data.data);
        } else {
          reject(response.data);
        }
      }).catch((error) => {
        reject(error.message)
      })
    })
  }

  verifyOtp = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(jwtServiceConfig.verifyOtp, data).then((response) => {
        if (response.status === 200) {
          resolve(response.data.data);
        }
      }).catch((error) => {
        resolve({ status: "failed" });
      })
    })
  }
  deleteAccount = (password) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(jwtServiceConfig.deleteAccount, {
          data: { password }
        })
        .then((response) => {
          if (response.status === 200) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  updateUserData = async (user) => {
    return await axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = async (access_token) => {
    if (access_token) {
      await AsyncStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      await AsyncStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit("onLogout", "Logged out");
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return false;
    }
    return true;
  };

  getAccessToken = async () => {
    return await AsyncStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;
