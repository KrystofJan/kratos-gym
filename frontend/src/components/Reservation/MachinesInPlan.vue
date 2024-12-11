<script setup lang="ts">
import {
    Machine,
    MachinesInPlan
} from '@/support'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/'

interface Props {
    machines: Machine[]
    machinesInPlan: MachinesInPlan[]
}
const props = defineProps<Props>()
const getCurrentMachineInPlan = (id: number | null) => {
    return props.machinesInPlan.filter(x => Number(x.MachineId) === Number(id))[0]
}
</script>
<template>
    asdasd
    <div v-for="(machine, index) in machines" :key="index">
        <Card>
            <CardHeader class="grid grid-cols-2 gap-4 items-center md:grid-cols-1">
                <CardTitle class="text-center md:text-left">
                    {{ machine.MachineName }}
                </CardTitle>
                <CardDescription class="text-center md:text-left">
                    {{ getCurrentMachineInPlan(machine.MachineId).Reps }} / {{
                        getCurrentMachineInPlan(machine.MachineId).Sets }}
                </CardDescription>
            </CardHeader>

            <CardContent class="flex gap-4 justify-between">
                <ul>
                    <li>
                        {{ getCurrentMachineInPlan(machine.MachineId).StartTime }} -
                        {{ getCurrentMachineInPlan(machine.MachineId).EndTime }}
                    </li>

                    <li>
                        <span v-for="(type, i) in machine.ExerciseTypes" :key="i">
                            {{ type.TypeName }}
                        </span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    </div>
</template>


<style></style>
