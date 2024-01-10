import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { backendUrl } from "src/config/url";
import axios from "axios";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  ADD_USER: "ADD_USER",
  GET_COURTS: "GET_COURTS",
  GET_PLAYERS: "GET_PLAYERS",
  UPDATE_COURT: "UPDATE_COURT",
  ADD_COURT: "ADD_COURT",
  DELETE_USER: "DELETE_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_PLAYER: "DELETE_PLAYER",
  DELETE_COURT: "DELETE_COURT",
  ADD_PLAYER: "ADD_PLAYER",
  UPDATE_PLAYER: "UPDATE_PLAYER",
};

const initialState = {
  isAddingUser: false,
  users: [],
  courts: [],
  players: [],
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

  [HANDLERS.ADD_PLAYER]: (state, action) => {
    const { player } = action.payload;

    const updatedPlayers = [...state.players]
    updatedPlayers.push(player)

    return {
      ...state,
      players: updatedPlayers,
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
        ...state,
      };
    }
  },

  [HANDLERS.UPDATE_PLAYER]: (state, action) => {
    const { player } = action.payload;

    const updatedPlayerIndex = state.players.findIndex((one) => one.name === player.name);

    if (updatedPlayerIndex !== -1) {
      const updatedPlayers = [...state.players];
      updatedPlayers[updatedPlayerIndex] = player;

      return {
        ...state,
        players: updatedPlayers,
      };
    } else {
      return {
        ...state,
      };
    }
  },

  [HANDLERS.DELETE_PLAYER]: (state, action) => {
    const { name } = action.payload;

    const updatedPlayerIndex = state.players.findIndex((one) => one.name === name);

    if (updatedPlayerIndex !== -1) {
      const updatedPlayers = [...state.players];
      updatedPlayers.splice(updatedPlayerIndex, 1);

      return {
        ...state,
        players: updatedPlayers,
      };
    } else {
      return {
        ...state,
      };
    }
  },

  [HANDLERS.DELETE_COURT]: (state, action) => {
    const { name } = action.payload;

    const updatedCourtIndex = state.courts.findIndex((one) => one.name === name);

    if (updatedCourtIndex !== -1) {
      const updatedCourts = [...state.courts];
      updatedCourts.splice(updatedCourtIndex, 1);

      return {
        ...state,
        courts: updatedCourts,
      };
    } else {
      return {
        ...state,
      };
    }
  },

  [HANDLERS.GET_COURTS]: (state, action) => {
    const { courts } = action.payload;
    return {
      ...state,
      courts: courts,
    };
  },

  [HANDLERS.GET_PLAYERS]: (state, action) => {
    const { players } = action.payload;
    return {
      ...state,
      players: players,
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
    // if (initialized.current) {
    //   return;
    // }

    // initialized.current = true;

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

    axios
      .get(backendUrl + "/api/player/getPlayersData")
      .then((res) => {
        const { players } = res.data;

        dispatch({
          type: HANDLERS.GET_PLAYERS,
          payload: { players },
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
    return axios
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

  const deletePlayer = async (data) => {
    return axios
      .post(backendUrl + "/api/admin/deletePlayer", data)
      .then((res) => {
        const { name } = res.data;

        dispatch({
          type: HANDLERS.DELETE_PLAYER,
          payload: { name },
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

  const deleteCourt = async (data) => {
    return axios
      .post(backendUrl + "/api/admin/deleteCourt", data)
      .then((res) => {
        const { name } = res.data;

        dispatch({
          type: HANDLERS.DELETE_COURT,
          payload: { name },
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

  const addPlayer = async (data) => {
    return axios
      .post(backendUrl + "/api/admin/addPlayer", data)
      .then((res) => {
        const { player } = res.data;

        dispatch({
          type: HANDLERS.ADD_PLAYER,
          payload: { player },
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

  const updatePlayer = (data) => {
    return axios
      .post(backendUrl + "/api/admin/updatePlayer", data)
      .then((res) => {
        const { player } = res.data;
        dispatch({
          type: HANDLERS.UPDATE_PLAYER,
          payload: { player },
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
        deletePlayer,
        deleteCourt,
        addPlayer,
        updatePlayer,
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
