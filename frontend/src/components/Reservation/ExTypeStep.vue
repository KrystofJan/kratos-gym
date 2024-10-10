<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';
import { BaseService } from '@/services/base/ApiService';
import Step from './Step.vue';

import PlanType from '@/store/PlanTypeStore.js';

const Types = ref([]);

let TypeService = {};

const prepareServices = () => {
    TypeService = new BaseService('exercise-type');
}

const fetchData = async () => {
    try {
        const typeData = await TypeService.baseGetAll();
        console.log(typeData)
        Types.value = typeData;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const builderText = ref({
    heading: 'Now Pick types of workout that are contained here',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});

onMounted(async () => {
    prepareServices();
    await fetchData();
});
</script>

<template>
    <Step :builderText="builderText" :builderItemClasses="'BuilderItemGrid'">
        <div class="BuilderItem-type" v-for="ex_type in Types">
            <input type="checkbox" :name="'type-' + ex_type.ExerciseTypeId" :id="'type-' + ex_type.ExerciseTypeId"
                :value="ex_type.ExerciseTypeId" v-model="PlanType.ExerciseTypeIds">
            <label :for="'type-' + ex_type.ExerciseTypeId">{{ ex_type.ExerciseTypeName }}</label>
        </div>
    </Step>
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

[data-plan-name] {
    grid-column: 1/-1;
}
</style>
