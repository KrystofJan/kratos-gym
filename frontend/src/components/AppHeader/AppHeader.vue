<script setup>
    import {
        ref
    } from 'vue';
    const showLog = ref(false);


    const toggleMenu = () => {
        const menu = document.querySelector('.NavMenu');
        const hamburger = document.querySelector('.hamburger');

        menu.classList.toggle('show-menu');
        hamburger.classList.toggle('active');
    }
</script>

<template>
    <header>
        <div id="header">
            <img src="../../assets/logo.svg" alt="KratosGym logo">
        </div>
        <div class="hamburgerWrapper">
            <svg class="hamburger" viewBox="0 0 100 100" width="80" @click="toggleMenu()">
                <path class="line top"
                    d="m 70,33 h -40 c -11.092231,0 11.883874,13.496726 -3.420361,12.956839 -0.962502,-2.089471 -2.222071,-3.282996 -4.545687,-3.282996 -2.323616,0 -5.113897,2.622752 -5.113897,7.071068 0,4.448316 2.080609,7.007933 5.555839,7.007933 2.401943,0 2.96769,-1.283974 4.166879,-3.282995 2.209342,0.273823 4.031294,1.642466 5.857227,-0.252538 v -13.005715 16.288404 h 7.653568" />
                <path class="line middle"
                    d="m 70,50 h -40 c -5.6862,0 -8.534259,5.373483 -8.534259,11.551069 0,7.187738 3.499166,10.922274 13.131984,10.922274 11.021777,0 7.022787,-15.773343 15.531095,-15.773343 3.268142,0 5.177031,-2.159429 5.177031,-6.7 0,-4.540571 -1.766442,-7.33533 -5.087851,-7.326157 -3.321409,0.0092 -5.771288,2.789632 -5.771288,7.326157 0,4.536525 2.478983,6.805271 5.771288,6.7" />
                <path class="line bottom"
                    d="m 70,67 h -40 c 0,0 -3.680675,0.737051 -3.660714,-3.517857 0.02541,-5.415597 3.391687,-10.357143 10.982142,-10.357143 4.048418,0 17.88928,0.178572 23.482143,0.178572 0,2.563604 2.451177,3.403635 4.642857,3.392857 2.19168,-0.01078 4.373905,-1.369814 4.375,-3.392857 0.0011,-2.023043 -1.924401,-2.589191 -4.553571,-4.107143 -2.62917,-1.517952 -4.196429,-1.799562 -4.196429,-3.660714 0,-1.861153 2.442181,-3.118811 4.196429,-3.035715 1.754248,0.0831 4.375,0.890841 4.375,3.125 2.628634,0 6.160714,0.267857 6.160714,0.267857 l -0.178571,-2.946428 10.178571,0 -10.178571,0 v 6.696428 l 8.928571,0 -8.928571,0 v 7.142858 l 10.178571,0 -10.178571,0" />
            </svg>
        </div>
        <nav class="NavMenu frame">
            <ul class="NavMenu-item NavMenu-list NavMenu-menu">
                <li class="NavMenu-list-item">
                    <router-link to="/" class="menu-link" @click="toggleMenu()" >Home</router-link>
                </li>
                <li class="NavMenu-list-item">
                    <router-link to="/reservations" class="menu-link" @click="toggleMenu()">Reservations</router-link>
                </li>
                <li class="NavMenu-list-item">
                    <router-link to="/about-us" class="menu-link" @click="toggleMenu()">About us</router-link>
                </li>
                <li class="NavMenu-list-item">
                    <router-link to="/contacts" class="menu-link" @click="toggleMenu()">Contacts</router-link>
                </li>
            </ul>
            <div class="NavMenu-item NavMenu-logo">
                <img src="../../assets/logo.svg" alt="KratosLogo" height="35">
            </div>
            <ul class="NavMenu-item NavMenu-list NavMenu-iconMenu">
                <li class="NavMenu-list-item NavMenu-iconMenu-item">
                    <router-link to="/" class="menu-link" @click="toggleMenu()">icon</router-link>
                </li>
                <li class="NavMenu-list-item NavMenu-iconMenu-item">
                    <router-link to="/" class="menu-link" @click="toggleMenu()">icon</router-link>
                </li>
                <li class="NavMenu-list-item NavMenu-iconMenu-item" @click="showLog=!showLog">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                        <path
                            d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                        </svg>
                    <ul v-if="showLog" class="NavMenu-login-dropdown">
                        <li>
                            <router-link to="/log-in" class="menu-link" @click="toggleMenu()">Log in</router-link>
                        </li>
                        <li>
                            <router-link to="/register" class="menu-link" @click="toggleMenu()">Register</router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped lang="scss">
    #header {
        width: 100%;
        background: linear-gradient(to right, #aeaeae, #e2e2e2, #aeaeae);

        img {
            color: #2d2d2d;
            padding: 1rem;
            font-size: 3rem;
            display: block;
            text-align: center;
            margin: 0 auto;
        }
    }

    .hamburgerWrapper{
        background-color: rgba(255,255,255,.3);
        position: fixed;
        right: 1rem;
        top: 1rem;
        z-index: 99999999999;
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1rem;
        width: 4rem;
        transition: .2s ease-in-out;

        &:hover{
            background-color: rgba(255,255,255,.7);
        }

        &:has(.active){
            background-color: rgba(0,0,0,.3);

            &:hover{
                background-color: rgba(0,0,0,.9);
            }
        }

        @media(min-width: 1050px) {
            display: none;
        }
    }

    .hamburger {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: transform 400ms;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;

        &Rotate {

            &.active {
                transform: rotate(45deg);
            }

            &180.active {
                transform: rotate(180deg);
            }
        }

        &.active {
            .line {
                stroke: white;
            }

            .top {
                stroke-dasharray: 75 130;
                stroke-dashoffset: -63px;
            }

            .bottom {
                stroke-dasharray: 110 205;
                stroke-dashoffset: -86px;
            }

            .middle {
                stroke-dashoffset: -102px;
            }
        }

        .line {
            fill: none;
            transition: stroke-dasharray 400ms, stroke-dashoffset 400ms, stroke 400ms;
            stroke: #000;
            stroke-width: 5.5;
            stroke-linecap: round;
        }

        .top {
            stroke-dasharray: 40 130;
        }

        .middle {
            stroke-dasharray: 40 140;
        }

        .bottom {
            stroke-dasharray: 40 205;
        }

    }

    .NavMenu {
        display: grid;
        height: 6rem;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        position: relative;
        transition: 0.2s ease-in-out;
        grid-template-columns: repeat(3, 1fr);
        align-content: center;

        &.show-menu {
            opacity: 1;
            visibility: visible;
        }

        @media (max-width: 1050px) {
            grid-template-columns: 1fr;
            position: fixed;
            opacity: 0;
            visibility: hidden;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 999;
            justify-content: center;
            background: rgba(33, 33, 33, 0.9);
        }

        &-logo {
            opacity: 0;
            transition: all .2s ease-in-out;

            @media (max-width: 1050px) {
                display: none;
            }
        }

        &-login-dropdown {
            position: absolute;
            background: red;
            bottom: 0;
            right: 0;
            transform: translateY(100%);
            list-style-type: none;
            z-index: 999;
        }

        &-list {
            display: flex;
            justify-content: stretch;
            padding: 0;

            &-item {
                list-style: none;
                display: inline-block;
                padding: 1.25rem;
                cursor: pointer;

                .menu-link {
                    color: blue;
                    text-decoration: none;
                    display: block;
                    width: 100%;
                    height: 100%;

                    @media (max-width: 1050px) {
                        color: #e2e2e2;
                        font-size: 2rem;
                        font-weight: 100;
                    }
                }
            }
        }

        &-item {
            text-align: center;
        }

        &-menu {
            justify-content: flex-start;

            @media (max-width: 1050px) {
                flex-direction: column;
            }
        }

        &-iconMenu {
            justify-content: flex-end;

            @media (max-width: 1050px) {
                justify-content: center;
            }
        }
    }

    .sticky {
        position: fixed;
        top: 0;
        left: 0;
        opacity: .9;
        z-index: 99999;
        background: white;
        height: 4rem;
        transition: .2s all ease-in-out;


        &:hover {
            opacity: 1;

            @media (min-width: 1051px) {
                height: 6rem;
            }
        }

        .NavMenu-logo {
            opacity: 1;
        }

        @media (max-width: 1050px) {
            background: rgba(33, 33, 33, 0.9);
            height: 100vh;
        }
    }
</style>