import { ref } from 'vue'
import type { Ref } from 'vue'
import { Reservation } from '@/support';


export const reservation: Ref<Partial<Reservation>> = ref({});

