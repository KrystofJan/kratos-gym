<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
import { SignedIn, SignedOut, useUser } from 'vue-clerk'
import { currentAccount, fetchAccount } from "../../../store/accountStore";
import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/ui/alert'
import { Progress } from '@/components/shadcn/ui/progress'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/ui/card'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/shadcn/ui/avatar/'

const isLoading = ref(true);
const error = ref(false)
const progressAmount = ref(0)
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
            console.log(currentAccount.value)
            progressAmount.value = 100
        } catch (error) {
            error.value = true;
            console.error('Error fetching data:', error);
        }
    }
    isLoading.value = false;
};

// NOTE: Maybe not this, but it looks a bit better
watchEffect((cleanupFn) => {
    const timer = setInterval(() => {
        if (progressAmount.value < 90) {
            progressAmount.value += 10
        }

    }, 100)
    cleanupFn(() => clearTimeout(timer))
})

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
        <Alert>
            <Terminal class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                You need to be logged in !
            </AlertDescription>
        </Alert>
        <div class="ErrorMessage ErrorMessage--notLogedIn MarginedComponent">
        </div>
    </SignedOut>
    <SignedIn>
        <div v-if="isLoading" class="Loading MarginedComponent">
            <Progress v-if="!error" v-model="progressAmount" class="w-3/5 m-auto " />
        </div>
        <div v-else-if="currentAccount" class="Profile MarginedComponent">
            <Card class="max-w-96">
                <CardHeader class="grid grid-cols-2 gap-4 content-center">
                    <Avatar class="w-32 h-32">
                        <AvatarImage :src="currentAccount.ProfilePictureUrl" alt="@radix-vue" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div class="align-middle h-fit w-fit my-auto">
                        <CardTitle>
                            {{ `${currentAccount.FirstName} ${currentAccount.LastName}` }}
                        </CardTitle>
                        <CardDescription>{{ roleDictionary[currentAccount.Role] }}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul>
                        <li>Phone: {{ currentAccount.Phone ?? "-" }}</li>
                        <li>Email: {{ currentAccount.Email }}</li>
                        <li>Joinded on: {{ currentAccount.CreateDate.split("T")[0] }}</li>
                        <li>Last online: {{ currentAccount.LastOnline.split("T")[0] }}</li>
                        <li>Credits: {{ currentAccount.Credits }}</li>
                        <li>Address:
                            {{ `${currentAccount.Address.Street} ${currentAccount.Address.BuildingNumber}
                            ${currentAccount.Address.City}` }}</li>
                    </ul>
                </CardContent>


            </Card>
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
