<script>
export default{
    data(){
        return{
            footer_cols: {}
        }
      },
      created() {
          fetch("../../siteContent/_footer-content.json") 
              .then((res) => res.json())
              .then((data) => this.footer_cols = data);
      } 
}

</script>

<template>
    <footer class="FooterWrapper">
        <div class="Footer">
            <!-- TODO Use v-for -->
            <!-- <div class="Footer-col" v-for="{fc in footer_cols}">{{fc}}</div> -->
            <div class="Footer-col">
                <h3 class="Footer-col-heading">{{ this.footer_cols[0].footerColHeading }}</h3>
                <ul class="Footer-col-links">
                    <!-- Pass into separate -->
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footerColLinks[0].link }}">
                        {{ this.footer_cols[0].footerColLinks[0].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footerColLinks[1].link }}">
                        {{ this.footer_cols[0].footerColLinks[1].text }}
                        </router-link>
                    </li>

                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footerColLinks[2].link }}">
                        {{ this.footer_cols[0].footerColLinks[2].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footerColLinks[3].link }}">
                        {{ this.footer_cols[0].footerColLinks[3].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footerColLinks[4].link }}">
                        {{ this.footer_cols[0].footerColLinks[4].text }}
                        </router-link>
                    </li>

                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footerColLinks[5].link }}">
                        {{ this.footer_cols[0].footerColLinks[5].text }}
                        </router-link>
                    </li>

                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footerColLinks[6].link }}">
                        {{ this.footer_cols[0].footerColLinks[6].text }}
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="Footer-col">
                <h3 class="Footer-col-heading">{{ this.footer_cols[1].footerColHeading }}</h3>
                <ul class="Footer-col-links">
                    <!-- Pass into separate -->
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[1].footerColLinks[0].link }}">
                        {{ this.footer_cols[1].footerColLinks[0].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[1].footerColLinks[1].link }}">
                        {{ this.footer_cols[1].footerColLinks[1].text }}
                        </router-link>
                    </li>
                </ul>
            </div>

            <div class="Footer-col">
                <h3 class="Footer-col-heading">{{ this.footer_cols[2].footerColHeading }}</h3>
                <ul class="Footer-col-links">
                    <!-- Pass into separate -->
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[2].footerColLinks[0].link }}">
                        {{ this.footer_cols[2].footerColLinks[0].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[2].footerColLinks[1].link }}">
                        {{ this.footer_cols[2].footerColLinks[1].text }}
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            <div class="col">All rights reserved c2048</div>
            <div class="col">Site made by Jan-Krystof Zahradnik</div>
            <div class="col">Contact krystofjan.com for websites like this</div>
        </div>
    </footer>
</template>

<style scoped lang="scss">
// .FooterWrapper{
//     position: absolute;
//     bottom: 0;
//     width: 100%;
// }
.Footer{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    background: #2d2d2d;
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
