import {ref, watch} from 'vue';

export default function(initValue, key){
    const val = ref(initValue);

    const storageValue = localStorage.getItem(key);

    if (storageValue){
        val.value = JSON.parse(storageValue);
    }

    watch(val, val => {
        localStorage.setItem(key, value);
    });
    
    return val;
}