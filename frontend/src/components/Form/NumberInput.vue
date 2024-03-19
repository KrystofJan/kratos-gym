<script setup>
import {ref, defineProps, onMounted, watch, defineEmits } from 'vue';

const props = defineProps({
    max: Number,
    min: Number,
    id: String,
    name: String,
    customClass: String,
    required: false,
});

const emit = defineEmits(['value-change']);

const Value = ref(Number);
const MaxError = ref(false);
const Error = ref(false);
const MinError = ref(false);

const handleChange = () => {
    emit('value-change', Value.value);
    validateNumberRange();
}

const validateNumberRange = () => {
    console.log("hihihi");
    if(Value.value > props.max){
        MaxError.value = true;
        Error.value = true;
        return;
    }
    if(Value.value < props.min){
        MinError.value = true;
        Error.value = true;
        return;
    }
    else {
        Error.value = false;
    }
}
// TODO: Change Error.value if any of other errors are present
// TODO: Do that but watch / compute
</script>

<template>
    <input  
        type="number" 
        :max="max" :min="min" 
        :id="id" 
        :name="name"
        class="BaseNumberInput"
        :class="{
            'Error': Error,
            customClass: customClass
            }"
        @input="handleChange"
        v-model="Value"
        :required="required">
</template>

<style lang="scss">
@import './NumberInput.scss';
.Error{
    background: rgba(red, .5);
}
</style>