// how allow app to be opened AppDelegate.m

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


