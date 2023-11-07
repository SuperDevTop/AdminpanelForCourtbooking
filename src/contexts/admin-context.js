import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { backendUrl } from "src/config/url";
import axios from "axios";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  ADD_USER: "ADD_USER",
  GET_COURTS: "GET_COURTS",
  UPDATE_COURT: "UPDATE_COURT",
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

  const updateCourt = async (data) => {
    axios
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

  return (
    <AdminContext.Provider
      value={{
        ...state,
        addUser,
        updateCourt,
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
