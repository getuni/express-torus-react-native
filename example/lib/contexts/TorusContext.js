import React from "react";

const defaultContext = Object.freeze({
  providerUri: "http://localhost:3000",
  keyPair: null,
  loading: false,
  error: null,
  result: null,
  login: () => Promise.reject(new Error(`You must wrap your application within a <Torus /> provider.`)),
});

const TorusContext = React.createContext(defaultContext);

TorusContext.defaultContext = defaultContext;

export default TorusContext;
