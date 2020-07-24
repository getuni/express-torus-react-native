import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

import {useTorus} from "express-torus-react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  logout: {
    textAlign: "right",
    color: "red",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: { color: "red" },
  profile: { flexDirection: "row", alignItems: "center" },
  image: {
    width: 15,
    height: 15,
    margin: 5,
  },
});

export default function App() {
  const [{login, logout}, loading, result, error] = useTorus();
  return (
    <View style={styles.container}>
      {(!!error) && (
        <Text
          style={styles.error}
          children={error.toString()}
        />
      )}
      {(!!loading) && (
        <ActivityIndicator
        />
      )}
      {(!loading && !result) && (
        <>
          <TouchableOpacity onPress={() => login("twitter")}>
            <Text>Sign in.</Text>
          </TouchableOpacity>
        </>
      )}
      {(!loading && result) && (
        <View>
          <View style={styles.profile}>
            <Image
              style={styles.image}
              source={{ uri: result.userInfo.profileImage}}
            />
            <View
            >
              <Text
                style={styles.title}
                children={`Hey, ${result.userInfo.name}!`}
              />
              <Text
                children={`Your ethereum address is ${result.publicAddress},`}
              />
              <Text
                children={`and your wallet private key is ${(!!result.privateKey ? "truthy" : "falsey")}!`}
              />
            </View>
          </View>
          <TouchableOpacity onPress={logout}>
            <Text
              style={styles.logout}
              children={`Logout`}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
