# express-torus-react-native
🔐 ⚛️  A React Native hook for simple decentralized key management using [Tor.us](https://tor.us/), which serves as a combined social login and ethereum wallet!

This is a companion library for [`express-torus`](https://github.com/cawfree/express-torus).

You can view the full (exhaustive!) list of supported authentication providers [**here**](https://github.com/torusresearch/torus-direct-web-sdk/blob/9d024825ce1fad8cb31e7878ad6b85ba6d6025b4/examples/vue-app/src/App.vue#L24).

## 🚀 Getting Started

Using [`yarn`](https://yarnpkg.com):

```bash
yarn add express-torus-react-native
```

### iOS
To support deep linking results from the webpage to your app, please append the following to your `AppDelegate.m`:

```objc
- (BOOL)application:(UIApplication *)application
openURL:(NSURL *)url
options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if ([RCTLinkingManager application:application
                             openURL:url
                   sourceApplication:nil
                          annotation:nil]) {
    return YES;
  }
  return NO;
}
```

Finally, you'll need to register your app's deep link scheme (i.e. `myapp`) as a [**URL Type**](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app) with a role of **Viewer** in your App's `Info.plist`.

## ✍️ Usage

```javascript
import React from "react";
import {SafeAreaView, TouchableOpacity, ActivityIndicator, StyleSheet, Text} from "react-native";

import {useTorus, Torus, TorusProvider} from "express-torus-react-native";

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: "lightgrey"},
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
    <TouchableOpacity
      onPress={login}
    >
      <Text
        children="Login"
      />
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <TorusProvider>
      <SafeAreaView>
        <SimpleTorusLogin />
      </SafeAreaView>
    </TorusProvider>
  );
}
```

## ✌️ License
[**MIT**](./LICENSE)
