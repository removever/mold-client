<script lang="ts" setup>
import Swal from "sweetalert2"
import { uuid } from 'vue-uuid'
import {
  NewJobPart,
  NewJobProcess,
  NewJobSub,
  JobPart,
  JobSub,
  JobProcess,
  JobPartDialog,
  JobProcessDialog,
  JobSubDialog,
  DialogAction,
} from "~~/misc/types"

const emit = defineEmits<{
  (e: 'update:model-value', job_parts: JobPart[]): void,
}>()

const props = defineProps({
  modelValue: { type: Object as PropType<JobPart[]>, required: true, },
})

const pending = ref(true)
const schedule_format = ref("hour")
const schedule_day = ref(10)
const refresh_part_dialog = ref(0)
const refresh_process_dialog = ref(0)
const refresh_sub_dialog = ref(0)
const job_parts = ref<JobPart[]>(props.modelValue)
const job_sub_buffer = ref<{ [key: string]: JobSub[] }>({})
const job_process_buffer = ref<{ [key: string]: JobProcess[] }>({})
const job_part_dialog = ref<JobPartDialog>({
  action: 'add',
  show: false,
  job_part_id: '',
  job_id: '',
  job_pre_part_ids: [],
  job_part_name: '',
  job_part_day: 0,
  job_part_hour: 0,
  job_part_minute: 0,
  job_part_remark: '',
  duplicate_id: '',
})
const job_sub_dialog = ref<JobSubDialog>({
  action: 'add',
  show: false,
  job_sub_id: '',
  job_part_id: '',
  job_id: '',
  job_pre_sub_ids: [],
  job_sub_name: '',
  job_sub_day: 0,
  job_sub_hour: 0,
  job_sub_minute: 0,
  job_sub_remark: '',
  duplicate_id: '',
})
const job_process_dialog = ref<JobProcessDialog>({
  action: 'add',
  show: false,
  job_process_id: '',
  job_part_id: '',
  job_sub_id: '',
  job_id: '',
  job_pre_process_ids: [],
  process_id: '',
  job_process_name: '',
  job_process_day: 0,
  job_process_hour: 0,
  job_process_minute: 0,
  job_process_setup_time: 0,
  job_process_setup_finish_time: 0,
  job_process_x: 0,
  job_process_y: 0,
  job_process_z: 0,
  job_process_remark: '',
  duplicate_id: '',
})

const cellScale = computed(() => schedule_format.value === 'day' ? 10 : 1)

onMounted(async () => {
  try {

  } catch (e) {
    console.log(e)
  }

  pending.value = false
})

function summaryJobTime() {
  if (job_parts.value.length === 0) return '-'

  const end_minute = Math.max(...job_parts.value.map(job_part => job_part.job_part_end_minute))

  const day = Math.floor((end_minute / 1440))
  const hour = Math.floor((end_minute % 1440) / 60)
  const minute = end_minute % 60

  return genPeriodTxtTH(day, hour, minute)
}

function showJobPartDialog(job_part?: JobPart, action: DialogAction = 'add') {
  refresh_part_dialog.value++

  if (job_part) {
    if (action === 'duplicate') {
      job_part_dialog.value = {
        ...job_part,
        duplicate_id: job_part.job_part_id,
        action,
        show: true,
      }
    } else {
      job_part_dialog.value = { ...job_part, action, show: true, }
    }
  } else {
    job_part_dialog.value = {
      action,
      show: true,
      job_part_id: '',
      job_id: '',
      job_pre_part_ids: [],
      job_part_name: '',
      job_part_day: 0,
      job_part_hour: 0,
      job_part_minute: 0,
      job_part_remark: '',
      duplicate_id: '',
    }
  }
}

function showJobSubDialog(job_part: JobPart, job_sub?: JobSub, action: DialogAction = 'add') {
  refresh_sub_dialog.value++

  if (job_sub) {
    job_sub_dialog.value = { ...job_sub, action, show: true, }
  } else {
    job_sub_dialog.value = {
      action,
      show: true,
      job_sub_id: '',
      job_part_id: job_part.job_part_id,
      job_id: '',
      job_pre_sub_ids: [],
      job_sub_name: '',
      job_sub_day: 0,
      job_sub_hour: 0,
      job_sub_minute: 0,
      job_sub_remark: '',
      duplicate_id: '',
    }
  }
}

function showJobProcessDialog(
  job_sub: JobSub,
  job_process?: JobProcess,
  action: DialogAction = 'add'
) {
  refresh_process_dialog.value++

  if (job_process) {
    job_process_dialog.value = { ...job_process, action, show: true, }
  } else {
    job_process_dialog.value = {
      action,
      show: true,
      job_process_id: '',
      job_part_id: job_sub.job_part_id,
      job_sub_id: job_sub.job_sub_id,
      job_id: '',
      job_pre_process_ids: [],
      process_id: '',
      job_process_name: '',
      job_process_day: 0,
      job_process_hour: 0,
      job_process_minute: 0,
      job_process_setup_time: 0,
      job_process_setup_finish_time: 0,
      job_process_x: 0,
      job_process_y: 0,
      job_process_z: 0,
      job_process_remark: '',
      duplicate_id: '',
    }
  }
}

const handleAddJobPart = () => addJobPart([job_part_dialog.value])
const handleAddJobSub = () => addJobSub([job_sub_dialog.value])
const handleAddJobProcess = () => addJobProcess([job_process_dialog.value])

function addJobPart(add_parts: NewJobPart[]) {
  const new_id_buffer: { [key: string]: string } = {}

  add_parts.filter(val => val.job_part_id).forEach(add_part => {
    new_id_buffer[add_part.job_part_id] = uuid.v4()
  })

  add_parts.forEach(add_part => {
    const {
      job_part_end_minute,
      job_part_start_minute,
      job_part_period,
    } = calcJobPartTime(add_part)

    job_parts.value.push({
      ...add_part,
      job_part_id: new_id_buffer[add_part.job_part_id] ?? uuid.v4(),
      job_pre_part_ids: add_part.job_pre_part_ids.map(val => new_id_buffer[val] || val),
      job_part_priority: job_parts.value.length,
      job_part_end_minute,
      job_part_start_minute,
      job_part_period,
      job_part_end_time: '',
      job_part_start_time: '',
      job_part_status: '',
    })
  })

  swapJobPart()

  return new_id_buffer
}

function addJobSub(add_subs: NewJobSub[]) {
  const job_part_ids: string[] = []
  const new_id_buffer: { [key: string]: string } = {}

  add_subs.filter(val => val.job_sub_id).forEach(add_sub => {
    new_id_buffer[add_sub.job_sub_id] = uuid.v4()
  })

  add_subs.forEach(add_sub => {
    const { job_part_id } = add_sub

    if (!job_sub_buffer.value[job_part_id]) job_sub_buffer.value[job_part_id] = []

    const {
      job_sub_end_minute,
      job_sub_start_minute,
      job_sub_period,
    } = calcJobSubTime(add_sub)

    job_sub_buffer.value[add_sub.job_part_id].push({
      ...add_sub,
      job_sub_id: new_id_buffer[add_sub.job_sub_id] ?? uuid.v4(),
      job_pre_sub_ids: add_sub.job_pre_sub_ids.map(val => new_id_buffer[val] || val),
      job_sub_priority: job_sub_buffer.value[add_sub.job_part_id]?.length || 0,
      job_sub_end_minute,
      job_sub_start_minute,
      job_sub_period,
      job_sub_end_time: '',
      job_sub_start_time: '',
      job_sub_status: '',
    })

    job_part_ids.push(job_part_id)
  })

  swapJobSub(Array.from(new Set(job_part_ids)))
}

function addJobProcess(add_processes: NewJobProcess[]) {
  const job_sub_ids: string[] = []
  const new_id_buffer: { [key: string]: string } = {}

  add_processes.filter(val => val.job_sub_id).forEach(add_process => {
    new_id_buffer[add_process.job_sub_id] = uuid.v4()
  })

  add_processes.forEach(add_process => {
    const { job_sub_id } = add_process

    if (!job_process_buffer.value[job_sub_id]) job_process_buffer.value[job_sub_id] = []

    const {
      job_process_end_minute,
      job_process_start_minute,
      job_process_period,
    } = calcJobProcessTime(add_process)

    job_process_buffer.value[add_process.job_sub_id].push({
      ...add_process,
      job_process_id: new_id_buffer[add_process.job_sub_id] ?? uuid.v4(),
      job_pre_process_ids: add_process.job_pre_process_ids.map(val => new_id_buffer[val] || val),
      job_process_priority: job_process_buffer.value[add_process.job_sub_id]?.length || 0,
      job_process_end_minute,
      job_process_start_minute,
      job_process_period,
      job_process_end_time: '',
      job_process_start_time: '',
      job_process_status: '',
      job_process_care: 0,
      job_process_condition_id: '',
      job_process_max_speed: 0,
      job_process_min_speed: 0,
      job_process_performance: 0,
      job_process_work_machine_id: '',
      job_process_work_after: '',
      job_process_type: '',
      job_priority: 0,
      job_part_priority: 0,
      job_sub_priority: 0,
    })

    job_sub_ids.push(job_sub_id)
  })

  swapJobProcess(Array.from(new Set(job_sub_ids)))
}

function updateJobPart() {
  const {
    job_part_id,
    job_pre_part_ids,
    job_part_name,
    job_part_day,
    job_part_hour,
    job_part_minute,
    job_part_remark,
  } = job_part_dialog.value

  const job_part = job_parts.value.find(val => val.job_part_id === job_part_id)

  if (!job_part) return

  job_part.job_pre_part_ids = job_pre_part_ids
  job_part.job_part_name = job_part_name
  job_part.job_part_day = job_part_day
  job_part.job_part_hour = job_part_hour
  job_part.job_part_minute = job_part_minute
  job_part.job_part_remark = job_part_remark

  repositionPart(job_part_id)
  swapJobPart()
}

function updateJobSub() {
  const {
    job_sub_id,
    job_part_id,
    job_pre_sub_ids,
    job_sub_name,
    job_sub_day,
    job_sub_hour,
    job_sub_minute,
    job_sub_remark,
  } = job_sub_dialog.value

  const job_subs = job_sub_buffer.value[job_part_id]
  const job_sub = job_subs?.find(val => val.job_sub_id === job_sub_id)

  if (!job_sub) return

  job_sub.job_pre_sub_ids = job_pre_sub_ids
  job_sub.job_sub_name = job_sub_name
  job_sub.job_sub_day = job_sub_day
  job_sub.job_sub_hour = job_sub_hour
  job_sub.job_sub_minute = job_sub_minute
  job_sub.job_sub_remark = job_sub_remark

  repositionSub(job_part_id, job_sub_id)
  swapJobSub([job_part_id])
}

function updateJobProcess() {
  const {
    job_process_id,
    job_sub_id,
    job_pre_process_ids,
    job_process_name,
    job_process_day,
    job_process_hour,
    job_process_minute,
    job_process_remark,
  } = job_process_dialog.value

  const job_processes = job_process_buffer.value[job_sub_id]
  const job_process = job_processes?.find(val => val.job_process_id === job_process_id)

  if (!job_process) return

  job_process.job_pre_process_ids = job_pre_process_ids
  job_process.job_process_name = job_process_name
  job_process.job_process_day = job_process_day
  job_process.job_process_hour = job_process_hour
  job_process.job_process_minute = job_process_minute
  job_process.job_process_remark = job_process_remark

  repositionProcess(job_sub_id, job_process_id)
  swapJobProcess([job_sub_id])
}

function repositionPart(job_part_id: string) {
  const primary_item = job_parts.value.find(val => val.job_part_id === job_part_id)

  if (!primary_item) return

  const primary_period = calcJobPartTime(primary_item)

  primary_item.job_part_end_minute = primary_period.job_part_end_minute
  primary_item.job_part_start_minute = primary_period.job_part_start_minute

  job_sub_buffer.value[job_part_id]?.forEach(job_sub => {
    repositionSub(job_sub.job_part_id, job_sub.job_sub_id)
  })

  job_parts.value.filter(val => val.job_pre_part_ids.includes(job_part_id)).forEach(job_part => {
    repositionPart(job_part.job_part_id)
  })
}

function repositionSub(job_part_id: string, job_sub_id: string) {
  if (!job_sub_buffer.value[job_part_id]) return

  const primary_item = job_sub_buffer.value[job_part_id].find(val => val.job_sub_id === job_sub_id)

  if (!primary_item) return

  const primary_period = calcJobSubTime(primary_item)

  primary_item.job_sub_start_minute = primary_period.job_sub_start_minute
  primary_item.job_sub_end_minute = primary_period.job_sub_end_minute

  job_process_buffer.value[job_sub_id]?.forEach(job_process => {
    repositionProcess(job_process.job_sub_id, job_process.job_process_id)
  })

  job_sub_buffer.value[job_part_id].filter(val => val.job_pre_sub_ids.includes(job_sub_id)).forEach(job_sub => {
    repositionSub(job_sub.job_part_id, job_sub.job_sub_id)
  })
}

function repositionProcess(job_sub_id: string, job_process_id: string) {
  if (!job_process_buffer.value[job_sub_id]) return

  const primary_item = job_process_buffer.value[job_sub_id].find(val => val.job_process_id === job_process_id)

  if (!primary_item) return

  const primary_period = calcJobProcessTime(primary_item)

  primary_item.job_process_start_minute = primary_period.job_process_start_minute
  primary_item.job_process_end_minute = primary_period.job_process_end_minute

  job_process_buffer.value[job_sub_id].filter(val => val.job_pre_process_ids.includes(job_process_id)).forEach(job_process => {
    repositionProcess(job_process.job_sub_id, job_process.job_process_id)
  })
}

function deleteJobPart(del_item: JobPart) {
  const { job_part_id } = del_item

  const idx = job_parts.value.findIndex(val => val.job_part_id === job_part_id)

  if (idx === -1) return

  job_sub_buffer.value[job_part_id]?.forEach(job_sub => {
    delete job_process_buffer.value[job_sub.job_sub_id]
  })
  delete job_sub_buffer.value[job_part_id]

  job_parts.value.splice(idx, 1)
  job_parts.value.filter(val => val.job_pre_part_ids.includes(job_part_id)).forEach(job_part => {
    job_part.job_pre_part_ids = job_part.job_pre_part_ids.filter(val => val !== job_part_id)

    repositionPart(job_part.job_part_id)
  })

  swapJobPart()
}

function deleteJobSub(del_item: JobSub) {
  const { job_sub_id, job_part_id } = del_item

  delete job_process_buffer.value[job_sub_id]

  if (!job_sub_buffer.value[job_part_id]) return

  const idx = job_sub_buffer.value[job_part_id].findIndex(val => val.job_sub_id === job_sub_id)

  if (idx === -1) return

  job_sub_buffer.value[job_part_id].splice(idx, 1)
  job_sub_buffer.value[job_part_id].filter(val => val.job_pre_sub_ids.includes(job_sub_id)).forEach(job_sub => {
    job_sub.job_pre_sub_ids = job_sub.job_pre_sub_ids.filter(val => val !== job_sub_id)

    repositionSub(job_part_id, job_sub.job_sub_id)
  })

  swapJobSub([job_part_id])
}

function deleteJobProcess(del_item: JobProcess) {
  const { job_sub_id, job_process_id } = del_item

  if (!job_process_buffer.value[job_sub_id]) return

  const idx = job_process_buffer.value[job_sub_id].findIndex(val => val.job_process_id === job_process_id)

  if (idx === -1) return

  job_process_buffer.value[job_sub_id].splice(idx, 1)
  job_process_buffer.value[job_sub_id].filter(val => val.job_pre_process_ids.includes(job_process_id)).forEach(job_process => {
    job_process.job_pre_process_ids = job_process.job_pre_process_ids.filter(val => val !== job_process_id)

    repositionProcess(job_sub_id, job_process.job_process_id)
  })

  swapJobProcess([job_sub_id])
}

const onDeleteJobPart = (job_part: JobPart) => Swal.fire({
  title: `ยืนยันการลบชิ้นส่วน`,
  text: `คุณแน่ใจหรือว่าต้องการลบ ${job_part.job_part_name} ?`,
  icon: "warning",
  showCancelButton: true,
}).then(({ value }) => value && deleteJobPart(job_part))

const onDeleteJobSub = (job_sub: JobSub) => Swal.fire({
  title: `ยืนยันการลบชิ้นส่วนย่อย`,
  text: `คุณแน่ใจหรือว่าต้องการลบ ${job_sub.job_sub_name} ?`,
  icon: "warning",
  showCancelButton: true,
}).then(({ value }) => value && deleteJobSub(job_sub))

const onDeleteJobProcess = (job_process: JobProcess) => Swal.fire({
  title: `ยืนยันการลบกระบวนการ`,
  text: `คุณแน่ใจหรือว่าต้องการลบ ${job_process.job_process_name} ?`,
  icon: "warning",
  showCancelButton: true,
}).then(({ value }) => value && deleteJobProcess(job_process))

function calcJobPartTime(job_part: {
  job_pre_part_ids: string[],
  duplicate_id: string,
  job_part_day: number,
  job_part_hour: number,
  job_part_minute: number,
}): {
  job_part_end_minute: number,
  job_part_start_minute: number,
  job_part_period: number,
} {
  const job_pre_parts = job_parts.value.filter(val => job_part.job_pre_part_ids.includes(val.job_part_id))

  const result = {
    job_part_start_minute: 0,
    job_part_end_minute: 0,
    job_part_period: 0,
  }

  if (job_part.duplicate_id) {
    const duplicate = job_parts.value.find(val => val.job_part_id === job_part.duplicate_id)

    result.job_part_start_minute = duplicate?.job_part_start_minute ?? 0
  } else if (job_part.job_pre_part_ids.length) {
    result.job_part_start_minute = Math.max(...job_pre_parts.map(item => item.job_part_end_minute))
  }

  result.job_part_period = 0
  result.job_part_period += job_part.job_part_day * 24 * 60
  result.job_part_period += job_part.job_part_hour * 60
  result.job_part_period += job_part.job_part_minute
  result.job_part_end_minute = result.job_part_start_minute + result.job_part_period

  return result
}

function calcJobSubTime(job_sub: any): JobSub {
  const job_part = job_parts.value.find(val => val.job_part_id === job_sub.job_part_id)
  const job_subs = job_sub_buffer.value[job_sub.job_part_id]

  job_sub.job_sub_start_minute = job_part ? job_part.job_part_start_minute : 0

  if (job_subs) {
    const job_pre_parts = job_subs.filter(val => job_sub.job_pre_sub_ids.includes(val.job_sub_id))

    if (job_sub.duplicate_id) {
      const duplicate = job_subs.find(val => val.job_sub_id === job_sub.duplicate_id)

      job_sub.job_sub_start_minute = duplicate?.job_sub_start_minute ?? 0
    } else if (job_sub.job_pre_sub_ids.length) {
      job_sub.job_sub_start_minute = Math.max(...job_pre_parts.map(item => item.job_sub_end_minute))
    }
  }

  job_sub.job_sub_period = 0
  job_sub.job_sub_period += job_sub.job_sub_day * 24 * 60
  job_sub.job_sub_period += job_sub.job_sub_hour * 60
  job_sub.job_sub_period += job_sub.job_sub_minute
  job_sub.job_sub_end_minute = job_sub.job_sub_start_minute + job_sub.job_sub_period

  return job_sub
}

function calcJobProcessTime(job_process: any): JobProcess {
  const job_sub = job_sub_buffer.value[job_process.job_part_id]?.find(val => val.job_sub_id === job_process.job_sub_id)
  const job_processes = job_process_buffer.value[job_process.job_sub_id]

  job_process.job_process_start_minute = job_sub ? job_sub.job_sub_start_minute : 0

  if (job_processes) {
    const job_pre_parts = job_processes.filter(val => job_process.job_pre_process_ids.includes(val.job_process_id))

    if (job_process.duplicate_id) {
      const duplicate = job_processes.find(val => val.job_process_id === job_process.duplicate_id)

      job_process.job_process_start_minute = duplicate?.job_process_start_minute ?? 0
    } else if (job_process.job_pre_process_ids.length) {
      job_process.job_process_start_minute = Math.max(...job_pre_parts.map(item => item.job_process_end_minute))
    }
  }

  job_process.job_process_period = 0
  job_process.job_process_period += job_process.job_process_day * 24 * 60
  job_process.job_process_period += job_process.job_process_hour * 60
  job_process.job_process_period += job_process.job_process_minute
  job_process.job_process_end_minute = job_process.job_process_start_minute + job_process.job_process_period

  return job_process
}

const swapJobPart = () => {
  const jp_sorteds = job_parts.value.toSorted((a, b) => {
    if (a.job_part_start_minute > b.job_part_start_minute) return 1
    if (a.job_part_start_minute < b.job_part_start_minute) return -1
    if (a.job_part_period > b.job_part_period) return 1
    if (a.job_part_period < b.job_part_period) return -1
    if (a.duplicate_id > b.duplicate_id) return 1
    if (a.duplicate_id < b.duplicate_id) return -1

    return 0
  })

  const jp_swappeds = [...jp_sorteds]

  jp_sorteds.forEach((jp_sorted, idx) => {
    const jp_wait_swappeds = jp_swappeds.filter(val => val.job_pre_part_ids.includes(jp_sorted.job_part_id))

    for (const [jpws_idx, jp_wait_swapped] of jp_wait_swappeds.entries()) {
      const job_pre_parts = jp_swappeds.filter(val => jp_wait_swapped.job_pre_part_ids.includes(val.job_part_id))

      if (job_pre_parts[job_pre_parts.length - 1].job_part_id === jp_sorted.job_part_id) {
        const delete_index = jp_swappeds.findIndex(val => val.job_part_id === jp_wait_swapped.job_part_id)

        jp_swappeds.splice(delete_index, 1)
        jp_swappeds.splice(idx + jpws_idx + 1, 0, jp_wait_swapped)
      }
    }
  })

  job_parts.value = jp_swappeds

  emit('update:model-value', job_parts.value)
}

const swapJobSub = (job_part_ids: string[]) => {
  job_part_ids.forEach(job_part_id => {
    const js_sorteds = job_sub_buffer.value[job_part_id].toSorted((a, b) => {
      if (a.job_sub_start_minute > b.job_sub_start_minute) return 1
      if (a.job_sub_start_minute < b.job_sub_start_minute) return -1
      if (a.job_sub_period > b.job_sub_period) return 1
      if (a.job_sub_period < b.job_sub_period) return -1
      if (a.duplicate_id > b.duplicate_id) return 1
      if (a.duplicate_id < b.duplicate_id) return -1

      return 0
    })

    const js_swappeds = [...js_sorteds]

    js_sorteds.forEach((js_sorted, idx) => {
      const js_wait_swappeds = js_swappeds.filter(val => val.job_pre_sub_ids.includes(js_sorted.job_sub_id))

      for (const [jpws_idx, js_wait_swapped] of js_wait_swappeds.entries()) {
        const job_pre_subs = js_swappeds.filter(val => js_wait_swapped.job_pre_sub_ids.includes(val.job_sub_id))

        if (job_pre_subs[job_pre_subs.length - 1].job_sub_id === js_sorted.job_sub_id) {
          const delete_index = js_swappeds.findIndex(val => val.job_sub_id === js_wait_swapped.job_sub_id)

          js_swappeds.splice(delete_index, 1)
          js_swappeds.splice(idx + jpws_idx + 1, 0, js_wait_swapped)
        }
      }
    })

    job_sub_buffer.value[job_part_id] = js_swappeds
  })
}

const swapJobProcess = (job_sub_ids: string[]) => {
  job_sub_ids.forEach(job_sub_id => {
    const jpc_sorteds = job_process_buffer.value[job_sub_id].toSorted((a, b) => {
      if (a.job_process_start_minute > b.job_process_start_minute) return 1
      if (a.job_process_start_minute < b.job_process_start_minute) return -1
      if (a.job_process_period > b.job_process_period) return 1
      if (a.job_process_period < b.job_process_period) return -1
      if (a.duplicate_id > b.duplicate_id) return 1
      if (a.duplicate_id < b.duplicate_id) return -1

      return 0
    })

    const jpc_swappeds = [...jpc_sorteds]

    jpc_sorteds.forEach((jpc_sorted, idx) => {
      const js_wait_swappeds = jpc_swappeds.filter(val => val.job_pre_process_ids.includes(jpc_sorted.job_process_id))

      for (const [jpws_idx, js_wait_swapped] of js_wait_swappeds.entries()) {
        const job_pre_processes = jpc_swappeds.filter(val => js_wait_swapped.job_pre_process_ids.includes(val.job_process_id))

        if (job_pre_processes[job_pre_processes.length - 1].job_process_id === jpc_sorted.job_process_id) {
          const delete_index = jpc_swappeds.findIndex(val => val.job_process_id === js_wait_swapped.job_process_id)

          jpc_swappeds.splice(delete_index, 1)
          jpc_swappeds.splice(idx + jpws_idx + 1, 0, js_wait_swapped)
        }
      }
    })

    job_process_buffer.value[job_sub_id] = jpc_swappeds
  })
}

const genPeriodTxtTH = (day: number, hour: number, minute: number): string => {
  const buffers = []

  if (day) buffers.push(`${day} วัน`)
  if (hour) buffers.push(`${hour} ชั่วโมง`)
  if (minute) buffers.push(`${minute} นาที`)

  return buffers.join(' ')
} 
</script>

<template>
  <template v-if="pending">
    <div class="text-center my-4">
      <v-label>กำลังโหลดข้อมูล..</v-label>
      <v-progress-circular class="ml-4" indeterminate color="primary"></v-progress-circular>
    </div>
  </template>
  <template v-else>
    <div class="mb-2">
      <v-btn color="success" @click="showJobPartDialog()">
        <v-icon size="20">mdi-plus</v-icon> เพิ่มชิ้นส่วน
      </v-btn>
    </div>
    <v-toolbar>
      <v-toolbar-title>เวลารวม : {{ summaryJobTime() }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :color="schedule_format === 'hour' ? 'success' : 'muted'" @click="schedule_format = 'hour'">
        <v-icon size="20">mdi-clock</v-icon> ชั่วโมง
      </v-btn>
      <v-btn :color="schedule_format === 'day' ? 'success' : 'muted'" @click="schedule_format = 'day'">
        <v-icon size="20">mdi-calendar</v-icon> วัน
      </v-btn>
    </v-toolbar>
    <div class="revel-schedule">
      <div class="revel-table-container">
        <div class="revel-table-wrap revel-timeline-view revel-timeline-week-view revel-current-panel">
          <table class="revel-schedule-table revel-outer-table">
            <tbody>
              <tr>
                <td class="revel-resource-left-td">
                  <div class="revel-date-header-wrap">
                    <table class="revel-schedule-table">
                      <tbody>
                        <tr>
                          <td>วันที่</td>
                        </tr>
                        <tr v-if="schedule_format === 'hour'">
                          <td>ชั่วโมง</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
                <td>
                  <div class="revel-date-header-container">
                    <div class="revel-date-header-wrap">
                      <table :class="{ 'revel-schedule-table': 1, 'view-hour': schedule_format === 'hour' }"
                        aria-describedby="header">
                        <tbody>
                          <template v-if="schedule_format === 'day'">
                            <tr class="revel-header-row">
                              <template v-for="day_idx in schedule_day">
                                <td class="revel-header-cells">{{ day_idx }}</td>
                              </template>
                            </tr>
                          </template>
                          <template v-else>
                            <tr class="revel-header-row">
                              <template v-for="day_idx in schedule_day">
                                <td class="revel-header-cells" colSpan="24">{{ day_idx }}</td>
                              </template>
                            </tr>
                            <tr class="revel-header-row">
                              <template v-for="hour_idx in 24">
                                <td class="revel-time-slots">{{ hour_idx }}</td>
                              </template>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="revel-resource-column-wrap">
                    <table class="table revel-schedule-table revel-resource-column-table" aria-describedby="body">
                      <tbody>
                        <template v-for="(job_part_item, job_part_idx) in job_parts" :key="job_part_idx">
                          <tr>
                            <td class="revel-resource-cells pr-2">
                              <div class="d-flex justify-space-between">
                                <div style="max-width: 150px;">
                                  <div class="line-1">{{ job_part_item.job_part_name }}</div>
                                  <div class="text-caption text-muted">
                                    {{
                                      genPeriodTxtTH(
                                        job_part_item.job_part_day,
                                        job_part_item.job_part_hour,
                                        job_part_item.job_part_minute
                                      )
                                    }}
                                  </div>
                                </div>
                                <template v-if="!job_part_item.duplicate_id">
                                  <v-menu offset-y>
                                    <template v-slot:activator="{ props }">
                                      <v-label class="cursor-pointer" icon v-bind="props">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                      </v-label>
                                    </template>
                                    <v-list>
                                      <v-list-item class="cursor-pointer" density="compact"
                                        @click="showJobSubDialog(job_part_item)">
                                        <v-list-item-title>
                                          <v-icon color="save" size="20"> mdi-plus</v-icon> เพิ่มชิ้นส่วนย่อย
                                        </v-list-item-title>
                                      </v-list-item>
                                      <v-list-item class="cursor-pointer" density="compact"
                                        @click="showJobPartDialog(job_part_item, 'update')">
                                        <v-list-item-title>
                                          <v-icon color="warning" size="20"> mdi-square-edit-outline</v-icon> แก้ไข
                                        </v-list-item-title>
                                      </v-list-item>
                                      <v-list-item class="cursor-pointer" density="compact"
                                        @click="showJobPartDialog(job_part_item, 'duplicate')">
                                        <v-list-item-title>
                                          <v-icon color="warning" size="20"> mdi-square-edit-outline</v-icon> คัดลอก
                                        </v-list-item-title>
                                      </v-list-item>
                                      <v-list-item class="cursor-pointer" density="compact"
                                        @click="onDeleteJobPart(job_part_item)">
                                        <v-list-item-title>
                                          <v-icon color="error" size="20"> mdi-close-thick</v-icon> ลบ
                                        </v-list-item-title>
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                </template>
                              </div>
                            </td>
                          </tr>
                          <template v-for="(job_sub_item, job_sub_idx) in job_sub_buffer[job_part_item.job_part_id]"
                            :key="job_sub_idx">
                            <tr>
                              <td class="revel-resource-cells pr-2">
                                <div class="d-flex justify-space-between">
                                  <div style="max-width: 150px;">
                                    <div class="line-1">{{ job_sub_item.job_sub_name }}</div>
                                    <div class="text-caption text-muted">
                                      {{
                                        genPeriodTxtTH(
                                          job_sub_item.job_sub_day,
                                          job_sub_item.job_sub_hour,
                                          job_sub_item.job_sub_minute
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <template v-if="!job_part_item.duplicate_id && !job_sub_item.duplicate_id">
                                    <v-menu offset-y>
                                      <template v-slot:activator="{ props }">
                                        <v-label class="cursor-pointer" icon v-bind="props">
                                          <v-icon>mdi-dots-vertical</v-icon>
                                        </v-label>
                                      </template>
                                      <v-list>
                                        <v-list-item class="cursor-pointer" density="compact"
                                          @click="showJobProcessDialog(job_sub_item)">
                                          <v-list-item-title>
                                            <v-icon color="save" size="20"> mdi-plus</v-icon> เพิ่มกระบวนการ
                                          </v-list-item-title>
                                        </v-list-item>
                                        <v-list-item class="cursor-pointer" density="compact"
                                          @click="showJobSubDialog(job_part_item, job_sub_item, 'update')">
                                          <v-list-item-title>
                                            <v-icon color="warning" size="20"> mdi-square-edit-outline</v-icon> แก้ไข
                                          </v-list-item-title>
                                        </v-list-item>
                                        <v-list-item class="cursor-pointer" density="compact"
                                          @click="onDeleteJobSub(job_sub_item)">
                                          <v-list-item-title>
                                            <v-icon color="error" size="20"> mdi-close-thick</v-icon> ลบ
                                          </v-list-item-title>
                                        </v-list-item>
                                      </v-list>
                                    </v-menu>
                                  </template>
                                </div>
                              </td>
                            </tr>
                            <template
                              v-for="(job_process_item, job_proces_idx) in job_process_buffer[job_sub_item.job_sub_id]"
                              :key="job_proces_idx">
                              <tr>
                                <td class="revel-resource-cells pr-2">
                                  <div class="d-flex justify-space-between">
                                    <div style="max-width: 150px;">
                                      <div class="line-1">{{ job_process_item.job_process_name }}</div>
                                      <div class="text-caption text-muted">
                                        {{
                                          genPeriodTxtTH(
                                            job_process_item.job_process_day,
                                            job_process_item.job_process_hour,
                                            job_process_item.job_process_minute
                                          )
                                        }}
                                      </div>
                                    </div>
                                    <template v-if="!job_process_item.duplicate_id">
                                      <v-menu offset-y>
                                        <template v-slot:activator="{ props }">
                                          <v-label class="cursor-pointer" icon v-bind="props">
                                            <v-icon>mdi-dots-vertical</v-icon>
                                          </v-label>
                                        </template>
                                        <v-list>
                                          <v-list-item class="cursor-pointer" density="compact"
                                            @click="showJobProcessDialog(job_sub_item, job_process_item, 'update')">
                                            <v-list-item-title>
                                              <v-icon color="warning" size="20"> mdi-square-edit-outline</v-icon> แก้ไข
                                            </v-list-item-title>
                                          </v-list-item>
                                          <v-list-item class="cursor-pointer" density="compact"
                                            @click="onDeleteJobProcess(job_process_item)">
                                            <v-list-item-title>
                                              <v-icon color="error" size="20"> mdi-close-thick</v-icon> ลบ
                                            </v-list-item-title>
                                          </v-list-item>
                                        </v-list>
                                      </v-menu>
                                    </template>
                                  </div>
                                </td>
                              </tr>
                            </template>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </td>
                <td>
                  <div class="revel-content-wrap">
                    <!-- <table class="revel-schedule-table revel-content-table"> 
                      <tbody>{{_genBodyHourofDay(max_day)}}</tbody>
                    </table> -->
                    <div class="job-event-table">
                      <template v-for="(job_part_item, job_part_idx) in job_parts" :key="job_part_idx">
                        <div class='appointment-row'>
                          <div class='appointment-cell'
                            :style="{ width: `${job_part_item.job_part_period / cellScale}px`, left: `${job_part_item.job_part_start_minute / cellScale}px`, }">
                            <div className='appointment-subject line-1'>{{ job_part_item.job_part_name }}</div>
                            <div className='appointment-time line-1'>
                              {{
                                genPeriodTxtTH(
                                  job_part_item.job_part_day,
                                  job_part_item.job_part_hour,
                                  job_part_item.job_part_minute
                                )
                              }}
                            </div>
                          </div>
                        </div>
                        <template v-for="(job_sub_item, job_sub_idx) in job_sub_buffer[job_part_item.job_part_id]"
                          :key="job_sub_idx">
                          <div class='appointment-row'>
                            <div class='appointment-content'>
                              <div class='appointment-cell sub-cell'
                                :style="{ width: `${job_sub_item.job_sub_period / cellScale}px`, left: `${job_sub_item.job_sub_start_minute / cellScale}px`, }">
                                <div className='appointment-subject line-1'>{{ job_sub_item.job_sub_name }}</div>
                                <div className='appointment-time line-1'>
                                  {{
                                    genPeriodTxtTH(
                                      job_sub_item.job_sub_day,
                                      job_sub_item.job_sub_hour,
                                      job_sub_item.job_sub_minute
                                    )
                                  }}
                                </div>
                              </div>
                            </div>
                          </div>
                          <template
                            v-for="(job_process_item, job_process_idx) in job_process_buffer[job_sub_item.job_sub_id]"
                            :key="job_process_idx">
                            <div class='appointment-row'>
                              <div class='appointment-content'>
                                <div class='appointment-cell process-cell'
                                  :style="{ width: `${job_process_item.job_process_period / cellScale}px`, left: `${job_process_item.job_process_start_minute / cellScale}px`, }">
                                  <div className='appointment-subject'>{{ job_process_item.job_process_name }}</div>
                                  <div className='appointment-time'>
                                    {{
                                      genPeriodTxtTH(
                                        job_process_item.job_process_day,
                                        job_process_item.job_process_hour,
                                        job_process_item.job_process_minute
                                      )
                                    }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </template>
                      </template>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  <JobScheduleJobPartDialog :key="`part-dialog-${refresh_part_dialog}`" v-model="job_part_dialog" :job_parts="job_parts"
    @added="handleAddJobPart" @updated="updateJobPart" />
  <JobScheduleJobProcessDialog :key="`process-dialog-${refresh_process_dialog}`" v-model="job_process_dialog"
    :job_processes="job_process_buffer[job_process_dialog.job_sub_id]" @added="handleAddJobProcess"
    @updated="updateJobProcess" />
  <JobScheduleJobSubDialog :key="`sub-dialog-${refresh_sub_dialog}`" v-model="job_sub_dialog"
    :job_subs="job_sub_buffer[job_sub_dialog.job_part_id]" @added="handleAddJobSub" @updated="updateJobSub" />
</template>