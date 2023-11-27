<script>
import StickyText from './Item/StickyText.vue';
export default{
    components: {
        StickyText
    }
}
</script>

<template>
<section class="StyledText-wrapper">
    <StickyText 
        :id = 0
    />
    <StickyText :id = 1 />
    <StickyText :id = 2 />
</section>
</template>

<style scoped lang="scss">
.StickyText-wrapper{
    .StickyText{

        &:nth-of-type(2n){
            flex-direction: row-reverse;
        }
    }
}
</style>
