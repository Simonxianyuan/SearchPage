<template>
  <div style="padding:20px">
    <h2>PrimeVue DataTable - Server-side Pagination</h2>

    <input v-model="search" placeholder="Search name" style="margin-bottom:10px"/>

    <DataTable
      :value="users"
      :paginator="true"
      :rows="rowsPerPage"
      :totalRecords="totalRecords"
      :lazy="true"
      :loading="loading"
      :first="first" 
      @page="onPage"
      @sort="onSort"
      scrollable
      scrollHeight="600px"
    >
      <Column field="id" header="ID" style="width:100px" sortable/>
      <Column field="name" header="Name" sortable/>
      <Column field="position" header="Position" sortable/>
      <Column field="location" header="Location" sortable/>
      <Column field="age" header="Age" sortable/>
      <Column field="birthdate" header="Birthdate" sortable/>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { User } from '../types/User'
import * as api from '../apis/Userapi'

const users = ref<User[]>([])
const totalRecords = ref<number>(0)
const loading = ref(false)
const search = ref('')
const sortField = ref<string | null>(null)
const sortOrder = ref<number | null>(null)
const first = ref(0)
// 每頁筆數
const rowsPerPage = 500
const currentPage = ref(0) // 分頁索引，0-based

// 取得資料
async function loadPage(page: number, rows: number) {
  loading.value = true
  const first = page * rows
  const data = await api.fetchUsers(first, rows, sortField.value, sortOrder.value, search.value)
  users.value = data
  totalRecords.value = 10000000 // 模擬 1000萬筆總數
  loading.value = false
}

// 當換頁
async function onPage(event: any) {
  currentPage.value = event.page
  await loadPage(event.page, event.rows)
}

// 當排序
async function onSort(event: any) {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
    // 重新設定 paginator 位置
  first.value = currentPage.value * rowsPerPage
  await loadPage(currentPage.value, rowsPerPage)
}
onMounted(() => {
  loadPage(0, rowsPerPage)
})
</script>