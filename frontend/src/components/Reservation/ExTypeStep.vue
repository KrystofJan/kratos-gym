<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Step from '../Step.vue';
import { ExerciseType } from '@/support';

const Types = ref<ExerciseType[]>([])

const fetchData = async () => {
    try {

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const builderText = ref({
    heading: 'Now Pick types of workout that are contained here',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});

onMounted(async () => {
    await fetchData();
});
</script>

<template>
    <Step :builderText="builderText" :builderItemClasses="'BuilderItemGrid'">
        <div class="BuilderItem-type" v-for="(ex_type, _) in Types">
            <input type="checkbox" :name="'type-' + ex_type.ExerciseTypeId" :id="'type-' + ex_type.ExerciseTypeId"
                :value="ex_type.ExerciseTypeId">
            <label :for="'type-' + ex_type.ExerciseTypeId">{{ ex_type.TypeName }}</label>
        </div>
    </Step>
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

[data-plan-name] {
    grid-column: 1/-1;
}
</style>
