
<script lang="ts" setup>
import Swal from "sweetalert2"
import { OT } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getOTByID, updateOTBy } = useOT();
const { getMachineBy, } = useMachine();
const router = useRouter();
const submitting = ref(false)
const ot = ref<OT>({
  ot_id: '',
  machine_id: '',
  ot_start: '',
  ot_end: '',
  ot_remark: '',
});

const { data: machines } = await useAsyncData('machines', () => getMachineBy());
const machine_options = machines.value?.docs.map(item => ({
  value: item.machine_id,
  title: item.machine_name,
}));

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    ot.value = await getOTByID({ ot_id: query.id })

    ot.value.ot_start = formatDate(ot.value.ot_start,'yyyy-MM-ddTHH:mm')
    ot.value.ot_end = formatDate(ot.value.ot_end,'yyyy-MM-ddTHH:mm')
  } catch (e) {
    console.log(e)
  }
})

async function onSubmit() {
  if (submitting.value || !validateForm()) return

  try {
    submitting.value = true
    await updateOTBy(ot.value);
    void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })
    await router.push({ path: '/ot' });
  } catch (e) {
    console.log(e)
    submitting.value = false
  }
}

function validateForm(): boolean {
  if (!(ot.value.ot_id && ot.value.machine_id && ot.value.ot_start && ot.value.ot_end)) {
    void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
    return false
  }
  return true
}
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'เวลาทำงานล่วงเวลา', to: '/ot', },
    { title: 'แก้ไขรายการ', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>แก้ไขรายการ</v-card-title>
    <v-card-text class="py-4">
      <v-row>
        <v-col cols="12" sm="6" lg="3">
          <v-label class="mb-2">เครื่องจักร<span class="text-error ml-1">*</span></v-label>
          <v-select class="ml-2" v-model="ot.machine_id" :items="machine_options" density="compact" variant="outlined" hide-details></v-select>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-label class="mb-2">เริ่ม<span class="text-error ml-1">*</span></v-label>
          <v-text-field class="ml-2" type="datetime-local" v-model="ot.ot_start" density="compact" variant="outlined" :rules="[rules.required]" hide-details></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-label class="mb-2">สิ้นสุด<span class="text-error ml-1">*</span></v-label>
          <v-text-field class="ml-2" type="datetime-local" v-model="ot.ot_end" density="compact" variant="outlined" :rules="[rules.required]" hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" lg="9">
          <v-label class="mb-2">หมายเหตุ<span class="text-error ml-1">*</span></v-label>
          <v-text-field class="ml-2" type="text" v-model="ot.ot_remark" density="compact" variant="outlined" hide-details></v-text-field>
        </v-col>
      </v-row>
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