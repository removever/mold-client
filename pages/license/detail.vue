
<script lang="ts" setup>
import { License, Permission, } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });

const { getLicenseByID } = useLicense();
const { getPermissionBy } = usePermission();

const menu_group_names = ['การเรียน/การสอน', 'ข้อมูลหลัก', 'ข้อมูลบุคคล', 'รายงาน']
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

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    license.value = await getLicenseByID({ license_id: query.id })

    const { docs: permissions } = await getPermissionBy({ license_id: query.id })

    permissions.forEach(item => {
      item.permission_view = !!item.permission_view
      item.permission_add = !!item.permission_add
      item.permission_edit = !!item.permission_edit
      item.permission_approve = !!item.permission_approve
      item.permission_delete = !!item.permission_delete

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

    permission_groups.value.forEach(item => {
      item.group_view = item.permissions.length == item.permissions.filter(val => val.permission_view).length
      item.group_add = item.permissions.length == item.permissions.filter(val => val.permission_add).length
      item.group_edit = item.permissions.length == item.permissions.filter(val => val.permission_edit).length
      item.group_approve = item.permissions.length == item.permissions.filter(val => val.permission_approve).length
      item.group_delete = item.permissions.length == item.permissions.filter(val => val.permission_delete).length
    })
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'สิทธิ์การใช้งาน', to: '/license', },
    { title: 'ดูรายละเอียด', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>ดูรายละเอียด</v-card-title>
    <v-card-text class="py-4">
      <table class="w-100" aria-describedby="detail">
        <thead>
          <tr>
            <th scope="Title" :style="{ width: '180px' }"></th>
            <th scope="Value"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-right px-2 py-2">สิทธิ์การใช้งาน</td>
            <td class="px-2 py-2">{{ license.license_name }}</td>
          </tr>
        </tbody>
      </table>
      <div v-for="group in permission_groups" :key="group.group_no">
        <v-label class="mt-4">{{ group.group_name }}</v-label>
        <table class="table table-bordered table-striped mt-2" aria-describedby="schedule">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold" scope="#" :style="{ width: '48px' }">#</th>
              <th class="text-left text-subtitle-1 font-weight-bold" scope="Menu">Menu</th>
              <th scope="View" :style="{ width: '100px' }">View</th>
              <th v-if="group.group_no != 3" scope="Add" :style="{ width: '100px' }">Add</th>
              <th v-if="group.group_no != 3" scope="Update" :style="{ width: '100px' }">Update</th>
              <th v-if="group.group_no != 3" scope="Approve" :style="{ width: '100px' }">Approve</th>
              <th v-if="group.group_no != 3" scope="Delete" :style="{ width: '100px' }">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in group.permissions" :key="item.menu_id">
              <td class="align-middle text-center">{{ index + 1 }}</td>
              <td class="align-middle">{{ item.menu_name_th }}</td>
              <td class="align-middle text-center">
                <v-icon color="success" v-if="item.permission_view">mdi-check-bold</v-icon>
                <v-icon color="error" v-else>mdi-close-thick</v-icon>
              </td>
              <td v-if="group.group_no != 3" class="align-middle text-center">
                <v-icon color="success" v-if="item.permission_add">mdi-check-bold</v-icon>
                <v-icon color="error" v-else>mdi-close-thick</v-icon>
              </td>
              <td v-if="group.group_no != 3" class="align-middle text-center">
                <v-icon color="success" v-if="item.permission_edit">mdi-check-bold</v-icon>
                <v-icon color="error" v-else>mdi-close-thick</v-icon>
              </td>
              <td v-if="group.group_no != 3" class="align-middle text-center">
                <v-icon color="success" v-if="item.permission_approve">mdi-check-bold</v-icon>
                <v-icon color="error" v-else>mdi-close-thick</v-icon>
              </td>
              <td v-if="group.group_no != 3" class="align-middle text-center">
                <v-icon color="success" v-if="item.permission_delete">mdi-check-bold</v-icon>
                <v-icon color="error" v-else>mdi-close-thick</v-icon>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card-text>
    <v-divider class="border-opacity-100"></v-divider>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn color="muted" :to="'/license'">กลับ</v-btn>
    </v-card-text>
  </v-card>
</template>