<script lang="ts" setup>
import { VDataTable } from 'vuetify/labs/components'
import Excel from 'exceljs';
import Swal from "sweetalert2";

import errorImage from "@/assets/images/error.png"

definePageMeta({ middleware: ["auth"] });

const { getUserBy, updatePasswordUserBy, deleteUserBy } = useUser();

const { $auth } = useNuxtApp()

const { permission_add, permission_delete, permission_edit, } = $auth.getPermission('user')

const { public: publicCtx } = useRuntimeConfig()

type Headers = InstanceType<typeof VDataTable>['headers']

const headers: Headers = [
  { title: "...", key: "operation", sortable: false, width: 50, align: 'center' },
  { title: "#", key: "no", sortable: false, width: 80, align: 'center' },
  { title: "รูป (ถ้ามี)", key: "user_img", sortable: false, width: 80, align: 'center' },
  { title: "รหัสพนักงาน", key: "user_id", sortable: false, width: 200, },
  { title: "ชื่อ-สกุล", key: "user_name", sortable: false },
  { title: "Email", key: "user_email", sortable: false, width: 200, },
  { title: "โทรศัพท์", key: "user_mobile", sortable: false, width: 150, align: 'center' },
  { title: "Username", key: "user_username", sortable: false, width: 150, align: 'center' },
  { title: "สิทธ์การใช้งาน", key: "license_name", sortable: false, width: 150, align: 'center' },
  { title: "สถานะ", key: "user_status", sortable: false, width: 80, align: 'center' },
];
const columns: any[] = [
  { value: "user_id", title: "รหัสพนักงาน", },
  { value: "user_name", title: "ชื่อ-สกุล", },
  { value: "user_email", title: "Email", },
  { value: "user_mobile", title: "โทรศัพท์", },
  { value: "user_username", title: "Username", },
  { value: "license_id", title: "สิทธ์การใช้งาน", },
  { value: "user_status", title: "สถานะ", }
];
const conditions: any[] = [
  { value: 'LIKE', title: 'มี', },
  { value: '_LIKE', title: 'เริ่มต้นด้วย', },
  { value: 'LIKE_', title: 'ลงท้ายด้วย', },
  { value: 'Equel', title: 'เท่ากับ', },
  { value: 'Not', title: 'ไม่มี', },
  { value: 'Not_equel', title: 'ไม่เท่ากับ', },
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

const submitting = ref(false)
const new_password = ref('')
const confirm_password = ref('')
const user_id = ref('')
const password_dialog = ref(false);

const {
  data: users,
  pending: pendingUsers,
  refresh: refreshUsers,
} = await useAsyncData('users', () => getUserBy({
  pagination: pagination.value,
  search: search.value,
}), { watch: [pagination.value] })

async function onSubmit() {
  if (submitting.value || !validatePassword()) return

  try {
    submitting.value = true

    const { error } = await updatePasswordUserBy({
      user_id: user_id.value,
      new_password: new_password.value,
    });

    if (error) {
      void Swal.fire({ title: 'ผิดพลาด', text: error.message, icon: "error" })
    } else {
      void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })

      closeDialog()
    }
  } catch (e) {
    console.log(e)
  }

  submitting.value = false
}

const onDelete = (id: string) => Swal.fire({
  title: "ยืนยันการลบรายการ",
  text: "คุณแน่ใจหรือว่าต้องการลบ ?",
  icon: "warning",
  showCancelButton: true,
}).then(async ({ value }) => {
  try {
    if (!value) return

    await deleteUserBy({ user_id: id })

    refreshUsers()

    void Swal.fire({ title: 'สำเร็จ', text: 'ลบข้อมูลแล้ว', icon: "success" })
  } catch (e) {
    console.log(e)
  }
})

function validatePassword(): boolean {
  if (pwdRule(new_password.value) !== true) return false
  if (pwdRule(confirm_password.value) !== true && isConfirmMatch() !== true) return false

  return true
}

const pwdRule = (pwd: string) => {
  pwd = pwd.trim()

  const isPassword = /^[\da-zA-Z@#]+$/.test(pwd)

  if (pwd.length == 0) return 'Required.'
  if (pwd.length < 6 || pwd.length > 30) return 'Password must 6 to 30 characters.'
  if (!isPassword) return 'Invalid password format.'

  return true
}

const isConfirmMatch = () => {
  return new_password.value === confirm_password.value ? true : 'Passwords do not match'
};

const closeDialog = () => {
  password_dialog.value = false
  new_password.value = ''
  confirm_password.value = ''
}

function submitSearch(e: FormDataEvent) {
  e.preventDefault()

  refreshUsers()
}

const clearSearch = () => {
  search.value = {
    is_show: false,
    text: '',
    columns: [],
    condition: 'LIKE',
  }

  refreshUsers()
};

const confirmSearch = () => {
  search.value.is_show = false
  refreshUsers()
};

const modalPassword = (id: string) => {
  new_password.value = ''
  confirm_password.value = ''
  password_dialog.value = true
  user_id.value = id
};

const exportUsersFile = async () => {
  try {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('User List');

    worksheet.columns = [
      { key: 'user_id', header: 'User ID' },
      { key: 'user_name', header: 'Name' },
      { key: 'user_email', header: 'E-mail' },
      { key: 'user_mobile', header: 'Phone' },
      { key: 'user_username', header: 'Username' },
      { key: 'license_name', header: 'License' },
      { key: 'user_status', header: 'Status' },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'user.xlsx';
    downloadLink.click();
  } catch (e) {
    console.log(e)
  }
};
</script>

<template>
  <v-card elevation="10" class="withbg mx-auto" color="grey-lighten-3" max-width="1980">
    <v-card-title>พนักงาน/ผู้ใช้งาน</v-card-title>
    <v-card-item>
      <v-row class="mb-4">
        <v-col class="d-flex flex-wrap gap-2 align-center py-2" cols="12" md="4">
          <template v-if="permission_add">
            <v-btn elevation="3" color="primary" to="/user/add">เพิ่มรายการใหม่</v-btn>
          </template>
          <v-btn elevation="3" color="export" @click="exportUsersFile()">Export</v-btn>
        </v-col>
        <v-col class="d-flex flex-wrap gap-2 align-center justify-md-end py-2" cols="12" md="8">
          <form class="d-flex flex-wrap gap-2" :onsubmit="submitSearch">
            <v-text-field v-model="search.text" label="Search..." append-inner-icon="mdi-magnify" density="compact"
              variant="outlined" hide-details style="width: 500px" @click:append-inner="refreshUsers()"></v-text-field>
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
      <v-data-table-server :loading="pendingUsers" :headers="headers" :items="users?.docs ?? []"
        :items-length="users?.totalDocs ?? 0" :items-per-page="pagination.size" :page="pagination.page"
        @update:items-per-page="e => pagination.size = e" @update:page="e => pagination.page = e">
        <template v-slot:item.no="{ index }">{{ pageItemNo(pagination, index) }}</template>
        <template v-slot:item.user_img="{ item }">
          <v-avatar>
            <v-img v-if="item.raw.user_img" class="mx-auto" :src="`${publicCtx.apiBaseUrl}${item.raw.user_img}`"
              width="50px" height="50px" cover alt="Avatar">
              <template v-slot:error>
                <v-img class="mx-auto" :src="errorImage" width="50px" height="50px" cover alt="error"></v-img>
              </template>
            </v-img>
          </v-avatar>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-label class="cursor-pointer" icon v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-label>
            </template>
            <v-list>
              <v-list-item class="cursor-pointer" density="compact"
                :to="{ path: '/user/detail', query: { id: item.raw.user_id } }">
                <v-list-item-title>
                  <v-icon> mdi-chat-processing-outline</v-icon> ดูรายละเอียด
                </v-list-item-title>
              </v-list-item>
              <template v-if="permission_edit">
                <v-list-item class="cursor-pointer" density="compact" @click="modalPassword(item.raw.user_id)">
                  <v-list-item-title>
                    <v-icon> mdi-key-variant</v-icon> เปลี่ยนรหัสผ่าน
                  </v-list-item-title>
                </v-list-item>
                <v-list-item class="cursor-pointer" density="compact"
                  :to="{ path: '/user/update', query: { id: item.raw.user_id } }">
                  <v-list-item-title>
                    <v-icon> mdi-square-edit-outline</v-icon> แก้ไข
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-if="permission_delete">
                <v-list-item class="cursor-pointer" density="compact" @click="onDelete(item.raw.user_id)">
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

  <v-dialog v-model="password_dialog" max-width="500" :persistent="true">
    <v-card>
      <v-toolbar color="muted">
        <v-toolbar-title>Change password</v-toolbar-title>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col class="text-md-right pt-2" cols="12" md="5">
            <v-label>New password</v-label>
          </v-col>
          <v-col cols="12" md="7">
            <v-text-field v-model="new_password" type="password" density="compact" variant="outlined" class="btn-small"
              :rules="[pwdRule]"></v-text-field>
          </v-col>
          <v-col class="text-md-right pt-2" cols="12" md="5">
            <v-label>Confirm password</v-label>
          </v-col>
          <v-col cols="12" md="7">
            <v-text-field v-model="confirm_password" type="password" :rules="[pwdRule, isConfirmMatch]" density="compact"
              variant="outlined"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class="border-opacity-100"></v-divider>
      <v-card-text class="d-flex justify-center gap-2 py-4">
        <v-btn color="save" @click="onSubmit">
          <template v-if="submitting">
            <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
          </template> บันทึก
        </v-btn>
        <v-btn color="secondary" @click="closeDialog">ยกเลิก</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>