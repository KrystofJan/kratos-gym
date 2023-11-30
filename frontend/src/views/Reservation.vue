<script setup>
import { ref, onMounted } from 'vue';
const apiData = ref([]);

const fetchData = async () => {
    try {
    const response = await fetch('http://localhost:8080/api/reservations');
    const data = await response.json();
    apiData.value = data;
    } catch (error) {
    console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData();
});

</script>

<template>
<h1>res</h1>

<table>
    <tr>
        <th>Reservation Id</th>
        <th>Ammout of People</th>
        <th>ReservationTime</th>
        <th>Customer full name</th>
    </tr>
    <tr v-for="reservation in apiData">
        <td>
            {{ reservation.ReservationId }}
        </td>
        <td>
            {{ reservation.AmmoutOfPeople }}
        </td>
        <td>
            {{ reservation.ReservationTime }}
        </td>
        <td>
            {{ reservation.Customer.FirstName + " " + reservation.Customer.LastName }}
        </td>
    </tr>
</table>

</template>

<style scoped>
table{
    width: 100%;

}
th{
    border-bottom: 3px solid black;
}
td{
    text-align: center;
    padding: 1rem;
    /* border: 1px solid black; */
}
</style>