import { ref } from 'vue';
import userId from './userStore';


export const Reservation = ref({
    AmmoutOfPeople: Number(),
    WrkOutPlanId: Number(),
    ReservationTime: String(),
    CustomerId: userId.value,
});

export default Reservation;
