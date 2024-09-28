<script setup lang="ts">
import { onMounted } from 'vue';

const prop = defineProps(['data']);

const setEventListeners = () => {
    window.addEventListener('scroll', () => {
        const comps = document.querySelectorAll('.StickyText');
        for (const comp of comps) {
            const text = comp.querySelector(".StickyText-text");
            if (window.scrollY > comp.offsetTop && window.scrollY < comp.offsetTop + comp.offsetHeight - window.innerHeight) {
                text.classList.add('sticky');
            }
            else {
                text.classList.remove('sticky');
            }

            if (window.scrollY > comp.offsetTop + comp.offsetHeight - window.innerHeight) {
                text.classList.add('rel');
            }
            else {
                text.classList.remove('rel');
            }
        }

    });
}

onMounted(setEventListeners);
</script>

<template>
    <article class="StickyText">
        <div class="StickyText-text">
            <div class="StickyText-text-content">
                <h2>{{ data.heading }}</h2>
                <div class="" v-html="data.content"></div>
            </div>
        </div>
        <div class="StickyText-img">
            <img :src="data.img_path" alt="">
        </div>
    </article>
</template>

<style scoped lang="scss">
.StickyText {
    display: flex;
    background: black;
    z-index: 1;
    position: relative;
    flex-direction: row;

    &:nth-of-type(2n) {
        flex-direction: row-reverse;
    }

    &-text {
        position: absolute;
        top: 0;
        width: 35%;
        background: var(--background);
        color: var(--backgroundContrast);
        height: 100vh;
        padding: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;

        &-content {
            height: fit-content;
        }
    }

    &-img {
        min-height: 150vh;

        img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }

    .sticky {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
    }

    .rel {
        top: unset;
        bottom: 0;
    }
}
</style>
