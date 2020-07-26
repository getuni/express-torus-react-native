import React from "react";
import {View, ActivityIndicator, StyleSheet, Text} from "react-native";

import {useTorus, Torus, TorusProvider} from "./tmp";

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: "lightgrey"},
  error: { color: "red" },
});

const SimpleTorusLogin = ({...extraProps}) => {
  const {loading, error, result} = useTorus();
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
    <Torus
      style={{
        flex: 1,
      }}
    />
  );
};

export default function App() {
  return (
    <TorusProvider>
      <View style={styles.container}>
        <SimpleTorusLogin />
      </View>
    </TorusProvider>
  );
}
