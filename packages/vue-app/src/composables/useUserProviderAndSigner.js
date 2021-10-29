import {ref, watch } from 'vue'
import useBurnerSigner from './useBurnerSigner'
import { parseProviderOrSigner } from '../functions/providerOrSigner';

const syncBurnerKeyFromStorage = () => {
    if (window.location.pathname && window.location.pathname.includes('/pk')) {
      const incomingPK = window.location.hash.replace('#', '');
  
      if (incomingPK.length === 64 || incomingPK.length === 66) {
        console.log('🔑 Incoming Private Key...');
        const rawPK = incomingPK;
        window.history.pushState({}, '', '/');
        const currentPrivateKey = window.localStorage.getItem('metaPrivateKey');
        if (currentPrivateKey && currentPrivateKey !== rawPK) {
          window.localStorage.setItem(`metaPrivateKey_backup${Date.now()}`, currentPrivateKey);
        }
        window.localStorage.setItem('metaPrivateKey', rawPK);
      }
    }
  };

export default function useUserProviderAndSigner(injectedProviderOrSigner, localProvider) {
    const signer = ref()
    const provider = ref()
    const providerNetwork = ref()
    const burnerSigner = useBurnerSigner(localProvider)

    const setSigner = () => {
        if (injectedProviderOrSigner) {
            console.log('🦊 Using injected provider');
            void parseProviderOrSigner(injectedProviderOrSigner).then((result) => {
              if (result != null) setSigner(result.signer);
            });
          } else if (!localProvider) {
            setSigner(undefined);
          } else {
            syncBurnerKeyFromStorage();
            console.log('🔥 Using burner signer', burnerSigner);
            setSigner(burnerSigner);
          }
    }

    watch([injectedProviderOrSigner, localProvider, burnerSigner], setSigner)

    const setProvider = () => {
        if (signer.value) {
            const result = parseProviderOrSigner(signer.value);
            void result.then((r) => {
              setProvider(r.provider);
              providerNetwork.value = r.providerNetwork;
            });
          }
    }

    watch(signer, setProvider)

    return { signer, provider, providerNetwork }
}