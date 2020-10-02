import React from "react";
import {Platform, SafeAreaView, TouchableOpacity, ActivityIndicator, StyleSheet, Text} from "react-native";

import Torus, {useTorus} from "express-torus-react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "lightgrey" },
  error: { color: "red" },
});

const ConnectedAccounts = ({ ...extraProps }) => {
  const { results, isLoggedIn, logout } = useTorus();
  return (
    <>
      {isLoggedIn && <Text children="Connected accounts:" />}
      {Object.entries(results).map(
        ([typeOfLogin, result], i) => (
          <Text 
            key={i}
            children={typeOfLogin}
          />
        )
      )}
      {isLoggedIn && (
        <TouchableOpacity
          onPress={logout}
        >
          <Text children="Logout" />
        </TouchableOpacity>
      )}
    </>
  );
};
const SimpleTorusLogin = ({...extraProps}) => {
  const {loading, results, login} = useTorus();
  if (loading) {
    return (
      <ActivityIndicator />
    );
  }
  return (
    <TouchableOpacity
      onPress={async () => {
        try {
          const result = await login();
          console.warn(result);
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <Text children="Login" />
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <Torus>
      <SafeAreaView>
        <SimpleTorusLogin />
        <ConnectedAccounts />
      </SafeAreaView>
    </Torus>
  );
}
