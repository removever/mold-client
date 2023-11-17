
<script lang="ts" setup>
import Swal from "sweetalert2";
import { License, Permission, } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });

const router = useRouter();

const { insertLicense } = useLicense();
const { getPermissionBy } = usePermission();

const submitting = ref(false)
const license = ref<License>({
  license_id: '',
  license_name: '',
});
const permission_groups = ref<{
  group_no: number,
  group_name: string,
  group_view: boolean,
  group_add: boolean,
  group_edit: boolean,
  group_approve: boolean,
  group_delete: boolean,
  permissions: Permission[],
}[]>([]);

const menu_group_names = ['การเรียน/การสอน', 'ข้อมูลหลัก', 'ข้อมูลบุคคล', 'รายงาน']

onMounted(async () => {
  try {
    const { docs: permissions } = await getPermissionBy()

    permissions.forEach(item => {
      let permission_group = permission_groups.value.find(val => val.group_no === item.menu_group)

      if (permission_group) {
        permission_group.permissions.push(item)
      } else {
        permission_groups.value.push({
          group_no: item.menu_group,
          group_view: false,
          group_add: false,
          group_edit: false,
          group_approve: false,
          group_delete: false,
          group_name: menu_group_names[item.menu_group],
          permissions: [item],
        })
      }
    })
  } catch (e) {
    console.log(e)
  }
})

async function onSubmit() {
  if (submitting.value || !validateForm()) return

  try {
    submitting.value = true

    const permissions: Permission[] = []

    permission_groups.value.forEach(item => {
      permissions.push(...item.permissions)
    })

    await insertLicense({
      license: license.value,
      permissions
    });

    void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })
    await router.push({ path: '/license' });
  } catch (e) {
    console.log(e)
  }

  submitting.value = false
}

function validateForm(): boolean {
  if (!license.value.license_name) {
    void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
    return false
  }

  return true
}

function checkedViewAll(index: number, e: boolean) {
  if (!e) {
    permission_groups.value[index].group_add = false
    permission_groups.value[index].group_edit = false
    permission_groups.value[index].group_approve = false
    permission_groups.value[index].group_delete = false
  }

  permission_groups.value[index].permissions.forEach(item => {
    item.permission_view = e

    if (!e) {
      item.permission_add = false
      item.permission_edit = false
      item.permission_approve = false
      item.permission_delete = false
    }
  })
}

function checkedAll(gidx: number, checked: boolean, type: 'add' | 'edit' | 'approve' | 'delete') {
  if (checked) permission_groups.value[gidx].group_view = true

  permission_groups.value[gidx].permissions.forEach(item => {
    if (checked) item.permission_view = true

    if (type == 'add') item.permission_add = checked
    else if (type == 'edit') item.permission_edit = checked
    else if (type == 'approve') item.permission_approve = checked
    else if (type == 'delete') item.permission_delete = checked
  })
}

function checkedItem(gidx: number, idx: number, checked: boolean, type: 'view' | 'add' | 'edit' | 'approve' | 'delete') {
  if (type === "view") {
    permission_groups.value[gidx].permissions[idx].permission_view = checked

    if (!checked) {
      permission_groups.value[gidx].permissions[idx].permission_add = false
      permission_groups.value[gidx].permissions[idx].permission_edit = false
      permission_groups.value[gidx].permissions[idx].permission_approve = false
      permission_groups.value[gidx].permissions[idx].permission_delete = false
    }
  } else {
    if (checked) permission_groups.value[gidx].permissions[idx].permission_view = true

    if (type === "add") {
      permission_groups.value[gidx].permissions[idx].permission_add = checked
    } else if (type === "edit") {
      permission_groups.value[gidx].permissions[idx].permission_edit = checked
    } else if (type === "approve") {
      permission_groups.value[gidx].permissions[idx].permission_approve = checked
    } else if (type === "delete") {
      permission_groups.value[gidx].permissions[idx].permission_delete = checked
    }
  }

  const { permissions } = permission_groups.value[gidx]

  permission_groups.value[gidx].group_view = permissions.length == permissions.filter(val => val.permission_view).length
  permission_groups.value[gidx].group_add = permissions.length == permissions.filter(val => val.permission_add).length
  permission_groups.value[gidx].group_edit = permissions.length == permissions.filter(val => val.permission_edit).length
  permission_groups.value[gidx].group_approve = permissions.length == permissions.filter(val => val.permission_approve).length
  permission_groups.value[gidx].group_delete = permissions.length == permissions.filter(val => val.permission_delete).length
}
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'สิทธิ์การใช้งาน', to: '/license', },
    { title: 'เพิ่มรายการใหม่', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>เพิ่มรายการใหม่</v-card-title>
    <v-card-text class="py-4">
      <v-row>
        <v-col md="3">
          <v-label class="mb-2">ชื่อสิทธิ์การใช้งาน<span class="text-error ml-1">*</span></v-label>
          <v-text-field v-model="license.license_name" density="compact" variant="outlined"
            :rules="[rules.required]"></v-text-field>
        </v-col>
      </v-row>
      <div v-for="(group, gidx) in permission_groups" :key="group.group_no">
        <v-label class="mt-4">{{ group.group_name }}</v-label>
        <table class="table table-bordered table-striped mt-2" aria-describedby="schedule">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold" scope="#" :style="{ width: '48px' }">#</th>
              <th class="text-left text-subtitle-1 font-weight-bold" scope="Menu">Menu</th>
              <th class="pa-0" scope="View" :style="{ width: '100px' }">
                <v-checkbox v-model="group.group_view" label="View" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedViewAll(gidx, e)"></v-checkbox>
              </th>
              <th v-if="group.group_no != 3" class="pa-0" scope="Add" :style="{ width: '100px' }">
                <v-checkbox v-model="group.group_add" label="Add" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedAll(gidx, e, 'add')"></v-checkbox>
              </th>
              <th v-if="group.group_no != 3" class="pa-0" scope="Update" :style="{ width: '100px' }">
                <v-checkbox v-model="group.group_edit" label="Update" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedAll(gidx, e, 'edit')"></v-checkbox>
              </th>
              <th v-if="group.group_no != 3" class="pa-0" scope="Approve" :style="{ width: '100px' }">
                <v-checkbox v-model="group.group_approve" label="Approve" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedAll(gidx, e, 'approve')"></v-checkbox>
              </th>
              <th v-if="group.group_no != 3" class="pa-0" scope="Delete" :style="{ width: '100px' }">
                <v-checkbox v-model="group.group_delete" label="Delete" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedAll(gidx, e, 'delete')"></v-checkbox>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in group.permissions" :key="item.menu_id">
              <td class="align-middle text-center">{{ index + 1 }}</td>
              <td class="align-middle">{{ item.menu_name_th }}</td>
              <td class="text-center py-0">
                <v-checkbox v-model="item.permission_view" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedItem(gidx, index, e, 'view')"></v-checkbox>
              </td>
              <td v-if="group.group_no != 3" class="text-center py-0">
                <v-checkbox v-model="item.permission_add" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedItem(gidx, index, e, 'add')"></v-checkbox>
              </td>
              <td v-if="group.group_no != 3" class="text-center py-0">
                <v-checkbox v-model="item.permission_edit" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedItem(gidx, index, e, 'edit')"></v-checkbox>
              </td>
              <td v-if="group.group_no != 3" class="text-center py-0">
                <v-checkbox v-model="item.permission_approve" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedItem(gidx, index, e, 'approve')"></v-checkbox>
              </td>
              <td v-if="group.group_no != 3" class="text-center py-0">
                <v-checkbox v-model="item.permission_delete" color="primary" density="compact" hide-details
                  v-on:update:model-value="e => checkedItem(gidx, index, e, 'delete')"></v-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card-text>
    <v-divider class="border-opacity-100"></v-divider>
    <v-card-text class="d-flex justify-center gap-2">
      <v-btn color="save" @click="onSubmit">
        <template v-if="submitting">
          <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
        </template> บันทึก
      </v-btn>
      <v-btn color="muted" :to="'/license'">ยกเลิก</v-btn>
    </v-card-text>
  </v-card>
</template>