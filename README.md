# express-torus-react-native
🔐 ⚛️  A React Native hook for simple decentralized key management using [Tor.us](https://tor.us/), which serves as a combined social login and ethereum wallet!

This project works by navigating from your application to the interface hosted by your specified `providerUri`, i.e. where your instance of [`express-torus`](https://github.com/cawfree/express-torus) is being served. Upon successful auth with one of the many [**supported authentication providers**](https://github.com/torusresearch/torus-direct-web-sdk/blob/9d024825ce1fad8cb31e7878ad6b85ba6d6025b4/examples/vue-app/src/App.vue#L24), your app will returned to using [**Deep Linking**](https://reactnavigation.org/docs/deep-linking) wich the authentication result, which is accessed via a [**hook**](https://reactjs.org/docs/hooks-intro.html). This includes standard authentication data (such as username and profile photo) in addition to [**Ethereum**](https://ethereum.org/en/) wallet credentials that can be used in transactions.

## 🚀 Getting Started

Using [`npm`](https://npmjs.com):

```bash
npm install --save express-torus-react-native
```

Using [`yarn`](https://yarnpkg.com):

```bash
yarn add express-torus-react-native
```

### Deep Linking

#### Configuring Deep Linking on Expo
Update your [`app.json`](./example/app.json) to include your application's [**scheme**](https://docs.expo.io/workflow/linking/#in-a-standalone-app) to match the configuration consumed by the backend's [`linking`](https://github.com/cawfree/express-torus/blob/c92f831891c0d88dc4dd36b310bcfa75ae33032d/example/src/index.js#L87) prop:

```diff
{
  "expo": {
+   "scheme": "myapp"
  }
}
```

#### Configuring Deep Linking iOS
Firstly, you'll need to register your app's deep link scheme (i.e. `myapp`) as a supported [**URL Type**](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app) with a role of **Viewer** in your App's `Info.plist`.

Finally, append the following lines in the iOS [`AppDelegate.m`](./example/ios/AppDelegate.m):

```diff
+ - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
+   if ([RCTLinkingManager application:application openURL:url sourceApplication:nil annotation:nil]) {
+     return YES;
+   }
+   return NO;
+ }
```

## ✍️ Usage

```javascript
import React from "react";
import {SafeAreaView, TouchableOpacity, ActivityIndicator, Text} from "react-native";

import {useTorus, TorusProvider} from "express-torus-react-native";

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
    <TouchableOpacity onPress={login}>
      <Text children="Login" />
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <TorusProvider providerUri="http://localhost:3000">
      <SafeAreaView>
        <SimpleTorusLogin />
      </SafeAreaView>
    </TorusProvider>
  );
}
```

You can view the full list of supported authentication providers [**here**](https://github.com/torusresearch/torus-direct-web-sdk/blob/9d024825ce1fad8cb31e7878ad6b85ba6d6025b4/examples/vue-app/src/App.vue#L24).

## ✌️ License
[**MIT**](./LICENSE)
