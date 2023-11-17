
<script lang="ts" setup>
import Swal from "sweetalert2"
import { JobType } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getJobTypeByID, updateJobTypeBy } = useJobType();
const router = useRouter();
const submitting = ref(false)
const job_type = ref<JobType>({
  job_type_id: '',
  job_type_name: '',
});

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    job_type.value = await getJobTypeByID({ job_type_id: query.id })
  } catch (e) {
    console.log(e)
  }
})

async function onSubmit() {
  if (submitting.value || !validateForm()) return

  try {
    submitting.value = true
    await updateJobTypeBy(job_type.value);
    void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })
    await router.push({ path: '/job-type' });
  } catch (e) {
    console.log(e)
    submitting.value = false
  }
}

function validateForm(): boolean {
  if (!(job_type.value.job_type_id && job_type.value.job_type_name)) {
    void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
    return false
  }

  return true
}
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'ประเภทงาน', to: '/job-type', },
    { title: 'แก้ไขรายการ', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>แก้ไขรายการ</v-card-title>
    <v-card-text class="py-4">
      <v-row>
        <v-col cols="12" sm="6" lg="4">
          <v-label class="mb-2">ชื่อประเภทงาน<span class="text-error ml-1">*</span></v-label>
          <v-text-field v-model="job_type.job_type_name" :rules="[rules.required]" density="compact" variant="outlined"
            class="btn-small"></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn color="save" @click="onSubmit">
        <template v-if="submitting">
          <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
        </template> บันทึก
      </v-btn>
      <v-btn color="muted" :to="'/job-type'">ยกเลิก</v-btn>
    </v-card-text>
  </v-card>
</template>