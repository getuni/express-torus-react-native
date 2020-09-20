import React, { useCallback, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import ModalBox from "react-native-modalbox";
import { StyleSheet, View } from "react-native";
import { typeCheck } from "type-check";
import { WebViewModal, WebView } from "react-native-webview-modal";

const styles = StyleSheet.create({
  transparent: { backgroundColor: "transparent" },
  hidden: { width: 0, height: 0, opacity: 0 },
});

function TorusModal({ visible, source, onDismiss, onAuthResult }) {
  const [verify, setVerify] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const ref = useRef();

  const onMessage = useCallback(
    ({ nativeEvent: { data } }) => {
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
          } else if (type === "torus-auth-cancel") {
            return onAuthResult(null);
          }
          throw new Error(`Unexpected type, ${type}.`);
        }
      } catch (e) {}
    },
    [onAuthResult, setVerify, setTrigger],
  );

  useEffect(
    () => {
      if (!!trigger && !!verify) {
        const { ...data } = { ...trigger, ...verify };
        setVerify(null);
        setTrigger(null);
        onDismiss();
        ref.current.injectJavaScript(`window.__REACT_TORUS_TRIGGER_VERIFY__(${JSON.stringify(data)}); true;`);
      }
    },
    [trigger, verify, setVerify, setTrigger, ref, onDismiss],
  );

  const { uri } = source;
  return (
    <>
      <View pointerEvents="none" style={styles.hidden}>
        <WebView ref={ref} onMessage={onMessage} source={source} />
      </View>
      <WebViewModal
        visible={visible}
        style={[StyleSheet.absoluteFill, styles.transparent]}
        source={source}
        onMessage={onMessage}
        userAgent="Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0"
      />
    </>
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
