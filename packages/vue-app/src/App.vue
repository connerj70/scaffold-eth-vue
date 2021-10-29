<template>
  <div id="app">
    <!-- ✏️ Edit the header and change the title to your project name -->
    <main-header />
    {{networkDisplay}}
  </div>
</template>

<script>
import { ref } from 'vue'
import MainHeader from './components/MainHeader'
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
const { ethers } = require("ethers");
import useUserProviderAndSigner from './composables/useUserProviderAndSigner'

console.log(INFURA_ID, NETWORK)
const NETWORKCHECK = true;

export default {
  name: 'app',
  components: {
    'main-header': MainHeader
  },
  setup (props) {
    console.log(props)
    const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
    const localProviderUrl = targetNetwork.rpcUrl;
    const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
    const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);
    console.log(NETWORKCHECK)
    const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
    console.log(localChainId)

    const injectedProvider = ref(0)
    const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
    const userSigner = userProviderAndSigner.signer;
    const selectedChainId =
        userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;
    console.log(selectedChainId)

    return {
      localChainId,
      selectedChainId
    }
  },
  data () {
    return {
      networkDisplay: ''
    }
  },
  methods: {
    setNetworkDisplay: function () {
        if (NETWORKCHECK && this.localChainId && this.selectedChainId && this.localChainId !== this.selectedChainId) {
          console.log('hi')
        }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
