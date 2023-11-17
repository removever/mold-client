
<script lang="ts" setup>
import Swal from "sweetalert2"
import { OT } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getMachineBy, } = useMachine();
const { insertOT, } = useOT();
const router = useRouter();
const submitting = ref(false)
const ots = ref<OT[]>([])
const { data: machines } = await useAsyncData('machines', () => getMachineBy());

const machine_options = machines.value?.docs.map(item => ({
  value: item.machine_id,
  title: item.machine_name,
}));

onMounted(async () => {
  try {
    addOT()
  } catch (e) {
    console.log(e)
  }
})

async function onSubmit() {
  if (submitting.value || !validateForm()) return

  try {
    submitting.value = true
    await insertOT(ots.value);
    void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })
    await router.push({ path: '/ot' });
  } catch (e) {
    console.log(e)
    submitting.value = false
  }
}

function validateForm(): boolean {
  for(const ot of ots.value){
    if (!(ot.machine_id && ot.ot_start && ot.ot_end)) {
      void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
      return false
    }
  }
  return true
}

function addOT() {
  ots.value.push({
    ot_id: '',
    machine_id: '',
    ot_start: '',
    ot_end: '',
    ot_remark: '',
  })
}

function deleteOT(idx: number) {
  ots.value.splice(idx, 1);
}
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'เวลาทำงานล่วงเวลา', to: '/ot', },
    { title: 'เพิ่มรายการใหม่', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>
      เพิ่มรายการใหม่
      <v-btn style="float: right;" color="success" @click="addOT()">
        <v-icon size="20">mdi-plus</v-icon> เพิ่มทำงานล่วงเวลา
      </v-btn>
    </v-card-title>
    <v-card-text class="py-4">
      <v-card class="ma-2" v-for="(list, idx) in ots" :key="idx">
        <v-card-text>
          <div class="overflow-auto">
            <table class="mt-2"  style="min-width: 1550px" aria-describedby="title">
              <thead>
                <tr>
                  <th style="width: 50px">{{ idx + 1 }}</th>
                  <th style="width: 400px">
                    <v-select class="ml-2" label="เครื่องจักร" v-model="list.machine_id" :items="machine_options" density="compact" variant="outlined" hide-details></v-select>
                  </th>
                  <th style="width: 300px">
                    <v-text-field class="ml-2" label="เริ่ม" type="datetime-local" v-model="list.ot_start" density="compact" variant="outlined" :rules="[rules.required]" hide-details></v-text-field>
                  </th>
                  <th style="width: 300px">
                    <v-text-field class="ml-2" label="สิ้นสุด" type="datetime-local" v-model="list.ot_end" density="compact" variant="outlined" :rules="[rules.required]" hide-details></v-text-field>
                  </th>
                  <th>
                    <v-text-field class="ml-2" label="หมายเหตุ" type="text" v-model="list.ot_remark" density="compact" variant="outlined" hide-details></v-text-field>
                  </th>
                  <th style="width: 50px">
                    <v-icon class="ml-4" size="20" color="error" @click="deleteOT(idx)">mdi-close-thick</v-icon>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn color="save" @click="onSubmit">
        <template v-if="submitting">
          <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
        </template> บันทึก
      </v-btn>
      <v-btn color="muted" :to="'/ot'">ยกเลิก</v-btn>
    </v-card-text>
  </v-card>
</template>