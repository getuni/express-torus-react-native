import {useState, useEffect} from "react";
import jsrsasign from "jsrsasign";

import useSecureStorage from "./useSecureStorage";

const useKeyPair = (id) => {
  const secureStorage = useSecureStorage();
  const [keyPair, setKeyPair] = useState(null);
  useEffect(
    /* fetch the key pair */
    () => Promise
      .resolve()
      .then(() => secureStorage.get(id))
      .then(
        (keyPair) => {
          if (!keyPair) {
            /* compute a new key */
            const {pubKeyObj, prvKeyObj} = jsrsasign.KEYUTIL.generateKeypair("RSA", 1024);

            const crtPub = jsrsasign.KEYUTIL.getPEM(pubKeyObj, "PKCS8PUB");
            const crtPrv = jsrsasign.KEYUTIL.getPEM(prvKeyObj, "PKCS8PRV");

            const kp = {crtPub, crtPrv};

            return secureStorage.set(id, kp)
              .then(() => kp);
          }
          return keyPair;
        },
      )
      .then(setKeyPair) && undefined,
    [secureStorage, setKeyPair, id],
  );
  return keyPair;
};

export default useKeyPair;
