<script setup lang="ts">
import { BuilderText } from '@/support';
interface Props {
    builderText: BuilderText
    builderItemClasses?: string
}

const props = defineProps<Props>();
</script>

<template>
    <div class="BuilderStep">
        <div v-if="builderText">
            <h2>{{ builderText.heading }}</h2>
            <div class="BaseText" v-html="builderText.text" />
        </div>
        <div class="BuilderItem" :class="builderItemClasses" data-plan-name>
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';
</style>
