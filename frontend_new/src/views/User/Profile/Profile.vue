<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { SignedIn, SignedOut, useUser } from 'vue-clerk'
import { currentAccount, fetchAccount } from "../../../store/accountStore";

const isLoading = ref(true);
const loadMessage = ref('Loading...')
const { user, isLoaded: isUserLoaded } = useUser();

const roleDictionary = {
    "c": "Customer",
    "t": "Trainer",
    "e": "Employee"
};

const loadAccount = async () => {
    if (!currentAccount.value && user.value) {
        try {
            await fetchAccount(user.value.id);
        } catch (error) {
            loadMessage.value = 'Error fetching data';
            console.error('Error fetching data:', error);
        }
    }
    isLoading.value = false;
};

onMounted(async () => {
    if (isUserLoaded.value) {
        await loadAccount();
    }
});

watch(isUserLoaded, (newValue) => {
    if (newValue) {
        loadAccount();
    }
});
</script>

<template>
    <SignedOut>
        <div class="ErrorMessage ErrorMessage--notLogedIn MarginedComponent">
            You need to be logged in !
        </div>
    </SignedOut>
    <SignedIn>
        <div v-if="isLoading" class="Loading MarginedComponent">
            {{ loadMessage }}
        </div>
        <div v-else-if="currentAccount" class="Profile MarginedComponent">
            <h1>Profile</h1>
            <div class="ProfileInfo">
                <div :class="{ 'active': currentAccount.IsActive }" class="ProfileInfo-picture">
                    <img :src="user.imageUrl" alt="profilePic" width="64" height="64" />
                </div>
                <div class="ProfileInfo-contact">
                    <h2>Contact Info</h2>
                    Email:
                    {{ currentAccount.Email }} <br />
                    Phone:
                    {{ currentAccount.PhoneNumber }} <br />
                </div>
                <div class="ProfileInfo-name">
                    <h2>Main info</h2>
                    First name:
                    {{ currentAccount.FirstName }} <br />
                    Last Name:
                    {{ currentAccount.LastName }}
                </div>
                <div class="ProfileInfo-other">
                    <h2>Other</h2>
                    Role:
                    {{ roleDictionary[currentAccount.Role] || 'Unknown' }} <br />
                </div>
            </div>
            <div class="Helper">
                {{ currentAccount }}
            </div>
        </div>
        <div v-else class="ErrorMessage MarginedComponent">
            Failed to load account data.
        </div>
    </SignedIn>
</template>
<style lang="scss" scoped>
.Loading {
    color: white;
    text-align: center;
    font-size: 3rem;
}

.Helper {
    display: none;
}

.Profile {
    color: white;
    width: 75%;


    &Info {
        display: grid;
        grid-template-columns: 10rem 1fr;

        &-picture {
            display: flex;
            position: relative;
            justify-content: center;
            align-items: center;
            width: 10rem;
            height: 10rem;
            align-self: center;
            margin: auto;


            &.active {

                &:after {
                    content: '';
                    position: absolute;
                    top: 1rem;
                    right: 0rem;
                    width: 1.5rem;
                    height: 1.5rem;
                    background: var(--baseBlue);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1;
                }
            }

            img {
                width: 100%;
                height: auto;
                border-radius: 50%;
                ;
            }

        }

    }
}

.ErrorMessage {
    color: var(--baseRed);
    display: block;
    padding: 1rem 2rem;
    width: fit-content;
    border: 1px solid var(--baseRed);
    border-radius: .5rem;
    box-shadow: inset 0 0 10px var(--baseRed);
}
</style>
