# express-torus-react-native
🔐 ⚛️  A React Native hook for simple decentralized key management using [Tor.us](https://tor.us/), which serves as a combined social login and ethereum wallet!

This is a companion library for [`express-torus`](https://github.com/cawfree/express-torus).

You can view the full (exhaustive!) list of supported authentication providers [**here**](https://github.com/torusresearch/torus-direct-web-sdk/blob/9d024825ce1fad8cb31e7878ad6b85ba6d6025b4/examples/vue-app/src/App.vue#L24).

## Getting Started

Using [`yarn`](https://yarnpkg.com):

```bash
yarn add express-torus-react-native
```

## iOS
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

## Usage

```javascript
import React from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {useTorus} from "express-torus-react-native";

export default () => {
  const [{login, logout}, loading, result, error] = useTorus({
    // XXX: Expects an express tor.us middleware to be listening at the following address:
    providerUrl: "https://localhost:3000",
  });
  if (!loading && !result) {
    // Twitter isn't the only supported login provider!
    return (
      <TouchableOpacity
        onPress={() => login("twitter")}
        children="Log in."
      />
    );
  }
  return (
    <View>
      {(!!error) && <Text children={error.toString()} />}
      {(!!results) && (
        <>
          {/* social attributes */}
          <Image source={{ uri: result.userInfo.profileImage}} />
          <Text children={`Hi ${result.userInfo.name}`} />
          {/* ethereum wallet attributes  */}
          <Text children={`Ethereum Wallet Address: ${result.publicAddress}`} />
          <Text children={`Ethereum Private Key: ${result.privateKey}`} />
        </>
      )}
    </View>
  );
};
```

## License
[**MIT**](./LICENSE)
