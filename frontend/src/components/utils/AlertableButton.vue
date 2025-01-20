<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components'
interface Props {
    alertTitle: string
    alertText: string
    alertTriggerText: string
    alertButton: string
}

const props = defineProps<Props>()

</script>

<template>
  <AlertDialog>
    <AlertDialogContent>
      <AlertDialogHeader>
      <AlertDialogTitle>{{alertTitle}}</AlertDialogTitle>
        <AlertDialogDescription>
            {{alertText}}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction>
            {{ alertButton }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
