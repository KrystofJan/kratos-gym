<script>
export default{
    data(){
        return{
            footer: () => {
                
                
                return 1;
            },
            footer_cols: [
                {
                    footer_col_heading: 'Menu', 
                    footer_col_links: 
                    [
                        {
                            text: 'Home',
                            link: '/'
                        },
                        {
                            text: 'Reservations',
                            link: '/reservations'
                        },
                        {
                            text: 'About us',
                            link: '/about-us'
                        },
                        {
                            text: 'Contacts',
                            link: '/contacts'
                        },
                        {
                            text: 'icon',
                            link: '/'
                        },
                        {
                            text: 'icon',
                            link: '/'
                        },
                        {
                            text: 'icon',
                            link: '/'
                        }
                    ]
                },
                {
                    footer_col_heading: 'Contacts', 
                    footer_col_links: 
                    [
                        {
                            text: 'email: info@kratos.com',
                            link: '/'
                        },
                        {
                            text: 'phone: +420 777 888 999',
                            link: '/'
                        },
                    ]
                },
                {
                    footer_col_heading: 'Client section', 
                    footer_col_links: 
                    [
                        {
                            text: 'GDPR',
                            link: '/'
                        },
                        {
                            text: 'Cookies',
                            link: '/'
                        },
                    ]
                }
            ]
        };
    }
}

</script>

<template>
    <footer class="FooterWrapper">
        <div class="Footer">
            <!-- TODO Use v-for -->
            <!-- <div class="Footer-col" v-for="{fc in footer_cols}">{{fc}}</div> -->
            <div class="Footer-col">
                <h3 class="Footer-col-heading">{{ this.footer_cols[0].footer_col_heading }}</h3>
                <ul class="Footer-col-links">
                    <!-- Pass into separate -->
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footer_col_links[0].link }}">
                        {{ this.footer_cols[0].footer_col_links[0].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footer_col_links[1].link }}">
                        {{ this.footer_cols[0].footer_col_links[1].text }}
                        </router-link>
                    </li>

                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footer_col_links[2].link }}">
                        {{ this.footer_cols[0].footer_col_links[2].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footer_col_links[3].link }}">
                        {{ this.footer_cols[0].footer_col_links[3].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footer_col_links[4].link }}">
                        {{ this.footer_cols[0].footer_col_links[4].text }}
                        </router-link>
                    </li>

                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footer_col_links[5].link }}">
                        {{ this.footer_cols[0].footer_col_links[5].text }}
                        </router-link>
                    </li>

                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[0].footer_col_links[6].link }}">
                        {{ this.footer_cols[0].footer_col_links[6].text }}
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="Footer-col">
                <h3 class="Footer-col-heading">{{ this.footer_cols[1].footer_col_heading }}</h3>
                <ul class="Footer-col-links">
                    <!-- Pass into separate -->
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[1].footer_col_links[0].link }}">
                        {{ this.footer_cols[1].footer_col_links[0].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[1].footer_col_links[1].link }}">
                        {{ this.footer_cols[1].footer_col_links[1].text }}
                        </router-link>
                    </li>
                </ul>
            </div>

            <div class="Footer-col">
                <h3 class="Footer-col-heading">{{ this.footer_cols[2].footer_col_heading }}</h3>
                <ul class="Footer-col-links">
                    <!-- Pass into separate -->
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[2].footer_col_links[0].link }}">
                        {{ this.footer_cols[2].footer_col_links[0].text }}
                        </router-link>
                    </li>
                    <li class="FooterColItem">
                        <router-link class="FooterColItem-link" to="{{ this.footer_cols[2].footer_col_links[1].link }}">
                        {{ this.footer_cols[2].footer_col_links[1].text }}
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
