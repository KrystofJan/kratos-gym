<script setup lang="ts">
import { ref, onMounted } from 'vue'
import content from '@/siteContent/_footer-content.json'
import { Separator } from '@/components'
const footer_cols = ref<
  {
    footerColHeading: string
    footerColLinks: { text: string; link: string; external?: boolean }[]
  }[]
>([])

const fetchData = () => {
  footer_cols.value = content
}

onMounted(fetchData)
</script>

<template>
  <Separator />
  <footer class="py-8">
    <div class="mx-auto px-4 w-full">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[25vh]">
        <div
          v-for="col in footer_cols"
          :key="col.footerColHeading"
          class="pl-8"
        >
          <h3 class="text-2xl text-white mb-4">{{ col.footerColHeading }}</h3>
          <ul class="w-full">
            <li
              v-for="link in col.footerColLinks"
              :key="link.link"
              class="list-none"
            >
              <router-link
                :to="link.link"
                class="text-lg text-gray-400 hover:text-white hover:pl-4 hover:uppercase transition-all duration-200"
                v-if="!link.external"
              >
                {{ link.text }}
              </router-link>
              <a
                v-else
                :href="link.link"
                class="text-lg text-gray-400 hover:text-white hover:pl-4 hover:uppercase transition-all duration-200"
              >
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  <Separator />
  <div class="text-gray-400 py-4">
    <div class="mx-auto px-4 flex justify-between items-center">
      <p>&copy; {{ new Date().getFullYear() }} Kratos Gym</p>
      <p>All rights reserved</p>
    </div>
  </div>
</template>
