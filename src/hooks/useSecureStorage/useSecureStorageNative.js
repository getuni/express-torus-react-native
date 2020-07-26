import {useState} from "react";

// XXX: On native platforms, it's acceptable to use in-memory storage since these platforms aren't subject to the same
//      loss of runtime context that web navigation can cause.
const useSecureStorageNative = () => {
  const [arr] = useState([{}]);
  const [storage] = useState(
    () => ({
      set: async (k, v) => (arr[0][k] = v) && undefined,
      get: async k => arr[0][k],
    }),
  );
  return storage;
};

export default useSecureStorageNative;
