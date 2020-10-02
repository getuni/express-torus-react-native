import React from "react";

const defaultContext = Object.freeze({
  providerUri: "http://localhost:3000",
  keyPair: null,
  loading: false,
  error: null,
  results: null,
  login: () => Promise.reject(new Error(`You must wrap your application within a <Torus /> provider.`)),
  logout: () => Promise.reject(new Error(`You must wrap your application within a <Torus /> provider.`)),
  isLoggedIn: false,
});

const TorusContext = React.createContext(defaultContext);

TorusContext.defaultContext = defaultContext;

export default TorusContext;
