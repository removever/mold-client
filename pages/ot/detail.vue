
<script lang="ts" setup>
import { OT } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getOTByID } = useOT();

const ot = ref<OT>({
  ot_id: '',
  machine_id: '',
  machine_name: '',
  ot_start: '',
  ot_end: '',
  ot_remark: '',
});

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    ot.value = await getOTByID({ ot_id: query.id })
  } catch (e) {
    console.log(e)
  }
})
</script>
<template>
  <v-breadcrumbs :items="[
    { title: 'เเผนก', to: '/ot', },
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
                <v-label>เครื่องจักร</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ ot.machine_name }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" lg="2">
                <v-label>เริ่ม</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ formatDate(ot.ot_start,'dd/MM/yyyy HH:mm') }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" lg="2">
                <v-label>สิ้นสุด</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ formatDate(ot.ot_end,'dd/MM/yyyy HH:mm') }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" lg="2">
                <v-label>หมายเหตุ</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ ot.ot_remark }}</v-label>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn type="submit" color="muted" :to="'/ot'">กลับ</v-btn>
    </v-card-text>
  </v-card>
</template>