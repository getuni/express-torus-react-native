import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {ActivityIndicator, View, StyleSheet, Animated, Platform} from "react-native";
import {parse as params} from "query-string";
import jsrsasign from "jsrsasign";
import parse from "url-parse";
import {useImmer} from "use-immer";
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
  const [state, updateState] = useImmer({
    loading: null,
    error: null,
    result: null,
  });
  const [animOpacity] = useState(() => new Animated.Value(0));
  const [visible, setVisible] = useState(false);

  const keyPair = useKeyPair(KEYPAIR_v0);
  const {crtPub, crtPrv} = keyPair || {};

  const uri = `${providerUri}/torus?public=${btoa(crtPub)}`;
  
  const login = useCallback(
    (arg) => {
      if (!!arg) {
        throw new Error(`Tor.us 😔: The deepLinkUri prop is now deprecated. Please replace your call to login(any) with login().`);
      }
      updateState(draft => { draft.loading = true; });
      return setVisible(true);
    },
    [setVisible, updateState],
  );

  const onAuthResult = useCallback(
    async (encryptedData) => {
      if (encryptedData === null) {
        updateState(() => ({ error: new Error("User cancelled auth."), result: null, loading: false }));
        return setVisible(false);
      }
      const result = await shouldDecryptSensitiveData(encryptedData, jsrsasign.KEYUTIL.getKey(crtPrv));
      updateState(() => ({ error: null, result, loading: false }));
      return setVisible(false);
    },
    [updateState, setVisible, crtPrv],
  );

  const { loading } = state;

  useEffect(
    () => {
      Animated.timing(
        animOpacity,
        {
          toValue: loading ? 1 : 0,
          duration: 120,
          useNativeDriver: Platform.OS !== "web",
        },
      ).start();
    },
    [loading, animOpacity],
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
          source={{ uri }}
          onDismiss={() => setVisible(false)}
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
