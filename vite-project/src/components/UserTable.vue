<template>
  <div class="p-4">
    <div class="flex flex-col gap-3">
      <!-- 第一排 -->
      <div
        class="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-3"
      >
        <div class="flex items-center gap-2 w-full">
          <span class="whitespace-nowrap">Name:</span>
          <InputText
            placeholder="Search by name"
            class="w-full"
            v-model="SearchInput.Name"
            @keyup.enter="onSearch()"
          >
          </InputText>
        </div>

        <div class="flex items-center gap-2 w-full">
          <span class="whitespace-nowrap">Position:</span>
          <InputText
            placeholder="Search by position"
               class="w-full"
            v-model="SearchInput.Position"
            @keyup.enter="onSearch()"
          >
          </InputText>
        </div>

        <div class="flex items-center gap-2 w-full">
          <span class="whitespace-nowrap">Location:</span>
          <InputText
            placeholder="Search by location"
               class="w-full"
            v-model="SearchInput.Location"
            @keyup.enter="onSearch()"
          >
          </InputText>
        </div>
      </div>

      <!-- 第二排 -->
      <div
        class="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-3 items-start lg:items-center"
      >
        <div class="flex items-center gap-2 w-full">
          <span class="whitespace-nowrap">Age:</span>
          <InputNumber
            :min="0"
            placeholder="Search by age"
               class="w-full"
            v-model="SearchInput.Age"
            @keyup.enter="onSearch()"
          >
          </InputNumber>
        </div>

        <div class="flex items-center gap-2 w-full">
          <span class="whitespace-nowrap">Birthdate:</span>
          <InputText
            type="date"
            placeholder="Search by birthdate"
               class="w-full"
            v-model="SearchInput.Birthdate"
            @keyup.enter="onSearch()"
          >
          </InputText>
        </div>

        <!-- Buttons -->
        <div class="flex gap-2 w-full lg:w-auto lg:ml-auto">
          <Button class="w-full sm:w-auto" label="Button" @click="onAdd()">
          </Button>
          <Button class="w-full sm:w-auto" label="Search" @click="onSearch()">
          </Button>
        </div>
      </div>
    </div>
    <div class="table-wrapper">
    
    <DataTable
      ref="dt"
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
      :virtualScrollerOptions="{ itemSize: 40 }"
    >
      <Column field="id" header="ID" style="width: 100px" sortable />
      <Column field="name" header="Name" sortable />
      <Column field="position" header="Position" sortable />
      <Column field="location" header="Location" sortable />
      <Column field="age" header="Age" sortable />
      <Column field="birthdate" header="Birthdate" sortable />
      <Column header="Action">
        <template #body="slotProps">
        <div class="flex gap-2">
        
          <Button
          label="Edit"
            class="px-2 py-1 border rounded "
            @click="onEdit(slotProps.data)"
          >
            
          </Button>

          <Button
          label="Delete"
            class="px-2 py-1 border rounded"
            @click="onDelete(slotProps.data)"
          >
            
          </Button>
          <Button
          label="Sticky"
         @click="setSticky(slotProps.data)"
            class="px-2 py-1 border rounded"
          >   


          </Button>
          </div>
        </template>
      </Column>
    </DataTable>

  <div v-if="showstickyRow" class="sticky-overlay">
     <DataTable
      ref="dt"
      class="w-full"
      :value="stickyRow"
      :lazy="true"
      :loading="loading"
      :first="first"
    >
      <Column field="id" header="ID" style="width: 100px" sortable />
      <Column field="name" header="Name" sortable />
      <Column field="position" header="Position" sortable />
      <Column field="location" header="Location" sortable />
      <Column field="age" header="Age" sortable />
      <Column field="birthdate" header="Birthdate" sortable />
      <Column header="Action">
        <template #body="slotProps">
        <div class="flex gap-2">
        
          <Button
          label="Edit"
            class="px-2 py-1 border rounded "
            @click="onEdit(slotProps.data)"
          >
            
          </Button>

          <Button
          label="Delete"
            class="px-2 py-1 border rounded"
            @click="onDelete(slotProps.data)"
          >
            
          </Button>
          <Button
          label="Close"
         @click="showstickyRow = false"
            class="px-2 py-1 border rounded"
          >   


          </Button>
          </div>
        </template>
      </Column>
    </DataTable>

  </div>
  </div>
    <Dialog
      v-model:visible="editDialog"
      header="Edit User"
      modal
      :style="{ width: '400px' }"
    >
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <label>Name</label>
          <InputText v-model="editingUser.name" />
        </div>

        <div class="flex flex-col gap-1">
          <label>Position</label>
          <InputText v-model="editingUser.position" />
        </div>

        <div class="flex flex-col gap-1">
          <label>Location</label>
          <InputText v-model="editingUser.location" />
        </div>

        <div class="flex flex-col gap-1">
          <label>Age</label>
          <InputNumber v-model="editingUser.age" />
        </div>

        <div class="flex flex-col gap-1">
          <label>Birthdate</label>
          <InputText type="date" v-model="editingUser.birthdate" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="editDialog = false" />
        <Button label="Save" @click="saveEdit" />
      </template>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { User } from "../types/User";
import * as api from "../apis/Userapi";
import dayjs from "dayjs";
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
const dt = ref();
const editDialog = ref(false);
const editingUser = ref<User>({
  id: 0,
  name: "",
  position: "",
  location: "",
  age: 0,
  birthdate: "",
});
const SearchInput = ref({
  Name: "",
  Position: "",
  Location: "",
  Age: 0,
  Birthdate: "",
});
const users = ref<User[]>([]);
const totalRecords = ref<number>(0);
const loading = ref(false);
const sortField = ref<string | null>(null);
const sortOrder = ref<number | null>(null);
const first = ref(0);
// 每頁筆數
const rowsPerPage = 500;
const currentPage = ref(0); // 分頁索引，0-based

// 取得資料
async function loadPage(page: number, rows: number) {
  loading.value = true;
  const first = page * rows;
  const data = await api.fetchUsers(
    first,
    rows,
    sortField.value,
    sortOrder.value,
    SearchInput.value,
  );
  console.log("Fetched Data:", data);
  users.value = data;
  totalRecords.value = 10000000; // 模擬 1000萬筆總數
  loading.value = false;
}
const showstickyRow = ref(false);
const stickyRow = ref([] as User[]);
function setSticky(data: User) {
    showstickyRow.value = true;
    stickyRow.value = [data];
}
// 當換頁
async function onPage(event: any) {
  currentPage.value = event.page;
  console.log("Page Event:", event);
  await loadPage(event.page, event.rows);
}

// 當排序
async function onSort(event: any) {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
  // 重新設定 paginator 位置
  first.value = currentPage.value * rowsPerPage;
  await loadPage(currentPage.value, rowsPerPage);
}
async function onSearch() {
  // 搜尋時重置分頁
  //   currentPage.value = 0;
  //   first.value = 0;
  await loadPage(currentPage.value, rowsPerPage);
}
async function onAdd() {
  const res = await api.addUser({
    name: SearchInput.value.Name,
    position: SearchInput.value.Position,
    location: SearchInput.value.Location,
    age: SearchInput.value.Age ? parseInt(SearchInput.value.Age) : 0,
    birthdate: SearchInput.value.Birthdate
      ? dayjs(SearchInput.value.Birthdate).format("YYYY-MM-DD")
      : dayjs(new Date()).format("YYYY-MM-DD"),
  });
  console.log("Add User Response:", res);
  await loadPage(currentPage.value, rowsPerPage);
}

function onEdit(user: User) {
  editingUser.value = { ...user };
  editDialog.value = true;
}
async function saveEdit() {
  await api.updateUser(editingUser.value);

  editDialog.value = false;
  await loadPage(currentPage.value, rowsPerPage);
}
function onDelete(user: User) {
  confirm.require({
    message: `Are you sure you want to delete ${user.name}?`,
    header: "Delete Confirmation",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Delete",
    rejectLabel: "Cancel",

    accept: async () => {
      await api.deleteUser(user.id!);
      await loadPage(currentPage.value, rowsPerPage);
    },
  });
}
onMounted(() => {
  loadPage(0, rowsPerPage);
});
</script>
<style scoped>
.table-wrapper {
  position: relative;
}

.sticky-overlay {
  position: absolute;
  top: 120px;   /* header + 2 rows */
  left: 0;
  right: 0;
  height: 40px;
  display: flex;
  align-items: center;
  background: #fff9c4;
  border-bottom: 1px solid #ddd;
  z-index: 50;
}
.sticky-overlay :deep(.p-datatable-header),
.sticky-overlay :deep(.p-datatable-thead),
.sticky-overlay :deep(.p-datatable-scrollable-header) {
visibility: collapse;
}
</style>
