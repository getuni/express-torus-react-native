import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {ActivityIndicator, View, StyleSheet, Animated, Platform} from "react-native";
import {parse as params} from "query-string";
import jsrsasign from "jsrsasign";
import parse from "url-parse";
import {encode as btoa} from "base-64";
import {typeCheck} from "type-check";
import WebViewProvider from "react-native-webview-modal";

import {TorusModal} from "../components";
import {TorusContext} from "../contexts";
import {useKeyPair} from "../hooks";

const KEYPAIR_v0 = "JrSEqgr2sDCwZXC9YASO4";

const shouldDecryptSensitiveData = (data, key) => {
  const { privateKey, ...extras } = data;
  return { ...extras, privateKey: jsrsasign.crypto.Cipher.decrypt(privateKey, key) };
};

const TorusProvider = ({providerUri, children, renderLoading, ...extras}) => {
  const [state, updateState] = useState({
    loading: null,
    results: {},
    visible: false,
  });
  const [animOpacity] = useState(() => new Animated.Value(0));
  const [filter, setFilter] = useState(false);

  const keyPair = useKeyPair(KEYPAIR_v0);
  const {crtPub, crtPrv} = keyPair || {};

  const uri = `${providerUri}/torus?public=${btoa(crtPub)}`;

  /* hack refresh */
  const togglePage = useCallback(
    () => Promise.resolve()
      .then(() => setFilter(true))
      .then(() => new Promise(resolve => setTimeout(resolve, 250)))
      .then(() => setFilter(false)),
    [setFilter],
  );
  
  const login = useCallback(
    async (arg) => {
      if (!!arg) {
        throw new Error(`Tor.us 😔: The deepLinkUri prop is now deprecated. Please replace your call to login(any) with login().`);
      }
      return new Promise(
        (resolve, reject) => updateState(e => ({
          ...e,
          loading: true,
          visible: true,
          resolve,
          reject,
        })),
      );
    },
    [updateState],
  );

  const onAuthResult = useCallback(
    async (encryptedData) => {
      const { resolve, reject } = state;
      if (!resolve || !reject) {
        return console.warn(`Encounted callback asynchrony.`);
      }
      if (encryptedData === null) {
        return [
          updateState(({ results }) => ({
            results,
            loading: false,
            visible: false,
            resolve: null,
            reject: null,
          })),
          reject(new Error("User cancelled auth.")),
        ];
      }
      const result = await shouldDecryptSensitiveData(encryptedData, jsrsasign.KEYUTIL.getKey(crtPrv));
      const { userInfo: { typeOfLogin } } = result;
      return [
        updateState(({ results }) => ({
          results: {
            ...results,
            [typeOfLogin]: result,
          },
          loading: false,
          visible: false,
          resolve: null,
          reject: null,
        })),
        togglePage(),
        resolve(result),
      ];
    },
    [updateState, state, crtPrv, togglePage],
  );

  const logout = useCallback(
    async () => updateState(
      ({ results, ...extras }) => ({
        ...extras,
        results: {},
      }),
    ),
    [updateState],
  );

  const { loading, visible } = state;

  useEffect(
    () => Animated.timing(animOpacity, {
      toValue: loading ? 1 : 0,
      duration: 120,
      useNativeDriver: Platform.OS !== "web",
    }).start(),
    [loading, animOpacity],
  );

  const { resolve, reject, ...stateWithoutCallbacks } = state;

  return (
    <TorusContext.Provider
      value={{
        ...TorusContext.defaultContext,
        ...stateWithoutCallbacks,
        providerUri,
        keyPair,
        login,
        logout,
        isLoggedIn: !!Object.keys(state.results).length,
      }}
    >
      <WebViewProvider>
        {children}
        <Animated.View
          pointerEvents={loading ? "auto": "none"}
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: animOpacity,
            },
          ]}
        >
          {renderLoading({})}
        </Animated.View>
        <TorusModal
          onAuthResult={onAuthResult}
          visible={visible}
          source={{ ...(filter ? { html: "" } : { uri }) }}
          onDismiss={() => updateState(e => ({
            ...e,
            visible: false,
          }))}
        />
      </WebViewProvider>
    </TorusContext.Provider>
  );
};

TorusProvider.propTypes = {
  providerUri: PropTypes.string,
  renderLoading: PropTypes.func,
};

TorusProvider.defaultProps = {
  providerUri: TorusContext.defaultContext.providerUri,
  renderLoading: ({}) => (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF11",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator />
    </View>
  ),
};

export default TorusProvider;
