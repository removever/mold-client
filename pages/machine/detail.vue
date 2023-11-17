
<script lang="ts" setup>
import Swal from "sweetalert2"
import { Machine, MachineProcess, MachineProcessList, Process, MachineStop } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getProcessBy, } = useProcess();
const { getProcessListBy, } = useProcessList();
const { getMachineByID, updateMachineBy } = useMachine();
const { getMachineProcessBy } = useMachineProcess();
const { getMachineProcessListBy } = useMachineProcessList();
const { getMachineStopBy } = useMachineStop();
const router = useRouter();
const submitting = ref(false)
const machine = ref<Machine>({
  machine_id: '',
  machine_name: '',
  department_id : ''
});
const tab = ref<string>('');
const processes = ref<Process[]>([]);
const machine_stops = ref<MachineStop[]>([]);
const machine_processes = ref<MachineProcess[]>([]);
const machine_process_lists = ref<MachineProcessList[]>([]);
const noteDialog = ref<{
  show: boolean,
  pending: boolean,
  buffer_files: File[][],
}>({
  show: false,
  pending: false,
  buffer_files: [],
})

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    machine.value = await getMachineByID({ machine_id: query.id })
    processes.value = await getProcessBy().then(res => res.docs)
    machine_processes.value = await getMachineProcessBy({ machine_id: query.id }).then(res => res.docs)
    machine_process_lists.value = await getMachineProcessListBy({ machine_id: query.id }).then(res => res.docs)
    machine_stops.value = await getMachineStopBy({ machine_id: query.id }).then(res => res.docs)

    for(const machine_stop of machine_stops.value){
      machine_stop.machine_stop_ot_status = machine_stop.machine_stop_ot_status ? true : false
    }

    if(machine_processes.value.length) tab.value = machine_processes.value[0].process_id
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'เครื่องจักร', to: '/machine', },
    { title: 'แก้ไขรายการ', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>รายละเอียด</v-card-title>
    <v-card-text class="py-4">
      <v-row>
        <v-col cols="12" sm="6" lg="1">
          <v-label>ชื่อเครื่องจักร</v-label>
        </v-col>
        <v-col cols="12" sm="6" lg="2">
          <v-label>{{ machine.machine_name }}</v-label>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" lg="1">
          <v-label>แผนก</v-label>
        </v-col>
        <v-col cols="12" sm="6" lg="2">
          <v-label>{{ machine.department_name }}</v-label>
        </v-col>
      </v-row>

      <h3 class="mt-10">โปรเซทที่รองรับ : </h3>
      <v-tabs v-model="tab" color="primary">
        <v-tab v-for="(item) in machine_processes" :value="item.process_id">{{ item.process_name }}</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item v-for="(item) in machine_processes" :value="item.process_id">
          <table class="table table-bordered" style="min-width: 400px" aria-describedby="title">
            <thead>
              <tr>
                <th scope="Title" style="width: 150px">คุณสมบัติ</th>
                <th scope="#" style="width: 100px">ค่า</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="machine_process_lists.filter(list => list.process_id === item.process_id).length" 
                v-for="(list, idx) in machine_process_lists.filter(list => list.process_id === item.process_id)" :key="idx">
                <td class="align-middle text-center">{{ list.machine_process_list_name }}</td>
                <td class="align-middle text-center">{{ list.machine_process_list_value }}</td>
              </tr>
              <tr v-else>
                <td class="align-middle text-center" colspan="2"><b>ไม่พบข้อมูล</b></td>
              </tr>
            </tbody>
          </table>
        </v-window-item>
      </v-window>

      <h3 class="mt-10 mb-5">วันที่เครื่องหยุดทำงาน : </h3>
      <table class="table table-bordered" style="min-width: 400px" aria-describedby="title">
        <thead>
          <tr>
            <th scope="#" style="width: 80px"></th>
            <th scope="Date" style="width: 600px">วันที่หยุด</th>
            <th scope="Time" style="width: 150px">OT</th>
            <th scope="Remark">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="machine_stops.length" 
            v-for="(list, idx) in machine_stops" :key="idx">
            <td class="align-middle text-center">{{ idx+1 }}</td>
            <td class="align-middle text-center">{{ `${formatDate(list.machine_stop_start,'dd-MM-yyyy HH:mm')} ถึง ${formatDate(list.machine_stop_end,'dd-MM-yyyy HH:mm')}` }}</td>
            <td class="align-middle text-center">
              <v-icon v-if="list.machine_stop_ot_status" color="success">mdi-check</v-icon>
              <v-icon v-else color="error">mdi-close</v-icon>
            </td>
            <td class="align-middle text-center">{{ list.machine_stop_remark }}</td>
          </tr>
          <tr v-else>
            <td class="align-middle text-center" colspan="2"><b>ไม่พบข้อมูล</b></td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn color="muted" :to="'/machine'">กลับ</v-btn>
    </v-card-text>
  </v-card>
</template>
