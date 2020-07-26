import React, {useCallback, useState, useEffect} from "react";
import parse from "url-parse";
import {Linking, Platform} from "react-native";
import {useImmer} from "use-immer";
import {parse as params} from "query-string";
import jsrsasign from "jsrsasign";
import {decode as atob, encode as btoa} from "base-64";

import useSecureStorage from "./useSecureStorage";

const KEYPAIR_v0 = "JrSEqgr2sDCwZXC9YASO4";

const defaultOptions = {
  providerUrl: 'http://localhost:3000',
};

const shouldDecryptSensitiveData = (data, key) => {
  const { privateKey, ...extras } = data;
  return {
    ...extras,
    privateKey: jsrsasign.crypto.Cipher.decrypt(privateKey, key),
  };
};

const useTorus = ({} = defaultOptions) => {
  const {providerUrl} = defaultOptions;
  const secureStorage = useSecureStorage();
  const [keyPair, setKeyPair] = useState(null);
  useEffect(
    /* fetch the key pair */
    () => Promise
      .resolve()
      .then(() => secureStorage.get(KEYPAIR_v0))
      .then(
        (keyPair) => {
          if (!keyPair) {
            /* compute a new key */
            const {pubKeyObj, prvKeyObj} = jsrsasign.KEYUTIL.generateKeypair("RSA", 1024);

            const crtPub = jsrsasign.KEYUTIL.getPEM(pubKeyObj, "PKCS8PUB");
            const crtPrv = jsrsasign.KEYUTIL.getPEM(prvKeyObj, "PKCS8PRV");

            const kp = {crtPub, crtPrv};

            return secureStorage.set(KEYPAIR_v0, kp)
              .then(() => kp);
          }
          return keyPair;
        },
      )
      .then(setKeyPair) && undefined,
    [secureStorage, setKeyPair],
  );
  const [state, updateState] = useImmer({loading: false, error: null, result: null});
  const login = useCallback(
    provider => Promise
      .resolve()
      .then(
        () => {
          if (!keyPair) {
            return Promise.reject(new Error(`useTorus has not yet finished initializing.`));
          }
          
          const {crtPub} = keyPair;
          return crtPub;
        },
      )
      // TODO: should sign this data with a checksum to define validity
      .then(publicCertificate => Linking.openURL(`${providerUrl}/torus?platform=${Platform.OS}&public=${btoa(publicCertificate)}`)),
    [providerUrl, keyPair],
  );
  const logout = useCallback(
    () => updateState(() => ({loading: false, error: null, result: null})),
    [updateState],
  );
  const maybeFetchTorus = useCallback(
    url => Promise
      .resolve()
      .then(() => updateState(draft => {
        draft.loading = true;
      }))
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
                  return Promise
                    .resolve()
                    .then(() => JSON.parse(decodeURIComponent(torus)))
                    .then(encryptedData => shouldDecryptSensitiveData(encryptedData, jsrsasign.KEYUTIL.getKey(crtPrv)))
                    .then(
                      result =>  updateState(
                        () => ({
                          loading: false,
                          error: null,
                          result,
                          //result: !!result ? JSON.parse(decodeURIComponent(torus)) : null,
                        }),
                      ),
                    );
                }
                return updateState(draft => {
                  draft.loading = false;
                });
              });
          }
          return updateState(draft => {
            draft.loading = false;
          });
        },
      )
      .catch(error => updateState(() => ({ loading: false, data: null, error }))),
    [updateState, keyPair],
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

  const {loading, result, error} = state;
  // TODO: this needs to be an object
  return [{login, logout}, loading, result, error];
};

export default useTorus;
