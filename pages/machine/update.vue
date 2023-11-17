
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
const { getDepartmentBy } = useDepartment()
const router = useRouter();
const submitting = ref(false)
const machine = ref<Machine>({
  machine_id: '',
  machine_name: '',
  department_id: ''
});
const tab = ref<string>('');
const processes = ref<Process[]>([]);
const machine_stops = ref<MachineStop[]>([]);
const machine_processes = ref<MachineProcess[]>([]);
const machine_process_lists = ref<MachineProcessList[]>([]);
const { data: department } = await useAsyncData('department', () => getDepartmentBy());

const department_options = department.value?.docs.map(item => ({
  value: item.department_id,
  title: item.department_name,
}));
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

    for (const machine_stop of machine_stops.value) {
      machine_stop.machine_stop_ot_status = machine_stop.machine_stop_ot_status ? true : false
      machine_stop.machine_stop_start = formatDate(machine_stop.machine_stop_start, 'yyyy-MM-ddTHH:mm')
      machine_stop.machine_stop_end = formatDate(machine_stop.machine_stop_end, 'yyyy-MM-ddTHH:mm')
    }
    if (machine_processes.value.length) tab.value = machine_processes.value[0].process_id
  } catch (e) {
    console.log(e)
  }
})

async function onSubmit() {
  if (submitting.value || !validateForm()) return

  try {
    submitting.value = true
    await updateMachineBy({
      machine: machine.value,
      machine_stops: machine_stops.value,
      machine_processes: machine_processes.value,
      machine_process_lists: machine_process_lists.value
    });
    void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })
    await router.push({ path: '/machine' });
  } catch (e) {
    console.log(e)
    submitting.value = false
  }
}

function validateForm(): boolean {
  const {
    machine_id,
    machine_name,
  } = machine.value

  if (!(machine_id && machine_name)) {
    void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
    return false
  }
  if (machine_process_lists.value.length) {
    for (const list of machine_process_lists.value) {
      if (!list.machine_process_list_value) {
        void Swal.fire({ text: 'กรุณากรอกข้อมูลคุณสมบัติให้ครบถ้วน', icon: "warning" })
        return false
      }
    }
  }
  if (machine_stops.value.length) {
    for (const list of machine_stops.value) {
      if (!(list.machine_stop_start && list.machine_stop_end)) {
        void Swal.fire({ text: 'กรุณากรอกข้อมูลวันที่เครื่องหยุดทำงานให้ครบถ้วน', icon: "warning" })
        return false
      }else if(list.machine_stop_start > list.machine_stop_end){
        void Swal.fire({ text: 'กรุณากรอกข้อมูลวันที่เครื่องหยุดทำงานให้ถูกต้อง', icon: "warning" })
        return false
      }
    }
  }
  return true
}

async function addMachineProcess() {
  const check_processes = processes.value.filter(val => val.check)
  machine_processes.value = machine_processes.value.filter(val => check_processes.find(item => item.process_id === val.process_id))

  for (const process of check_processes) {
    const check = machine_processes.value.find(val => val.process_id === process.process_id)
    const process_lists = await getProcessListBy({ process_id: process.process_id }).then(res => res.docs)

    if (!check) {
      machine_processes.value.push({
        machine_process_id: '',
        machine_id: machine.value.machine_id,
        process_id: process.process_id,
        process_name: process.process_name,
      })

      for (const list of process_lists) {
        machine_process_lists.value.push({
          machine_process_list_id: '',
          machine_process_id: '',
          machine_id: machine.value.machine_id,
          process_id: process.process_id,
          process_list_id: list.process_list_id,
          machine_process_list_name: list.process_list_name,
          machine_process_list_value: '',
        })
      }
    }
  }

  tab.value = machine_processes.value.length ? machine_processes.value[0].process_id : ''
  noteDialog.value.show = false
};

async function showProcess() {
  noteDialog.value.show = true
};

async function _onSelect(idx: number) {
  processes.value[idx].check = !processes.value[idx].check
}

async function addMachineStop() {
  machine_stops.value.push({
    machine_stop_id: '',
    machine_id: machine.value.machine_id,
    machine_stop_start: '',
    machine_stop_end: '',
    machine_stop_remark: '',
    machine_stop_ot_status: false,
  })
}

function deleteMachineStop(idx: number) {
  machine_stops.value.splice(idx, 1);
}
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'เครื่องจักร', to: '/machine', },
    { title: 'แก้ไขรายการ', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>แก้ไขรายการ</v-card-title>
    <v-card-text class="py-4">
      <v-row>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">ชื่อเครื่องจักร<span class="text-error ml-1">*</span></v-label>
          <v-text-field v-model="machine.machine_name" :rules="[rules.required]" density="compact" variant="outlined"
            class="btn-small"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">แผนก<span class="text-error ml-1">*</span></v-label>
          <v-select class="ml-2" label="แผนก" v-model="machine.department_id" :items="department_options"
            density="compact" variant="outlined" hide-details></v-select>
        </v-col>
      </v-row>

      <h3 class="mt-4">โปรเซทที่รองรับ : </h3>
      <v-tabs v-model="tab" color="primary">
        <v-tab v-for="(item) in machine_processes" :value="item.process_id">{{ item.process_name }}</v-tab>
        <v-btn class="ml-4 mt-4 item-action" @click="showProcess()" color="primary" icon size="25">
          <v-icon size="20">mdi-plus</v-icon>
        </v-btn>
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
                v-for="(list, idx) in machine_process_lists.filter(list => list.process_id === item.process_id)"
                :key="idx">
                <td class="align-middle text-center" align-self="center">{{ list.machine_process_list_name }}</td>
                <td class="align-middle text-center">
                  <v-text-field v-model="list.machine_process_list_value" :rules="[rules.required]" density="compact"
                    variant="outlined" hide-details></v-text-field>
                </td>
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
            <th scope="#" style="width: 80px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="machine_stops.length" v-for="(list, idx) in machine_stops" :key="idx">
            <td class="align-middle text-center">{{ idx + 1 }}</td>
            <td class="align-middle text-center">
              <v-row>
                <v-col cols="6" sm="12" lg="6">
                  <v-text-field label="เริ่ม" type="datetime-local" v-model="list.machine_stop_start" density="compact"
                    variant="outlined" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6" sm="12" lg="6">
                  <v-text-field label="สิ้นสุด" type="datetime-local" v-model="list.machine_stop_end" density="compact"
                    variant="outlined" :rules="[rules.required]"></v-text-field>
                </v-col>
              </v-row>
            </td>
            <td class="align-middle text-center">
              <v-switch class="ml-5" v-model="list.machine_stop_ot_status" label="เปิด OT" color="primary"
                hide-details></v-switch>
            </td>
            <td class="align-middle text-center">
              <v-text-field type="text" v-model="list.machine_stop_remark" density="compact" variant="outlined"
                :rules="[rules.required]"></v-text-field>
            </td>
            <td class="align-middle text-center">
              <v-icon size="20" color="error" @click="deleteMachineStop(idx)">mdi-close-thick</v-icon>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="align-middle text-center" colspan="6">
              <v-btn color="success" @click="addMachineStop()">
                <v-icon size="20">mdi-plus</v-icon> เพิ่มเวลาการทำงาน
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </table>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn color="save" @click="onSubmit">
        <template v-if="submitting">
          <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
        </template> บันทึก
      </v-btn>
      <v-btn color="muted" :to="'/machine'">ยกเลิก</v-btn>
    </v-card-text>
  </v-card>

  <v-dialog v-model="noteDialog.show" max-width="1360">
    <v-card>
      <v-card-title class="text-h5">โปรเซทที่รองรับ </v-card-title>
      <v-card-text>
        <v-row>
          <template v-for="(item, idx) in processes">
            <v-col cols="12" sm="4" lg="3">
              <v-card class="ma-3" :key="item.process_id" @click="_onSelect(idx)" :color="item.check ? 'primary' : ''">
                <div class="ma-5 text-center align-middle">{{ item.process_name }}</div>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-card-text class="d-flex justify-center gap-2 mb-2">
        <v-btn color="save" @click="addMachineProcess()">บันทึก</v-btn>
        <v-btn color="muted" @click="noteDialog.show = false">ปิด</v-btn>
    </v-card-text>
  </v-card>
</v-dialog></template>
