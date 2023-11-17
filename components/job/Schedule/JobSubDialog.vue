<script lang="ts" setup>
import Swal from "sweetalert2"
import { JobSub, JobSubDialog, } from "~~/misc/types"

const emit = defineEmits<{
  (e: 'added'): void,
  (e: 'updated'): void,
}>()

const props = defineProps({
  modelValue: { type: Object as PropType<JobSubDialog>, required: true },
  job_subs: { type: Array as PropType<JobSub[]>, default: [], required: true, },
})

const persistent = ref(false)
const job_pre_options = ref(props.job_subs.filter(val => val.job_sub_id !== props.modelValue.job_sub_id).map(item => ({
  value: item.job_sub_id,
  title: item.job_sub_name,
})))

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

function validateValue(): boolean {
  const {
    job_sub_name,
    job_sub_day,
    job_sub_hour,
    job_sub_minute,
  } = props.modelValue

  const result = { is_error: false, text: '', }

  if (!(job_sub_name)) {
    result.is_error = true
    result.text = 'กรุณากรอกข้อมูลให้ครบถ้วน'
  } else if (!(job_sub_day || job_sub_hour || job_sub_minute)) {
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
      <v-card-title class="text-h5">{{ dialogAttr.header.txt }}ชิ้นส่วนย่อย</v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="4">
            <v-label class="mb-2">ชื่อ / Name <span class="text-error ml-1">*</span></v-label>
            <v-text-field v-model="modelValue.job_sub_name" density="compact" variant="outlined" hint="Example : Sub 1."
              :rules="[rules.required]" />
          </v-col>
          <v-col md="4">
            <v-label class="mb-2">เริ่มหลังจาก / Begin After</v-label>
            <v-select v-model="modelValue.job_pre_sub_ids" :items="job_pre_options" multiple density="compact"
              variant="outlined" hide-details />
          </v-col>
          <v-col md="6">
            <v-label class="mb-2">เวลาทำงาน / Time <span class="text-error ml-1">*</span></v-label>
            <div class="d-flex gap-2" style="max-width: 600px;">
              <v-select v-model="modelValue.job_sub_day" :items="day_options" density="compact" variant="outlined"
                hide-details />
              <v-select v-model="modelValue.job_sub_hour" :items="hour_options" density="compact" variant="outlined"
                hide-details />
              <v-select v-model="modelValue.job_sub_minute" :items="minute_options" density="compact" variant="outlined"
                hide-details />
            </div>
            <p class="text-caption text-muted">Example : 1 วัน 5 ชั่วโมง 30 นาที</p>
          </v-col>
          <v-col md="12">
            <v-label class="mb-2">หมายเหตุ / Remark</v-label>
            <v-textarea v-model="modelValue.job_sub_remark" rows="2" density="compact" variant="outlined" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="d-flex justify-center gap-2 mb-4">
        <v-btn :color="dialogAttr.btn_emit.color" @click="handleEmit()">บันทึก</v-btn>
        <v-btn color="secondary" @click="modelValue.show = false">ยกเลิก</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>