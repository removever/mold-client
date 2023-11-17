
<script lang="ts" setup>
import { Process, ProcessList } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getProcessByID } = useProcess();
const { getProcessListBy, } = useProcessList();

const process = ref<Process>({
  process_id: '',
  process_name: '',
});
const process_lists = ref<ProcessList[]>([]);

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    process.value = await getProcessByID({ process_id: query.id })
    process_lists.value = await getProcessListBy({ process_id: query.id }).then(res => res.docs)
  } catch (e) {
    console.log(e)
  }
})
</script>
<template>
  <v-breadcrumbs :items="[
    { title: 'โปรเซทงาน', to: '/process', },
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
          <v-col cols="12" md="5">
            <v-row>
              <v-col cols="12" sm="6" lg="4">
                <v-label>รหัสโปรเซทงาน</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="8">
                <v-label>{{ process.process_id }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" lg="4">
                <v-label>ชื่อโปรเซทงาน</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="8">
                <v-label>{{ process.process_name }}</v-label>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="7">
            <div class="mt-4 mb-4" style="overflow-x: auto">
              <table class="table table-bordered" style="min-width: 500px" aria-describedby="title">
                <thead>
                  <tr>
                    <th scope="Title" style="width: 100px"></th>
                    <th scope="Title">คุณสมบัติ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(list, idx) in process_lists" :key="idx">
                    <td class="align-middle text-center" align-self="center">{{ idx+1 }}</td>
                    <td class="align-middle text-center" align-self="center">{{ list.process_list_name }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn type="submit" color="muted" :to="'/process'">กลับ</v-btn>
    </v-card-text>
  </v-card>
</template>