import { ref } from 'vue';
import userId  from './userStore';

const Plan = ref({
    PlanName: String(),
    UserId: userId.value
});

export default Plan;