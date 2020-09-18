import React from "react";
import {Platform, SafeAreaView, TouchableOpacity, ActivityIndicator, StyleSheet, Text} from "react-native";

import Torus, {useTorus} from "express-torus-react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "lightgrey" },
  error: { color: "red" },
});

const SimpleTorusLogin = ({...extraProps}) => {
  const {loading, error, result, login} = useTorus();
  if (loading) {
    return (
      <ActivityIndicator />
    );
  } else if (error) {
    return (
      <Text
        style={styles.error}
        children={error.toString()}
      />
    );
  } else if (result) {
    return (
      <Text
        children={JSON.stringify(result)}
      />
    );
  }
  return (
    <TouchableOpacity onPress={() => login()}>
      <Text children="Login" />
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <Torus>
      <SafeAreaView>
        <SimpleTorusLogin />
      </SafeAreaView>
    </Torus>
  );
}
