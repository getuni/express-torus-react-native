import React, {useEffect} from "react";
import * as WebBrowser from "expo-web-browser";
import PropTypes from "prop-types";
import {typeCheck} from "type-check";
import {StyleSheet, Platform} from "react-native";
import {encode as btoa} from "base-64";

import {useTorus} from "../hooks";

import WebView from "./WebView";

const styles = StyleSheet.create({
  transparent: {backgroundColor: "transparent"},
});

const Torus = ({style, ...extraProps}) => {
  //const {keyPair, providerUri} = useTorus();
//  if (typeCheck("String", providerUri) && typeCheck("{crtPub:String,crtPrv:String}", keyPair)) {
//    const {crtPub} = keyPair;
//    const uri = `${providerUri}/torus?platform=${Platform.OS}&public=${btoa(crtPub)}`;
//    return (
//      <WebView
//        {...extraProps}
//        style={[styles.transparent, StyleSheet.flatten(style)]}
//        source={{uri}}
//      />
//    );
//  }
  //useEffect(
  //  () => {
  //    if (typeCheck("String", providerUri) && typeCheck("{crtPub:String,crtPrv:String}", keyPair)) {
  //      const {crtPub} = keyPair;
  //      const uri = `${providerUri}/torus?platform=${Platform.OS}&public=${btoa(crtPub)}`;
  //      WebBrowser.openBrowserAsync(uri);
  //    }
  //  },
  //  [keyPair, providerUri],
  //);
  return null;
};

Torus.displayName = "Torus";

Torus.propTypes = {};

Torus.defaultProps = {};

export default Torus;
