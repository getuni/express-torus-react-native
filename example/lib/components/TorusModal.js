import React, { useCallback, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import ModalBox from "react-native-modalbox";
import { StyleSheet } from "react-native";
import { typeCheck } from "type-check";

import { WebView } from ".";

function TorusModal({ visible, source, onDismiss, onAuthResult }) {
  const ref = useRef();
  const [verify, setVerify] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const [data, setData] = useState(null);
  const [key, setKey] = useState(Math.random);

  const onMessage = useCallback(
    ({ nativeEvent: { data } }) => {
      console.warn(data);
      try {
        const e = JSON.parse(data);
        if (typeCheck("{type:String,...}", e)) {
          const {type, ...extras} = e;
          if (type === "torus-auth") {
            const { data } = extras;
            return onAuthResult(data);
          } else if (type === "torus-verifier-result") {
            const { result } = extras;
            return setVerify(result);
          } else if (type === "torus-trigger-auth") {
            const { trigger } = extras;
            return setTrigger(trigger);
          //} else if (type === "torus-recovered") { // TODO: This should be torus-auth!
          //  const { result } = extras;
          //  return onAuthResult(result, false);
          }
          throw new Error(`Unexpected type, ${type}.`);
        }
      } catch (e) {}
    },
    [onAuthResult, setVerify, ref, setTrigger],
  );
  useEffect(
    () => {
      if (!!trigger && !!verify) {
        const { ...data } = { ...trigger, ...verify };
        setVerify(null);
        setTrigger(null);
        setData(data);
        setKey(Math.random);
      }
    },
    [trigger, verify, ref, setVerify, setTrigger, setData, setKey],
  );
  const onLoadEnd = useCallback(
    () => {
      if (!!data) {
        ref.current.injectJavaScript(
          `
setTimeout(
  () => window.__REACT_TORUS_TRIGGER_VERIFY__(${JSON.stringify(data)}),
  2000, // TODO: This needs to be dynamic.
);
true;
          `.trim(),
        );
      }
    },
    [data, ref],
  );
  return (
    <ModalBox style={StyleSheet.absoluteFill} isOpen={visible} onClosed={onDismiss}>
      <WebView
        key={key}
        ref={ref}
        style={StyleSheet.absoluteFill}
        onLoadEnd={onLoadEnd}
        source={source}
        onMessage={onMessage}
        userAgent="Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0"
      />
    </ModalBox>
  );
}

TorusModal.propTypes = {
  onAuthResult: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  source: PropTypes.shape({}),
  onDismiss: PropTypes.func,
};

TorusModal.defaultProps = {
  visible: false,
  source: { uri: null },
  onDismiss: () => null,
};

export default TorusModal;
