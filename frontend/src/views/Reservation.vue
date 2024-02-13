<script setup>
import { ref, onMounted } from 'vue';
import { getAll } from '../services/ReservationService';
import { post } from '../services/TestService';

const apiData = ref([]);

const myData = ref('');

const fetchData = async () => {
    try {
        const data = await getAll();
        apiData.value = data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const postData = async (body) => {
    try{
        const pst = await post(body);
        alert(pst);
    }
    catch{
        alert("noooo");
    }
}

const submit = async () => {
    await postData({'test': myData.value});
}

onMounted(async () => {
    await fetchData();
});

</script>

<template>
    <section class="ReservationForm">
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

        <div>
            <div class="FormItem">
                <label for="test">
                    Esketit:
                </label>
                <input type="text" name="test" id="test" v-model="myData">    
            </div>
            <div class="FormItem">
                <button @click="submit">Post</button>
            </div>
        </div>

    </section>

</template>

<style scoped>
.ReservationForm{
    background-color: white;
}

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