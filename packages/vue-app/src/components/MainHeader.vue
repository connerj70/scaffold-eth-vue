<template>
     <a href="/">
     <page-header 
        title="🏗 scaffold-eth"
        subTitle="forkable Ethereum dev stack focused on fast product iteration"
        style="cursor: pointer"
     />
    </a>
</template>

<script>
    import { PageHeader } from 'ant-design-vue'
    export default {
        name: 'MainHeader',
        components: {
            'page-header': PageHeader
        }
    }
</script>
