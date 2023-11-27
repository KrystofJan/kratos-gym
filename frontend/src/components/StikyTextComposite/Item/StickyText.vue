<script>
export default{
    props: [
        'id'
    ],
    created () {
        window.addEventListener('scroll', this.stickyScrollText);
    },
    unmounted () {
        window.removeEventListener('scroll', this.stickyScrollText);
    },
    methods: {
        stickyScrollText(){
            const comps = document.querySelector('.StickyText');
            const texts = document.querySelector('.StickyText-text');
            console.log(this.id)
            const comp = comps[this.id];
            const text = texts[this.id];

            console.log(comp);
            if (window.scrollY > comp.offsetTop && window.scrollY < comp.offsetTop + comp.offsetHeight - window.innerHeight){
                text.classList.add('sticky');
            }
            else{
                text.classList.remove('sticky');
            }
            if(window.scrollY > comp.offsetTop + comp.offsetHeight - window.innerHeight){
                text.classList.add('rel');
            }
            else{
                text.classList.remove('rel');
            }
        }
    }
}
</script>

<template>
    <article class="StickyText">
        <div class="StickyText-text">
            <div class="StickyText-text-content">
                <h2>Heading</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos aliquid quidem voluptates exercitationem cupiditate veritatis asperiores eveniet doloribus, earum, quod nihil accusamus nam quisquam, sequi et provident qui dolorum debitis!</p>
                <p>Incidunt inventore expedita porro, iste perferendis necessitatibus illum exercitationem cupiditate a quos mollitia sit alias minima velit, dolor culpa impedit cum cumque accusantium animi molestiae, recusandae laborum! Harum, sit quos?</p>
                <p>Et quia neque saepe. Et, reiciendis est at veniam amet officia? Laboriosam aliquam vero maxime consequatur officia, tempora reiciendis totam doloribus, odit voluptatem labore ipsam, quidem nihil culpa vel dicta?</p>    
            </div>
        </div>
        <div class="StickyText-img"></div>
    </article>
</template>

<style scoped lang="scss">
.StickyText{
    display: flex;
    background: black;
    z-index: 1;
    position: relative;

    &-text{
        width: 40%;
        background: white;
        height: 100vh;
        padding: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        
        &-content{
            background: red;
            height: fit-content;
        }
    }

    &-img{
        min-height:300vh;
    }
    .sticky{
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
    }
    .rel{
        position: absolute;
        bottom: 0;
    }
}
</style>
