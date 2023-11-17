<script lang="ts" setup>
import Swal from "sweetalert2"
import { VDataTable } from 'vuetify/labs/components'

import { JobPart, JobSub, JobType } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });

const { getJobBy, deleteJobBy } = useJob()
const { getJobTypeBy, } = useJobType()

const { $auth } = useNuxtApp()

const { permission_add, permission_delete, permission_edit, } = $auth.getPermission('job')

type Headers = InstanceType<typeof VDataTable>['headers']

const headers: Headers = [
  { key: "operation", title: "...", sortable: false, width: 30, align: 'center', },
  { key: "no", title: "#", sortable: false, width: 36, align: 'center', },
  { key: "job_name", title: "งาน / Job", sortable: false, },
  { key: "job_type_name", title: "ประเภท / Type", sortable: false, width: 140, },
  { key: "job_period_date", title: "วันที่ / Date", sortable: false, width: 220, },
  { key: "job_part", title: "ส่วนประกอบ / Part", sortable: false, },
];

const pagination = ref({ page: 1, size: 20, })
const job_types = ref<JobType[]>([])
const part_expands = ref<string[]>([])

const job_type_objs = computed((): { [key: string]: JobType } => job_types.value.reduce((a, v) => ({ ...a, [v.job_type_id]: v }), {}))

const {
  data: jobs,
  pending: pendingJobs,
  refresh: refreshJobs,
} = await useAsyncData('jobs', () => getJobBy({
  pagination: pagination.value,
  options: ['job_parts:job_subs'],
}), {
  watch: [pagination.value]
})

watch(jobs, () => {
  part_expands.value = []
}, { flush: 'pre', immediate: true, deep: true })

onMounted(async () => {
  try {
    job_types.value = await getJobTypeBy().then(res => res.docs)
  } catch (e) {
    console.log(e)
  }
})

const onDelete = (code: string) => Swal.fire({
  title: "ยืนยันการลบรายการ",
  text: "คุณแน่ใจหรือว่าต้องการลบ ?",
  icon: "warning",
  showCancelButton: true,
}).then(async ({ value }) => {
  try {
    if (!value) return

    await deleteJobBy({ job_id: code })

    refreshJobs()

    void Swal.fire({ title: 'สำเร็จ', text: 'ลบข้อมูลแล้ว', icon: "success" })
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <v-card elevation="10" class="withbg mx-auto" color="grey-lighten-3">
    <v-card-title>แผนงาน / Job Plan</v-card-title>
    <v-card-item>
      <v-row class="mb-4">
        <v-col class="d-flex flex-wrap gap-2 align-center py-2" cols="12">
          <template v-if="permission_add">
            <v-btn elevation="3" color="primary" to="/job-plan/add">เพิ่มรายการใหม่</v-btn>
          </template>
        </v-col>
      </v-row>
      <v-data-table-server :loading="pendingJobs" :headers="headers" item-value="job_id" :items="jobs?.docs"
        :items-length="jobs?.totalDocs ?? 0" :items-per-page="pagination.size" :page="pagination.page"
        @update:items-per-page="e => pagination.size = e" @update:page="e => pagination.page = e" show-expand>
        <template v-slot:item.no="{ index }">{{ pageItemNo(pagination, index) }}</template>
        <template v-slot:item.job_type_name="{ item }">
          {{ job_type_objs[item.raw.job_type_id]?.job_type_name }}
        </template>
        <template v-slot:item.job_period_date="{ item }">
          {{ `${item.raw.job_date} - ${item.raw.job_due_date}` }}
        </template>
        <template v-slot:item.job_part="{ item }">
          <template v-for="(part_item, part_idx) in (item.raw.job_parts as JobPart[])">
            <v-chip class="mx-1">{{ part_item.job_part_name }}</v-chip>
          </template>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-label class="cursor-pointer" icon v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-label>
            </template>
            <v-list>
              <template v-if="permission_edit">
                <v-list-item class="cursor-pointer" density="compact"
                  :to="{ path: '/job-plan/update', query: { id: item.raw.job_id } }">
                  <v-list-item-title>
                    <v-icon> mdi-square-edit-outline</v-icon> แก้ไข
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-if="permission_delete">
                <v-list-item class="cursor-pointer" density="compact" @click="onDelete(item.raw.job_id)">
                  <v-list-item-title>
                    <v-icon> mdi-trash-can-outline</v-icon> ลบ
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:expanded-row="{ item, index }">
          <td :colspan="headers.length + 1">
            <div class="bg-warning overflow-auto pa-1">
              <table class="table table-bordered table-hover" aria-describedby="parts" style="min-width: 1080px;">
                <thead class="bg-secondary">
                  <tr>
                    <th style="width: 60px;">No.</th>
                    <th style="width: 400px;">ชื่องาน / Name</th>
                    <th style="width: 180px;">เวลาปฎิบัติงาน / Time</th>
                    <th>ส่วนประกอบย่อย / Sub Part</th>
                    <th style="width: 60px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(part_item, part_idx) in (item.raw.job_parts as JobPart[])">
                    <tr>
                      <td class="align-middle text-center">{{ part_idx + 1 }}</td>
                      <td class="align-middle">{{ part_item.job_part_name }}</td>
                      <td class="align-middle">
                        <div class="d-flex justify-center gap-1">
                          <span v-if="part_item.job_part_day">{{ part_item.job_part_day }} วัน</span>
                          <span v-if="part_item.job_part_hour">{{ part_item.job_part_hour }} ชม.</span>
                          <span v-if="part_item.job_part_minute">{{ part_item.job_part_minute }} น.</span>
                        </div>
                      </td>
                      <td>
                        <template v-for="(sub_item, sub_idx) in (part_item.job_subs as JobSub[])">
                          <v-chip class="mx-1">{{ sub_item.job_sub_name }}</v-chip>
                        </template>
                      </td>
                      <td class="align-middle text-center">
                        <template v-if="part_expands.includes(part_item.job_part_id)">
                          <v-btn size="30" icon="mdi-chevron-up"
                            @click="() => part_expands = part_expands.filter(val => val !== part_item.job_part_id)"></v-btn>
                        </template>
                        <template v-else>
                          <v-btn size="30" icon="mdi-chevron-down"
                            @click="() => part_expands.push(part_item.job_part_id)"></v-btn>
                        </template>
                      </td>
                    </tr>
                    <template v-if="part_expands.includes(part_item.job_part_id)">
                      <tr>
                        <td class="bg-lightprimary pa-1" colspan="5">
                          <table class="table table-bordered table-hover" aria-describedby="sub-parts">
                            <thead>
                              <tr>
                                <th style="width: 60px;">No.</th>
                                <th>ชื่องาน / Name</th>
                                <th style="width: 180px;">เวลาปฎิบัติงาน / Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              <template v-for="(sub_item, sub_idx) in (part_item.job_subs as JobSub[])">
                                <tr>
                                  <td class="align-middle text-center">{{ sub_idx + 1 }}</td>
                                  <td class="align-middle">{{ sub_item.job_sub_name }}</td>
                                  <td class="align-middle">
                                    <div class="d-flex justify-center gap-1">
                                      <span v-if="part_item.job_part_day">{{ part_item.job_part_day }} วัน</span>
                                      <span v-if="part_item.job_part_hour">{{ part_item.job_part_hour }} ชม.</span>
                                      <span v-if="part_item.job_part_minute">{{ part_item.job_part_minute }} น.</span>
                                    </div>
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
          </td>
        </template>
      </v-data-table-server>
    </v-card-item>
  </v-card>
</template>