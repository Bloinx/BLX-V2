import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const initialState = {
  session: null,
  user: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "SESSION_UPDATED":
      return {
        ...state,
        session: action.payload.session,
        user: action.payload.user,
        loading: false,
      };
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      dispatch({
        type: "SESSION_UPDATED",
        payload: { session, user: session?.user },
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        dispatch({
          type: "SESSION_UPDATED",
          payload: { session, user: session?.user },
        });
      });
    };

    getSession();
  }, []);

  useEffect(() => {
    if (state.loading === false) {
      if (!state.session) {
        navigate("/login");
      }
    }
  }, [state.loading, state.session, navigate]);

  const login = async (userEmail, pass) => {
    try {
      dispatch({ type: "LOADING", payload: true });

      const {
        data: { session, user },
        error,
      } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: pass,
      });
      if (error) throw error;
      dispatch({
        type: "SESSION_UPDATED",
        payload: { session, user },
      });
    } catch (error) {
      console.log(error.error_description || error.message);
    } finally {
      dispatch({ type: "LOADING", payload: false });
    }
  };

  const signUp = async (email, password) => {
    dispatch({ type: "LOADING", payload: true });
    try {
      const {
        data: { session, user },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;
      dispatch({ type: "SESSION_UPDATED", payload: { session, user } });
    } catch (error) {
      console.error("SignUp error:", error.message);
    } finally {
      dispatch({ type: "LOADING", payload: false });
    }
  };

  const signOut = async () => {
    dispatch({ type: "LOADING", payload: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch({
        type: "SESSION_UPDATED",
        payload: { session: null, user: null },
      });
      navigate("/login");
    } catch (error) {
      console.error("SignOut error:", error.message);
    } finally {
      dispatch({ type: "LOADING", payload: false });
    }
  };

  const resetPasswordForEmail = async (email, onSuccess, onFailure) => {
    dispatch({ type: "LOADING", payload: true });
    try {
      const { data, error } =
        await supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        throw error;
      } else {
        onSuccess();
      }
    } catch (error) {
      onFailure();
      console.error("ResetPassword error:", error.message);
    } finally {
      dispatch({ type: "LOADING", payload: false });
    }
  };

  const updateUser = async (values, accessToken, onSuccess, onFailure) => {
    dispatch({ type: "LOADING", payload: true });
    try {
      const { user, error } = await supabase.auth.updateUser(accessToken, {
        password: values.password,
      });
      if (error) {
        throw error;
      } else {
        onSuccess();
      }
      dispatch({ type: "SESSION_UPDATED", payload: { user } });
    } catch (error) {
      console.error("UpdateUser error:", error.message);
      onFailure();
    } finally {
      dispatch({ type: "LOADING", payload: false });
    }
  };

  const setUserData = async (user, values) => {
    try {
      const { error } = await supabase.from("profiles").insert([
        {
          id: user?.id,
          username: values.username,
          email: values.email,
          age: values.yearsOld,
          gender: values.gender,
        },
      ]);

      if (error) throw error;
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signUp,
        signOut,
        resetPasswordForEmail,
        updateUser,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
