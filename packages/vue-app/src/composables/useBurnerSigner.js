import {toRef, ref, onMounted, watch } from 'vue'
import { ethers } from 'ethers';

export default function useBurnerSigner(props) {
    const { provider } = toRef(props)
    const key = 'metaPrivateKey'
    const signer = ref()
    const privateKeyValue = ref()

    const setValue = (value) => {
      try {
        privateKeyValue.value = value
        window.localStorage.setItem(key, value)
      } catch(error) {
        console.log(error)
      }
    }

    const setKey = () => {
      const storedKey = window.localStorage.getItem(key);
      if(!storedKey) {
        console.log('generating a new key');
        const newWallet = ethers.Wallet.createRandom();
        const newKey = newWallet.privateKey;
        setValue(newKey)
      } else {
        setValue(storedKey)
      }
    }

    onMounted(setKey)

    const setSigner = () => {
      if (privateKeyValue.value && provider) {
        const wallet = new ethers.Wallet(privateKeyValue.value)
        const newSigner = wallet.connect(provider);
        setSigner(newSigner);
      }
    }

    watch([privateKeyValue, provider], setSigner)
   
    return {
      signer
    }
}