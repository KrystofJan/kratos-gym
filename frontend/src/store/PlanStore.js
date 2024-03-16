import { ref } from 'vue';
import userId  from './userStore';

const Plan = ref({
    PlanName: '',
    UserId: userId.value
});

export default Plan;