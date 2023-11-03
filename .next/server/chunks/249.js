"use strict";
exports.id = 249;
exports.ids = [249];
exports.modules = {

/***/ 9204:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": () => (/* binding */ backendUrl)
/* harmony export */ });
let backendUrl;
if (false) {} else {
    console.log("production env");
    backendUrl = "https://courtbooking.vercel.app";
}



/***/ }),

/***/ 249:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Eu": () => (/* binding */ useAuthContext),
/* harmony export */   "Ho": () => (/* binding */ AuthProvider),
/* harmony export */   "Vo": () => (/* binding */ AuthContext),
/* harmony export */   "he": () => (/* binding */ AuthConsumer)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var src_config_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9204);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_4__]);
axios__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];





const HANDLERS = {
    INITIALIZE: "INITIALIZE",
    SIGN_IN: "SIGN_IN",
    SIGN_OUT: "SIGN_OUT",
    UPDATE_USER: "UPDATE_USER"
};
const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    users: []
};
const handlers = {
    [HANDLERS.INITIALIZE]: (state, action)=>{
        const { user , users  } = action.payload;
        return {
            ...state,
            ...user ? {
                isAuthenticated: true,
                isLoading: false,
                user,
                users
            } : {
                isLoading: false
            }
        };
    },
    [HANDLERS.SIGN_IN]: (state, action)=>{
        const { user , users  } = action.payload;
        return {
            ...state,
            isAuthenticated: true,
            user,
            users
        };
    },
    [HANDLERS.SIGN_OUT]: (state)=>{
        return {
            ...state,
            isAuthenticated: false,
            user: null,
            users: []
        };
    },
    [HANDLERS.UPDATE_USER]: (state, action)=>{
        const { user  } = action.payload;
        return {
            ...state,
            isAuthenticated: true,
            user: user
        };
    }
};
const reducer = (state, action)=>handlers[action.type] ? handlers[action.type](state, action) : state;
// The role of this context is to propagate authentication state through the App tree.
const AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({
    undefined
});
const AuthProvider = (props)=>{
    const { children  } = props;
    const [state, dispatch] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useReducer)(reducer, initialState);
    const initialized = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
    const initialize = async ()=>{
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
                email: "anika.visser@devias.io"
            };
            const users = [];
            dispatch({
                type: HANDLERS.INITIALIZE,
                payload: {
                    user,
                    users
                }
            });
        } else {
            dispatch({
                type: HANDLERS.INITIALIZE
            });
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        initialize();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const skip = ()=>{
        try {
            window.sessionStorage.setItem("authenticated", "true");
        } catch (err) {
            console.error(err);
        }
        const user = {
            id: "5e86809283e28b96d2d38537",
            avatar: "/assets/avatars/avatar-anika-visser.png",
            name: "Nikolay Sapov",
            email: "anika.visser@devias.io"
        };
        const users = [];
        dispatch({
            type: HANDLERS.SIGN_IN,
            payload: {
                user,
                users
            }
        });
    };
    const signIn = async (email, password)=>{
        // if (email !== 'demo@devias.io' || password !== 'Password123!') {
        //   throw new Error('Please check your email and password');
        // }
        const userData = {
            email: email,
            password: password
        };
        axios__WEBPACK_IMPORTED_MODULE_4__["default"].post(src_config_url__WEBPACK_IMPORTED_MODULE_3__/* .backendUrl */ .A + "/api/auth/login", userData).then((res)=>{
            const { token  } = res.data;
            try {
                window.sessionStorage.setItem("authenticated", "true");
                window.sessionStorage.setItem("token", token);
                const { user , users  } = res.data;
                dispatch({
                    type: HANDLERS.SIGN_IN,
                    payload: {
                        user,
                        users
                    }
                });
            } catch (err) {
                console.error(err);
            }
        }).catch((err)=>{
            console.log(err);
            if (err.response === undefined) {
                throw new Error(err.message);
            } else {
                throw new Error(err.response.data.message);
            }
        });
    };
    const signUp = async (email, name, password)=>{
        throw new Error("Sign up is not implemented");
    };
    const signOut = ()=>{
        dispatch({
            type: HANDLERS.SIGN_OUT
        });
    };
    const updatePassword = (newPassword, email)=>{
        const data = {
            newPassword: newPassword,
            email: email
        };
        axios__WEBPACK_IMPORTED_MODULE_4__["default"].post(src_config_url__WEBPACK_IMPORTED_MODULE_3__/* .backendUrl */ .A + "/api/auth/updatePassword", data).then((res)=>{
            console.log(res.data.message);
            dispatch({
                type: HANDLERS.SIGN_OUT
            });
        }).catch((err)=>{
            console.log(err);
            if (err.response === undefined) {
                throw new Error(err.message);
            } else {
                throw new Error(err.response.data.message);
            }
        });
    };
    const updateUser = (data)=>{
        axios__WEBPACK_IMPORTED_MODULE_4__["default"].post(src_config_url__WEBPACK_IMPORTED_MODULE_3__/* .backendUrl */ .A + "/api/auth/updateUser", data).then((res)=>{
            const { user  } = res.data;
            dispatch({
                type: HANDLERS.UPDATE_USER,
                payload: {
                    user
                }
            });
        }).catch((err)=>{
            if (err.response === undefined) {
                throw new Error(error.message);
            } else {
                throw new Error(err.response.data.message);
            }
        });
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(AuthContext.Provider, {
        value: {
            ...state,
            skip,
            signIn,
            signUp,
            signOut,
            updatePassword,
            updateUser
        },
        children: children
    });
};
AuthProvider.propTypes = {
    children: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().node)
};
const AuthConsumer = AuthContext.Consumer;
const useAuthContext = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;