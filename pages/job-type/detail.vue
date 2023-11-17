
<script lang="ts" setup>
import { JobType } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getJobTypeByID } = useJobType();

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
</script>
<template>
  <v-breadcrumbs :items="[
    { title: 'ประเภทงาน', to: '/job-type', },
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
                <v-label>รหัสประเภทงาน</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ job_type.job_type_id }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" lg="2">
                <v-label>ชื่อประเภทงาน</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ job_type.job_type_name }}</v-label>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn type="submit" color="muted" :to="'/job-type'">กลับ</v-btn>
    </v-card-text>
  </v-card>
</template>