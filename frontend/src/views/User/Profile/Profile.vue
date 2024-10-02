<script setup>
import { onMounted, ref, computed } from 'vue';
import { BaseService } from '@/services/base/ApiService';
import { SignedIn, SignedOut, useUser } from 'vue-clerk'

const UserInfo = ref({});
const isLoading = ref(true);
const loadMessage = ref('Loading...')
const { user } = useUser();

const roleDictionary = {
    "c": "Customer",
    "t": "Trainer",
    "e": "Employee"
};

const isActive = computed(() => {
    return (isLogedIn && UserInfo.value.IsActive == "1");
})
// add to service
const fetchData = async () => {
    try {
        console.log(user)
        const res = await fetch(`http://api.kratos.dev/api/account/clerk/${user.clerkId}`)
        UserInfo.value = await res.json();
    } catch (error) {
        loadMessage.value = 'Error fetching data';
        console.error('Error fetching data:', error);
    }
}

onMounted(async () => {
    fetchData();
})
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
        <div v-else class="Profile MarginedComponent">
            <h1>Profile</h1>

            <div class="ProfileInfo">
                <div :class="{ 'active': isActive }" class="ProfileInfo-picture">
                    <span>
                        {{ UserInfo.FirstName[0] + UserInfo.LastName[0] }}
                    </span>
                </div>
                <div class="ProfileInfo-contact">
                    <h2>Contact Info</h2>

                    Email:
                    {{ UserInfo.Email }} <br />
                    Phone:
                    {{ UserInfo.PhoneNumber }} <br />
                </div>
                <div class="ProfileInfo-name">
                    <h2>Main info</h2>

                    First name:
                    {{ UserInfo.FirstName }} <br />
                    Last Name:
                    {{ UserInfo.LastName }}
                </div>
                <div class="ProfileInfo-other">
                    <h2>Other</h2>
                    Role:
                    {{ roleDictionary[UserInfo.Role] }} <br />

                </div>
            </div>
            <div class="Helper">
                {{ UserInfo }}

            </div>
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
            justify-content: center;
            align-items: center;
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            background: var(--baseRed);
            align-self: center;
            margin: auto;


            &.active {
                background: var(--baseBlue);
            }

            span {
                font-size: 1.5rem;
                line-height: 1.5rem;
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
