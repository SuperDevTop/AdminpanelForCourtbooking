import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { backendUrl } from "src/config/url";
import axios from "axios";
import Error from "next/error";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  UPDATE_USER: "UPDATE_USER",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
  [HANDLERS.UPDATE_USER]: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user: user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = JSON.parse(window.sessionStorage.getItem("user"));

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Nikolay Sapov",
      email: "anika.visser@devias.io",
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: { user, user },
    });
  };

  const signIn = async (email, password) => {
    const userData = {
      email: email,
      password: password,
    };

    await axios
      .post(backendUrl + "/api/auth/login", userData)
      .then((res) => {
        const { token } = res.data;
        try {
          window.sessionStorage.setItem("authenticated", "true");
          window.sessionStorage.setItem("token", token);

          const { user } = res.data;
          window.sessionStorage.setItem("user", JSON.stringify(user));

          dispatch({
            type: HANDLERS.SIGN_IN,
            payload: { user },
          });
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        if (err.response === undefined) {
          throw new Error(err.message);
        } else {
          throw new Error(err.response.data.message);
        }
      });
  };

  const signOut = () => {
    window.sessionStorage.removeItem("authenticated");
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("user");

    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  const updatePassword = (newPassword, email) => {
    const data = {
      newPassword: newPassword,
      email: email,
    };

    axios
      .post(backendUrl + "/api/auth/updatePassword", data)
      .then((res) => {
        console.log(res.data.message);
        dispatch({
          type: HANDLERS.SIGN_OUT,
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response === undefined) {
          throw new Error(err.message);
        } else {
          throw new Error(err.response.data.message);
        }
      });
  };

  const updateUser = (data) => {
    return axios
      .post(backendUrl + "/api/auth/updateUser", data)
      .then((res) => {
        const { user } = res.data;
        window.sessionStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: HANDLERS.UPDATE_USER,
          payload: { user },
        });
      })
      .catch((err) => {
        if (err.response === undefined) {
          throw new Error(err.message);
        } else {
          throw new Error(err.response.data.message);
        }
      });
  };

  const uploadAvatar = (data) => {
    return axios
      .post(backendUrl + "/api/auth/uploadAvatar", data)
      .then((res) => {
        const { user } = res.data;

        dispatch({
          type: HANDLERS.UPDATE_USER,
          payload: { user },
        });
      })
      .catch((err) => {
        if (err.response === undefined) {
          throw new Error(err.message);
        } else {
          throw new Error(err.response.data.message);
        }
      });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signOut,
        updatePassword,
        updateUser,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
