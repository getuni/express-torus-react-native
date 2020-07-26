import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {Linking, Platform} from "react-native";
import {parse as params} from "query-string";
import jsrsasign from "jsrsasign";
import parse from "url-parse";
import {useImmer} from "use-immer";
import {encode as btoa} from "base-64";
import {typeCheck} from "type-check";
import * as WebBrowser from "expo-web-browser";

import {TorusContext} from "../contexts";
import {useKeyPair} from "../hooks";

const KEYPAIR_v0 = "JrSEqgr2sDCwZXC9YASO4";

const shouldDecryptSensitiveData = (data, key) => {
  const { privateKey, ...extras } = data;
  return {
    ...extras,
    privateKey: jsrsasign.crypto.Cipher.decrypt(privateKey, key),
  };
};

const TorusProvider = ({providerUri, children, ...extras}) => {
  const [state, updateState] = useImmer({error: null, result: null});
  const keyPair = useKeyPair(KEYPAIR_v0);
  const maybeFetchTorus = useCallback(
    url => Promise
      .resolve()
      .then(
        () => {
          if (url && !!keyPair) {
            const {crtPrv} = keyPair;
            return Promise
              .resolve()
              .then(() => parse(url))
              .then(({query}) => params(query))
              .then(({torus}) => {
                if (!!torus) {
                  /* close prompt */
                  if (Platform.OS === "ios") {
                    WebBrowser.dismissBrowser();
                  }
                  return Promise
                    .resolve()
                    .then(() => JSON.parse(decodeURIComponent(torus)))
                    .then(encryptedData => shouldDecryptSensitiveData(encryptedData, jsrsasign.KEYUTIL.getKey(crtPrv)))
                    .then(
                      result =>  updateState(
                        () => ({
                          error: null,
                          result,
                        }),
                      ),
                    );
                }
              });
          }
          return undefined;
        },
      )
      .catch(error => updateState(() => ({ data: null, error }))),
    [updateState, keyPair],
  );

  const login = useCallback(
    () => {
      if (typeCheck("String", providerUri) && typeCheck("{crtPub:String,crtPrv:String}", keyPair)) {
        const {crtPub} = keyPair;
        const uri = `${providerUri}/torus?platform=${Platform.OS}&public=${btoa(crtPub)}`;
        if (Platform.OS === "web") {
          return Linking.openURL(uri);
        }
        return WebBrowser.openBrowserAsync(uri);
      }
    },
    [providerUri, keyPair],
  );

  useEffect(
    () => {
      /* initial url */
      Linking.getInitialURL()
        .then(url => maybeFetchTorus(url));

      const e = ({url}) => maybeFetchTorus(url);
      /* mid-session url */
      Linking.addEventListener("url", e);

      return () => Linking.removeEventListener("url", e);
    },
    [maybeFetchTorus],
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
