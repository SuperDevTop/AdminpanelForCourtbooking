import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { backendUrl } from "src/config/url";
import axios from "axios";

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
  users: [],
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const { user, users } = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
            users,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const { user, users } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      users,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      users: [],
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
      const user = {
        id: "5e86809283e28b96d2d38537",
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: "Nikolay Sapov",
        email: "anika.visser@devias.io",
      };
      const users = [];

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: { user, users },
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

    const users = [];
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: { user, users },
    });
  };

  const signIn = async (email, password) => {
    // if (email !== 'demo@devias.io' || password !== 'Password123!') {
    //   throw new Error('Please check your email and password');
    // }
    const userData = {
      email: email,
      password: password,
    };

    axios
      .post(backendUrl + "/api/auth/login", userData)
      .then((res) => {
        const { token } = res.data;
        try {
          window.sessionStorage.setItem("authenticated", "true");
          window.sessionStorage.setItem("token", token);

          const { user, users } = res.data;

          dispatch({
            type: HANDLERS.SIGN_IN,
            payload: { user, users },
          });
        } catch (err) {
          console.error(err);
        }
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

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
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
    axios
      .post(backendUrl + "/api/auth/updateUser", data)
      .then((res) => {
        const { user } = res.data;
        dispatch({
          type: HANDLERS.UPDATE_USER,
          payload: { user },
        });
      })
      .catch((err) => {
        if (err.response === undefined) {
          throw new Error(error.message);
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
        signUp,
        signOut,
        updatePassword,
        updateUser,
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
