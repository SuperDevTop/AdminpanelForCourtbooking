import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { backendUrl } from "src/config/url";
import axios from "axios";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  ADD_USER: "ADD_USER",
  GET_COURTS: "GET_COURTS",
  UPDATE_COURT: "UPDATE_COURT",
  ADD_COURT: "ADD_COURT",
  DELETE_USER: "DELETE_USER",
  UPDATE_USER: "UPDATE_USER",
};

const initialState = {
  isAddingUser: false,
  users: [],
  courts: [],
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const { users } = action.payload;
    return {
      ...state,
      users: users,
    };
  },
  [HANDLERS.ADD_USER]: (state, action) => {
    const { users } = action.payload;
    return {
      ...state,
      users: users,
    };
  },
  [HANDLERS.DELETE_USER]: (state, action) => {
    const { users } = action.payload;
    return {
      ...state,
      users: users,
    };
  },
  [HANDLERS.UPDATE_USER]: (state, action) => {
    const { user } = action.payload;

    const updatedUserIndex = state.users.findIndex((one) => one.email === user.email);

    if (updatedUserIndex !== -1) {
      const updatedUsers = [...state.users];
      updatedUsers[updatedUserIndex] = user;

      return {
        ...state,
        users: updatedUsers,
      };
    } else {
      return {
        ...state
      }
    }
  },
  [HANDLERS.GET_COURTS]: (state, action) => {
    const { courts } = action.payload;
    return {
      ...state,
      courts: courts,
    };
  },
  [HANDLERS.UPDATE_COURT]: (state, action) => {
    const { courts } = action.payload;
    return {
      ...state,
      courts: courts,
    };
  },
  [HANDLERS.ADD_COURT]: (state, action) => {
    const { courts } = action.payload;
    return {
      ...state,
      courts: courts,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AdminContext = createContext({ undefined });

export const AdminProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    axios
      .get(backendUrl + "/api/admin/getUsers")
      .then((res) => {
        const { users } = res.data;

        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: { users },
        });
      })
      .catch((err) => {
        if (err.response === undefined) {
          console.log(err);
          throw new Error(err.message);
        } else {
          console.log(err);
          throw new Error(err.response.data.message);
        }
      });

    axios
      .get(backendUrl + "/api/court/getCourts")
      .then((res) => {
        const { courts } = res.data;

        dispatch({
          type: HANDLERS.GET_COURTS,
          payload: { courts },
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

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const addUser = async (data) => {
    axios
      .post(backendUrl + "/api/admin/addUser", data)
      .then((res) => {
        const { users } = res.data;

        dispatch({
          type: HANDLERS.ADD_USER,
          payload: { users },
        });
      })
      .catch((err) => {
        if (err.response === undefined) {
          // network error
          throw new Error(err.message);
        } else {
          throw new Error(err.response.data.message);
        }
      });
  };

  const deleteUser = async (data) => {
    return axios
      .post(backendUrl + "/api/admin/deleteUser", data)
      .then((res) => {
        const { users } = res.data;

        dispatch({
          type: HANDLERS.DELETE_USER,
          payload: { users },
        });
      })
      .catch((err) => {
        if (err.response === undefined) {
          // network error
          throw new Error(err.message);
        } else {
          throw new Error(err.response.data.message);
        }
      });
  };

  const addCourt = async (data) => {
    return axios
      .post(backendUrl + "/api/admin/addCourt", data)
      .then((res) => {
        const { courts } = res.data;

        dispatch({
          type: HANDLERS.ADD_COURT,
          payload: { courts },
        });
      })
      .catch((err) => {
        if (err.response === undefined) {
          // network error
          throw new Error(err.message);
        } else {
          throw new Error(err.response.data.message);
        }
      });
  };

  const updateCourt = (data) => {
    return axios
      .post(backendUrl + "/api/admin/updateCourt", data)
      .then((res) => {
        const { courts } = res.data;

        dispatch({
          type: HANDLERS.UPDATE_COURT,
          payload: { courts },
        });
      })
      .catch((err) => {
        if (err.response === undefined) {
          // network error
          throw new Error(err.message);
        } else {
          throw new Error(err.response.data.message);
        }
      });
  };

  const updateUser = (data) => {
    return axios
      .post(backendUrl + "/api/admin/updateUser", data)
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
    <AdminContext.Provider
      value={{
        ...state,
        addUser,
        updateCourt,
        addCourt,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

AdminProvider.propTypes = {
  children: PropTypes.node,
};

export const AdminConsumer = AdminContext.Consumer;

export const useAdminContext = () => useContext(AdminContext);
