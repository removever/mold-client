
<script lang="ts" setup>
import { Department,Machine} from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getDepartmentByID } = useDepartment();
const { getMachineBy } = useMachine();

const department = ref<Department>({
  department_id: '',
  department_name: '',
});
const machine= ref<Machine[]>([]);
onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    department.value = await getDepartmentByID({ department_id: query.id })
    machine.value = await getMachineBy({ department_id: query.id }).then(res => res.docs)
    
  } catch (e) {
    console.log(e)
  }
})
</script>
<template>
  <v-breadcrumbs :items="[
    { title: 'เเผนก', to: '/department', },
    { title: 'รายละเอียด', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-text>
      <div class="d-sm-flex align-center  pt-sm-2">
        <v-card-title>รายละเอียด</v-card-title>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" sm="6" lg="2">
                <v-label>รหัสเเผนก</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ department.department_id }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" lg="2">
                <v-label>ชื่อเเผนก</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ department.department_name }}</v-label>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <h3 class="mt-10 mb-5">เครื่องจักร : </h3>
          <table class="table table-bordered" style="min-width: 400px" aria-describedby="title">
            <thead>
              <tr>
                <th scope="#" style="width: 80px"></th>
                <th scope="Date" style="width: 150px">รหัสเครื่องจักร</th>
                <th scope="Time" style="width: 600px">ชื่อเครื่องจักร</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="machine.length" v-for="(list, idx) in machine" :key="idx">
                <td class="align-middle text-center">{{ idx + 1 }}</td>
                <td class="align-middle text-center">{{ list.machine_id }}</td>
                <td class="align-middle text-center">{{ list.machine_name }}</td>
              </tr>
              <tr v-else>
                <td class="align-middle text-center" colspan="2"><b>ไม่พบข้อมูล</b></td>
              </tr>
            </tbody>
          </table>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn type="submit" color="muted" :to="'/department'">กลับ</v-btn>
    </v-card-text>
  </v-card>
</template>