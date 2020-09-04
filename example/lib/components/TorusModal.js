import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ModalBox from "react-native-modalbox";
import { StyleSheet } from "react-native";
import { typeCheck } from "type-check";

import { WebView } from ".";

function TorusModal({ visible, source, onDismiss, onAuthResult }) {
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
            return console.warn('got verifier', result);
          }
          throw new Error(`Unexpected type, ${type}.`);
        }
      } catch (e) {}
    },
    [onAuthResult],
  );
  return (
    <ModalBox style={StyleSheet.absoluteFill} isOpen={visible} onClosed={onDismiss}>
      <WebView
        style={StyleSheet.absoluteFill}
        source={source}
        onMessage={onMessage}
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
