import React from "react";

const defaultContext = Object.freeze({
  providerUri: "http://localhost:3000",
  keyPair: null,
  loading: false,
  error: null,
  result: null,
});

const TorusContext = React.createContext(defaultContext);

TorusContext.defaultContext = defaultContext;

export default TorusContext;
