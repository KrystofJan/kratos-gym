<script setup>
import { ref } from 'vue';


const props = defineProps({
    builderText: ref(Object)
});
</script>

<template>
    <div class="BuilderStep">
        <div class="BuilderText">
            <h2>{{ builderText.heading }}</h2>
            <div class="BaseText" v-html="builderText.text" />
        </div>
        <div class="BuilderItem"  data-plan-name>
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../styles/sass/Reservation/Builder.scss';
</style>