<script lang="ts" setup>
import { VDataTable } from 'vuetify/labs/components'
import Swal from "sweetalert2";

definePageMeta({ middleware: ["auth"] });
const { getProcessBy, deleteProcessBy } = useProcess();
const { $auth } = useNuxtApp()
const { permission_add, permission_delete, permission_edit } = $auth.getPermission('process')

type Headers = InstanceType<typeof VDataTable>['headers']

const headers: Headers = [
  { title: "...", key: "operation", sortable: false, width: 50, align: 'center' },
  { title: "#", key: "no", sortable: false, width: 80, align: 'center' },
  { title: "รหัสโปรเซทงาน", key: "process_id", sortable: false, width: 200, },
  { title: "ชื่อโปรเซทงาน", key: "process_name", sortable: false },
];
const columns: any[] = [
  { value: "process_id", title: "รหัสโปรเซทงาน", },
  { value: "process_name", title: "ชื่อโปรเซทงาน", },
];
const conditions: any[] = [
  { title: 'มี', value: 'LIKE' },
  { title: 'เริ่มต้นด้วย', value: '_LIKE' },
  { title: 'ลงท้ายด้วย', value: 'LIKE_' },
  { title: 'เท่ากับ', value: 'Equel' },
  { title: 'ไม่มี', value: 'Not' },
  { title: 'ไม่เท่ากับ', value: 'Not_equel' },
];
const pagination = ref({
  page: 1,
  size: 20,
})
const search = ref<{
  is_show: boolean,
  text: string,
  columns: string[],
  condition: string,
}>({
  is_show: false,
  text: '',
  columns: [],
  condition: 'LIKE',
});

const {
  data: processs,
  pending: pendingProcesss,
  refresh: refreshProcesss,
} = await useAsyncData('processs', () => getProcessBy({ pagination: pagination.value, search: search.value }), { watch: [pagination.value] })

const onDelete = (id: string) => Swal.fire({
  title: "ยืนยันการลบรายการ",
  text: "คุณแน่ใจหรือว่าต้องการลบ ?",
  icon: "warning",
  showCancelButton: true,
}).then(async ({ value }) => {
  try {
    if (!value) return

    await deleteProcessBy({ process_id: id })
    refreshProcesss()
    void Swal.fire({ title: 'สำเร็จ', text: 'ลบข้อมูลแล้ว', icon: "success" })
  } catch (e) {
    console.log(e)
  }
})

function submitSearch(e: FormDataEvent) {
  e.preventDefault()
  refreshProcesss()
}

const clearSearch = () => {
  search.value = {
    is_show: false,
    text: '',
    columns: [],
    condition: 'LIKE',
  }

  refreshProcesss()
};

const confirmSearch = () => {
  search.value.is_show = false
  refreshProcesss()
};
</script>

<template>
  <v-card elevation="10" class="withbg mx-auto" color="grey-lighten-3" max-width="1980">
    <v-card-title>โปรเซทงาน</v-card-title>
    <v-card-item>
      <v-row class="mb-4">
        <v-col class="d-flex flex-wrap gap-2 align-center py-2" cols="12" md="4">
          <template v-if="permission_add">
            <v-btn elevation="3" color="primary" to="/process/add">เพิ่มรายการใหม่</v-btn>
          </template>
        </v-col>
        <v-col class="d-flex flex-wrap gap-2 align-center justify-md-end py-2" cols="12" md="8">
          <form class="d-flex flex-wrap gap-2" :onsubmit="submitSearch">
            <v-text-field v-model="search.text" label="Search..." append-inner-icon="mdi-magnify" density="compact"
              variant="outlined" hide-details style="width: 500px" @click:append-inner="refreshProcesss()"></v-text-field>
          </form>
          <v-menu v-model="search.is_show" :close-on-content-click="false">
            <template v-slot:activator="{ isActive, props }">
              <v-icon v-if="isActive" v-bind="props">mdi-close</v-icon>
              <v-icon v-else v-bind="props" color="primary">mdi-filter</v-icon>
            </template>
            <v-list :width="250">
              <v-list-item>
                <v-list-item-title class="pt-2">
                  <v-select v-model="search.columns" :items="columns" label="คอลัมน์" multiple chips density="compact"
                    variant="outlined"></v-select>
                  <v-select v-model="search.condition" :items="conditions" label="ค้นหาแบบมีเงื่อนไข" density="compact"
                    variant="outlined"></v-select>
                </v-list-item-title>
                <div class="d-flex flex-wrap gap-2 justify-end">
                  <v-btn color="muted" @click="clearSearch()">ล้าง</v-btn>
                  <v-btn color="primary" @click="confirmSearch()">ตกลง</v-btn>
                </div>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <v-data-table-server :loading="pendingProcesss" :headers="headers" :items="processs?.docs ?? []"
        :items-length="processs?.totalDocs ?? 0" :items-per-page="pagination.size" :page="pagination.page"
        @update:items-per-page="e => pagination.size = e" @update:page="e => pagination.page = e">
        <template v-slot:item.no="{ index }">{{ pageItemNo(pagination, index) }}</template>
        <template v-slot:item.operation="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-label class="cursor-pointer" icon v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-label>
            </template>
            <v-list>
              <v-list-item class="cursor-pointer" density="compact"
                :to="{ path: '/process/detail', query: { id: item.raw.process_id } }">
                <v-list-item-title>
                  <v-icon> mdi-chat-processing-outline</v-icon> ดูรายละเอียด
                </v-list-item-title>
              </v-list-item>
              <template v-if="permission_edit">
                <v-list-item class="cursor-pointer" density="compact"
                  :to="{ path: '/process/update', query: { id: item.raw.process_id } }">
                  <v-list-item-title>
                    <v-icon> mdi-square-edit-outline</v-icon> แก้ไข
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-if="permission_delete">
                <v-list-item class="cursor-pointer" density="compact" @click="onDelete(item.raw.process_id)">
                  <v-list-item-title>
                    <v-icon> mdi-trash-can-outline</v-icon> ลบ
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </template>
      </v-data-table-server>
    </v-card-item>
  </v-card>
</template>