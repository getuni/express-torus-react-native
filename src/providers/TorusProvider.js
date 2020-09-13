import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {Linking, Platform} from "react-native";
import {parse as params} from "query-string";
import jsrsasign from "jsrsasign";
import parse from "url-parse";
import {useImmer} from "use-immer";
import {encode as btoa} from "base-64";
import {typeCheck} from "type-check";

import {TorusModal} from "../components";
import {TorusContext} from "../contexts";
import {useKeyPair} from "../hooks";

const KEYPAIR_v0 = "JrSEqgr2sDCwZXC9YASO4";

const shouldDecryptSensitiveData = (data, key) => {
  const { privateKey, ...extras } = data;
  return { ...extras, privateKey: jsrsasign.crypto.Cipher.decrypt(privateKey, key) };
};

const TorusProvider = ({providerUri, children, ...extras}) => {
  const [state, updateState] = useImmer({uri: null, error: null, result: null});
  const [visible, setVisible] = useState(false);

  const keyPair = useKeyPair(KEYPAIR_v0);
  const {crtPub, crtPrv} = keyPair || {};

  const uri = `${providerUri}/torus?public=${btoa(crtPub)}`;
  
  const login = useCallback(
    (arg) => {
      if (!!arg) {
        throw new Error(`Tor.us 😔: The deepLinkUri prop is now deprecated. Please replace your call to login(any) with login().`);
      }
      return setVisible(true);
    },
    [setVisible],
  );

  const onAuthResult = useCallback(
    async (encryptedData) => {
      const result = await shouldDecryptSensitiveData(encryptedData, jsrsasign.KEYUTIL.getKey(crtPrv));
      updateState(() => ({ error: null, result }));
      return setVisible(false);
    },
    [updateState, setVisible, crtPrv],
  );

  return (
    <TorusContext.Provider
      value={{
        ...TorusContext.defaultContext,
        ...state,
        providerUri,
        keyPair,
        login,
      }}
    >
      {children}
      <TorusModal
        onAuthResult={onAuthResult}
        visible={visible}
        source={{ uri }}
        onDismiss={() => setVisible(false)}
      />
    </TorusContext.Provider>
  );
};

TorusProvider.propTypes = {
  providerUri: PropTypes.string,
};

TorusProvider.defaultProps = {
  providerUri: TorusContext.defaultContext.providerUri,
};

export default TorusProvider;
