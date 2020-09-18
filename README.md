# express-torus-react-native

This library enables cross-platform (Android/iOS/Web/Expo) ethereum-login for [**React Native**](https://reactnative.dev/) using [**Tor.us**](https://tor.us/),  a service which provides a simple and seamless way to onboard users from their social login into the world of [**Web3**](https://web3js.readthedocs.io/en/v1.2.11/) and [**DeFi**](https://blog.coinbase.com/a-beginners-guide-to-decentralized-finance-defi-574c68ff43c4?gi=7db05dba5dc9).

It works by navigating from your application to the interface hosted by your specified `providerUri`, i.e. where your instance of [`express-torus`](https://github.com/cawfree/express-torus) is being served. Upon successful auth with one of the many [**supported authentication providers**](https://github.com/torusresearch/torus-direct-web-sdk/blob/9d024825ce1fad8cb31e7878ad6b85ba6d6025b4/examples/vue-app/src/App.vue#L24), your app will returned to with the authentication result, which is accessed via a [**hook**](https://reactjs.org/docs/hooks-intro.html). This includes standard authentication data (such as username and profile photo) in addition to [**Ethereum**](https://ethereum.org/en/) wallet credentials that can be used in transactions.

This project was created as part of the [**Gitcoin**](https://gitcoin.co/) [**KERNEL Genesis Block**](https://gitcoin.co/blog/announcing-kernel/).

## 🚀 Getting Started

Using [`npm`](https://npmjs.com):

```bash
npm install --save express-torus-react-native react-native-webview
```

Using [`yarn`](https://yarnpkg.com):

```bash
yarn add express-torus-react-native react-native-webview
```

Using [`Expo`](https://expo.io):

```bash
expo install express-torus-react-native react-native-webview
```

## ✍️ Usage

```javascript
import React from "react";
import {Platform, SafeAreaView, TouchableOpacity, ActivityIndicator, Text} from "react-native";

import Torus, {useTorus} from "express-torus-react-native";

const SimpleTorusLogin = ({...extraProps}) => {
  const {loading, error, result, login} = useTorus();
  if (loading) {
    return (
      <ActivityIndicator />
    );
  } else if (error) {
    return (
      <Text style={styles.error} children={error.toString()} />
    );
  } else if (result) {
    return (
      <Text children={JSON.stringify(result)} />
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
    <Torus
      providerUri="http://localhost:3000"
      renderLoading={() => (
        <View style={{ flex: 1, backgroundColor: "green: }} />
      )}
    >
      <SafeAreaView>
        <SimpleTorusLogin />
      </SafeAreaView>
    </Torus>
  );
}
```

You can view the full list of supported authentication providers [**here**](https://github.com/torusresearch/torus-direct-web-sdk/blob/9d024825ce1fad8cb31e7878ad6b85ba6d6025b4/examples/vue-app/src/App.vue#L24).

## ✌️ License
[**MIT**](./LICENSE)
