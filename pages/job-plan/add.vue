
<script lang="ts" setup>
import Swal from "sweetalert2"
import { VLabel } from "vuetify/lib/components/index.mjs";
import { Job, JobPart, JobPosition, JobSub, JobType, User } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] })

const { getJobTypeBy, } = useJobType()
const { getJobBy, insertJob } = useJob()
const { getUserBy, } = useUser()

const router = useRouter()

const pending = ref(true)
const submitting = ref(false)
const job = ref<Job>({
  job_id: '',
  job_type_id: '',
  customer_id: '',
  job_date: null,
  job_due_date: null,
  job_name: '',
  job_priority: 0,
  job_status: '',
  job_time_start: '',
  job_time_end: '',
  job_time_period: '',
  job_remark: '',
  cad_id: '',
  cad_date: null,
})
const job_parts = ref<JobPart[]>([])
const job_subs = ref<JobSub[]>([])
const job_positions = ref<JobPosition[]>([])
const job_types = ref<JobType[]>([])
const users = ref<User[]>([])
const user_jobs = ref<{ [key: string]: Job[] }>({})

const cad_options = ref<{ value: string, title: string, }[]>([])
const job_type_options = ref<{ value: string, title: string, }[]>([])

onMounted(async () => {
  try {
    job_types.value = await getJobTypeBy().then(res => res.docs)
    users.value = await getUserBy({ user_position_id: "UPS20210322001", }).then(res => res.docs)

    const jobs = await getJobBy().then(res => res.docs)

    cad_options.value = [{ value: '', title: '- เลือก CAD | CAM -', }, ...users.value.map(item => ({
      value: item.user_id,
      title: `${item.user_name} ${item.user_lastname}`,
    }))]

    job_type_options.value = [{ value: '', title: '- เลือกประเภทงาน -', }, ...job_types.value.map(item => ({
      value: item.job_type_id,
      title: item.job_type_name,
    }))]

    users.value.forEach(user => {
      user_jobs.value[user.user_id] = jobs.filter(val => val.cad_id === user.user_id)
    })
  } catch (e) {
    console.log(e)
  }

  pending.value = false
})

async function onSubmit() {
  if (submitting.value || !validateForm()) return

  try {
    submitting.value = true

    job_parts.value.forEach(job_part => {
      job_part.job_subs = job_subs.value.filter(val => val.job_part_id === job_part.job_part_id)
    });

    await insertJob({
      job: job.value,
      job_parts: job_parts.value,
      job_positions: job_positions.value,
    });

    void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })
    await router.push({ path: '/user' });
  } catch (e) {
    console.log(e)

    submitting.value = false
  }
}

function validateForm(): boolean {
  const {
    job_name,
    job_type_id,
    job_date,
    job_due_date,
  } = job.value

  if (!(job_name
    && job_type_id
    && job_date
    && job_due_date
  )) {
    void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
    return false
  }

  return true
}
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'แผนงาน ', to: '/job-plan', },
    { title: 'เพิ่มรายการใหม่', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg mb-2">
    <v-card-title>เพิ่มรายการใหม่</v-card-title>
    <v-card-text class="py-4">
      <v-row>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">ชื่องาน<span class="text-error ml-1">*</span></v-label>
          <v-text-field v-model="job.job_name" density="compact" variant="outlined"
            :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">ประเภทงาน<span class="text-error ml-1">*</span></v-label>
          <v-select v-model="job.job_type_id" :items="job_type_options" density="compact" variant="outlined"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">กำหนดเริ่ม (ค.ศ.) <span class="text-error ml-1">*</span></v-label>
          <v-text-field type="date" v-model="job.job_date" density="compact" variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">กำหนดเสร็จ (ค.ศ.) <span class="text-error ml-1">*</span></v-label>
          <v-text-field type="date" v-model="job.job_due_date" density="compact" variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="mb-2">หมายเหตุ</v-label>
          <v-textarea v-model="job.job_remark" rows="3" density="compact" variant="outlined"></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card elevation="10" class="withbg mb-2">
    <v-card-title>MASTER PLAN</v-card-title>
    <v-card-text class="py-4">
      <job-schedule v-model="job_parts" @update:model-value="(e: any) => console.log(e)"></job-schedule>
    </v-card-text>
  </v-card>
  <v-card elevation="10" class="withbg mb-2">
    <v-card-title>CAD / CAM</v-card-title>
    <v-card-text class="py-4">
      <table className="table table-bordered table-hover" aria-describedby="cad">
        <thead>
          <tr>
            <th class="text-center" style="width: 400px;">CAD / CAM</th>
            <th class="text-center"> งานที่มอบหมาย </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(user_item, user_idx) in users" :key="user_idx">
            <tr>
              <td class="align-middle">{{ user_item.user_name }} {{ user_item.user_lastname }}</td>
              <td>
                <div class="d-flex gap-2">
                  <template v-for="(job_item, job_idx) in user_jobs[user_item.user_id]" :key="job_idx">
                    <v-card elevation="10" class="withbg" width="180px">
                      <v-card-text class="bg-success">
                        <div class="line-1">{{ job_item.job_name }}</div>
                      </v-card-text>
                      <v-card-text class="px-2">
                        <div class="d-flex mb-2">
                          <v-icon class="mr-2">mdi-id-card</v-icon>
                          <div class="line-1">{{ job_item.job_id }}</div>
                        </div>
                        <div class="d-flex mb-2">
                          <v-icon class="mr-2">mdi-clock</v-icon>
                          <div class="line-1">{{ job_item.cad_date }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </template>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </v-card-text>
    <v-card-text class="py-4">
      <v-row>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">CAD | CAM <span class="text-error ml-1">*</span></v-label>
          <v-select v-model="job.cad_id" :items="cad_options" density="compact" variant="outlined"></v-select>
        </v-col>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">กำหนดออกเเบบเสร็จ (ค.ศ.) <span class="text-error ml-1">*</span></v-label>
          <v-text-field type="date" v-model="job.cad_date" density="compact" variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="mb-2">หมายเหตุ</v-label>
          <v-textarea v-model="job.job_remark" rows="3" density="compact" variant="outlined"></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn color="save" @click="onSubmit">
        <template v-if="submitting">
          <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
        </template> บันทึก
      </v-btn>
      <v-btn color="muted" :to="'/job-plan'">ยกเลิก</v-btn>
    </v-card-text>
  </v-card>
</template>