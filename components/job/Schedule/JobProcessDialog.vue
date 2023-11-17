<script lang="ts" setup>
import Swal from "sweetalert2"
import { VDataTable } from 'vuetify/labs/components'

import { JobProcess, JobProcessDialog, } from "~~/misc/types"

const emit = defineEmits<{
  (e: 'added'): void,
  (e: 'updated'): void,
}>()

const props = defineProps({
  modelValue: { type: Object as PropType<JobProcessDialog>, required: true },
  job_processes: { type: Array as PropType<JobProcess[]>, default: [], required: true, },
})

const { getMachineProcessBy } = useMachineProcess()
const { getProcessBy, } = useProcess()

type Headers = InstanceType<typeof VDataTable>['headers']

const headers: Headers = [
  { title: "#", key: "no", sortable: false, width: 36, align: 'center' },
  { title: "เครื่องจักร", key: "machine_detail", sortable: false, width: 300 },
  { title: "รายละเอียด", key: "machine_process_lists", sortable: false, },
];

const pagination = ref({ page: 1, size: 20, })
const persistent = ref(false)
const machine_ids = ref<string[]>([])
const job_process_options = ref<{ value: string, title: string, }[]>([])
const job_pre_options = ref(props.job_processes.filter(val => val.job_process_id !== props.modelValue.job_process_id).map(item => ({
  value: item.job_process_id,
  title: item.job_process_name,
})))

const {
  data: machine_processes,
  pending: pendingMachineProcesses,
  refresh: refreshMachineProcesses,
} = await useAsyncData('machine_processes', () => getMachineProcessBy({
  pagination: pagination.value,
  // search: search.value,
  options: ['machine_process_lists'],
}), { watch: [pagination.value] })

const dialogAttr = computed(() => {
  const attr = {
    header: { txt: 'เพิ่ม' },
    btn_emit: { color: 'success' },
  }

  if (props.modelValue.action === 'duplicate') {
    attr.header.txt = 'คัดลอก'
  } else if (props.modelValue.action === 'update') {
    attr.header.txt = 'เเก้ไข'
    attr.btn_emit.color = 'warning'
  }

  return attr
})

const day_options = Array.from({ length: 31 }, (_, idx) => idx).map(item => ({
  value: item,
  title: `${item} วัน`,
}))
const hour_options = Array.from({ length: 24 }, (_, idx) => idx).map(item => ({
  value: item,
  title: `${item} ชั่วโมง`,
}))
const minute_options = Array.from({ length: 6 }, (_, idx) => idx * 5).map(item => ({
  value: item,
  title: `${item} นาที`,
}))

onMounted(async () => {
  try {
    const processes = await getProcessBy().then(res => res.docs)

    job_process_options.value = [{ value: '', title: '- เลือกกระบวนการ -', }, ...processes.map(item => ({
      value: item.process_id,
      title: item.process_name,
    }))]
  } catch (e) {
    console.log(e)
  }
})

function validateValue(): boolean {
  const {
    job_process_name,
    job_process_day,
    job_process_hour,
    job_process_minute,
  } = props.modelValue

  const result = { is_error: false, text: '', }

  if (!(job_process_name)) {
    result.is_error = true
    result.text = 'กรุณากรอกข้อมูลให้ครบถ้วน'
  } else if (!(job_process_day || job_process_hour || job_process_minute)) {
    result.is_error = true
    result.text = 'กรุณากรอกเวลาทำงาน'
  }

  if (result.is_error) {
    persistent.value = true
    void Swal.fire({ text: result.text, icon: "warning" }).then(() => {
      setTimeout(() => { persistent.value = false }, 1000)
    })

    return false
  }

  return true
}

function handleEmit() {
  if (!validateValue()) return

  props.modelValue.show = false

  const { action } = props.modelValue

  action === 'update' ? emit('updated') : emit('added')
}
</script>

<template>
  <v-dialog v-model="modelValue.show" max-width="1360" :persistent="persistent">
    <v-card>
      <v-card-title class="text-h5">{{ dialogAttr.header.txt }}กระบวนการ</v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="4">
            <v-label class="mb-2">กระบวนการ / Process <span class="text-error ml-1">*</span></v-label>
            <v-select v-model="modelValue.job_process_name" :items="job_process_options" density="compact"
              variant="outlined" hide-details />
          </v-col>
          <v-col md="4">
            <v-label class="mb-2">เริ่มหลังจาก / Begin After</v-label>
            <v-select v-model="modelValue.job_pre_process_ids" :items="job_pre_options" multiple density="compact"
              variant="outlined" hide-details />
          </v-col>
          <v-col md="6">
            <v-label class="mb-2">เวลาทำงาน / Time <span class="text-error ml-1">*</span></v-label>
            <div class="d-flex gap-2">
              <v-select v-model="modelValue.job_process_day" :items="day_options" density="compact" variant="outlined"
                hide-details />
              <v-select v-model="modelValue.job_process_hour" :items="hour_options" density="compact" variant="outlined"
                hide-details />
              <v-select v-model="modelValue.job_process_minute" :items="minute_options" density="compact"
                variant="outlined" hide-details />
            </div>
            <p class="text-caption text-muted">Example : 1 วัน 5 ชั่วโมง 30 นาที</p>
          </v-col>
          <v-col md="12">
            <v-label class="mb-2">หมายเหตุ / Remark</v-label>
            <v-textarea v-model="modelValue.job_process_remark" rows="2" density="compact" variant="outlined"
              hide-details />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="6">
            <v-label class="mb-2">ขนาดงาน / Size <span class="text-error ml-1">*</span></v-label>
            <div class="d-flex gap-2">
              <v-text-field v-model="modelValue.job_process_x" density="compact" variant="outlined" placeholder="ยาว"
                :rules="[rules.required]" />
              <v-text-field v-model="modelValue.job_process_y" density="compact" variant="outlined" placeholder="กว้าง"
                :rules="[rules.required]" />
              <v-text-field v-model="modelValue.job_process_z" density="compact" variant="outlined" placeholder="สูง"
                :rules="[rules.required]" />
            </div>
            <p class="text-caption text-muted">Example : 10 x 20 x 30.</p>
          </v-col>
          <v-col md="6">
            <v-label class="mb-2">เวลาเตรียมงาน / Setup (นาที)<span class="text-error ml-1">*</span></v-label>
            <div class="d-flex gap-2">
              <v-text-field v-model="modelValue.job_process_setup_time" density="compact" variant="outlined"
                placeholder="เริ่ม" :rules="[rules.required]" />
              <v-text-field v-model="modelValue.job_process_setup_finish_time" density="compact" variant="outlined"
                placeholder="สิ้นสุด" :rules="[rules.required]" />
            </div>
            <p class="text-caption text-muted">Example : 15 นาที - 20 นาที.</p>
          </v-col>
        </v-row>
        <v-data-table-server :loading="pendingMachineProcesses" :headers="headers" :items="machine_processes?.docs ?? []"
          :items-length="machine_processes?.totalDocs ?? 0" @update:items-per-page="e => pagination.size = e"
          @update:page="e => pagination.page = e" density="compact" item-value="machine_id" show-select
          v-model="machine_ids">
          <template v-slot:item.no="{ index }">{{ pageItemNo(pagination, index) }}</template>
          <template v-slot:item.machine_detail="{ item }">
            <div class="d-flex">
              <div class="text-right mr-2" style="width: 60px;">รหัส:</div>{{ item.raw.machine_id }}
            </div>
            <div class="d-flex">
              <div class="text-right mr-2" style="width: 60px;">ชื่อ:</div>{{ item.raw.machine_name }}
            </div>
            <div class="d-flex">
              <div class="text-right mr-2" style="width: 60px;">รุ่น:</div>{{ item.raw.machine_model_id }}
            </div>
            <div class="d-flex">
              <div class="text-right mr-2" style="width: 60px;">ประเภท:</div>{{ item.raw.machine_type_id }}
            </div>
          </template>
          <template v-slot:item.machine_process_lists="{ item }">
            <template v-if="item.raw.machine_process_lists">
              <div v-for="(mp_list_item, mp_list_idx) in item.raw.machine_process_lists" :key="mp_list_idx">
                <b>{{ mp_list_item.machine_process_list_title }}:</b>{{ mp_list_item.machine_process_list_value }}
              </div>
            </template>
          </template>
        </v-data-table-server>
      </v-card-text>
      <v-card-text class="d-flex justify-center gap-2 mb-4">
        <v-btn :color="dialogAttr.btn_emit.color" @click="handleEmit()">บันทึก</v-btn>
        <v-btn color="secondary" @click="modelValue.show = false">ยกเลิก</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>