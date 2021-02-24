<template>
    <view class="inpputBox">
        <view class="inputTitle" v-if="name !== ''">{{name}}</view>
        <slider class="inputSlider" :value="value" @change="change" :show-value="show_value" :step="step"
                :min="min" :max="max" activeColor="#6200ee" backgroundColo="#c39ef9" block-size="14" block-color="#6200ee"/>
    </view>
</template>

<script>
    export default {
        name: "inputSlider",
        props: ['name', 'value', 'change', 'show_value', 'step', 'min', 'max']
    }
</script>

<style scoped lang="scss">
    .inpputBox {
        width: 100%;
        height: 120rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .inputTitle {
        width: 30%;
    }

    .inputSlider {
        width: 70%;
    }
</style>