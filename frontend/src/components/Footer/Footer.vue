<script setup>
import { ref, onMounted } from 'vue';
import content from '@/siteContent/_footer-content.json';
const footer_cols = ref([]);

const fetchData =  () => {
    footer_cols.value = content;
}


onMounted(fetchData);

</script>

<template>
    <footer class="FooterWrapper">
        <div class="Footer frame">
            <div class="Footer-col" v-for="col in footer_cols">
                <h3 class="Footer-col-heading">{{ col.footerColHeading }}</h3>
                <ul class="Footer-col-links">
                    <li class="FooterColItem" v-for="link in col.footerColLinks">
                        <router-link class="FooterColItem-link" :to="link.link">
                        {{ link.text }}
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<style scoped lang="scss">
.FooterWrapper{
    background: var(--baseRed);
}
.Footer{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    min-height: 25dvh;


    &-col{
        padding-left: 3rem;
        &-heading{
            color: white;
            font-size: 2rem;
        }

        &-links{
            padding: 0;
            width: 100%;
        }
    }
    //border-bottom: 1px solid black;
}
.FooterColItem{
    text-decoration: none;
    list-style: none;

    &-link{
        font-size: 1.5rem;
        color: #c0c0c0;
        text-decoration: none;
        transition: all 0.2s linear;


        &:hover{
            color: #fff;
            padding-left: 1rem;
            text-transform: uppercase;
        }
    }
}
.copyright{
    display: flex;
    width: 90%;
    padding: 0 5%;
    height: 4rem;
    background: #1d1d1d;
    border-top: 0.25rem solid rgb(0, 255, 200);
    color: #d1d1d1;
    justify-content: space-between;
    align-items: center;
}
</style>
