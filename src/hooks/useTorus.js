import React, {useCallback, useState, useEffect} from "react";
import parse from "url-parse";
import {Linking} from "react-native";
import {useImmer} from "use-immer";
import {parse as params} from "query-string";

const defaultOptions = {
  providerUrl: 'http://localhost:3000',
};

export default useTorus = ({} = defaultOptions) => {
  const {providerUrl} = defaultOptions;
  const [state, updateState] = useImmer({
    loading: false,
    error: null,
    result: null,
  });
  const login = useCallback(
    provider => Linking.openURL(`${providerUrl}/torus/${provider}`),
    [providerUrl],
  );
  const logout = useCallback(
    () => updateState(() => ({loading: false, error: null, result: null})),
    [updateState],
  );
  const maybeFetchTorus = useCallback(
    (url, currentState) => Promise
      .resolve()
      .then(() => updateState(draft => {
        draft.loading = true;
      }))
      .then(
        () => {
          if (url) {
            return Promise
              .resolve()
              .then(() => parse(url))
              .then(({query}) => params(query))
              .then(
                ({torus}) =>  updateState(
                  () => ({
                    loading: false,
                    error: null,
                    result: !!torus ? JSON.parse(decodeURIComponent(torus)) : null,
                  }),
                ),
              );
          }
          return updateState(draft => {
            draft.loading = false;
          });
        },
      )
      .catch(error => updateState(() => ({ loading: false, data: null, error }))),
    [updateState],
  );
  
  useEffect(
    () => {
      /* initial url */
      Linking.getInitialURL()
        .then(url => maybeFetchTorus(url));

      const e = ({url}) => maybeFetchTorus(url);
      /* mid-session url */
      Linking.addEventListener("url", e);

      return () => Linking.removeEventListener("url", e);
    },
    [maybeFetchTorus],
  );
  const {loading, result, error} = state;
  return [{login, logout}, loading, result, error];
};
