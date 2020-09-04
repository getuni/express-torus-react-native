import {useEffect, useState} from "react";
import SecureLS from "secure-ls";
import jsrsasign from "jsrsasign";

const useSecureStorageWeb = () => {
  const [secureStorage] = useState(
    () => {
      const ls = new SecureLS({ encodingType: "aes" });
      return Object.freeze({
        set: (k, v) => Promise.resolve(ls.set(k, JSON.stringify(v))),
        get: async (k) => {
          if (ls.getAllKeys().indexOf(k) >= 0) {
            return JSON.parse(ls.get(k));
          }
          return undefined;
        },
      });
    },
  );
  return secureStorage;
};

export default useSecureStorageWeb;
