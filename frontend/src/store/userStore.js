import { useStorage } from '@vueuse/core';

const userId = useStorage('userId');

export default userId;