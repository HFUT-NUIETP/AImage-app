<template>
    <switch :checked="checked" @click="click" style="transform:scale(0.7)" color="#6200ee"/>
</template>

<script>
    export default {
        name: "inputSwitch",
        props: ["checked", "click"]
    }
</script>

<style scoped>

</style>