
<script lang="ts" setup>
import Swal from "sweetalert2"
import { Process, ProcessList, ProcessTitle } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { generateProcessID, insertProcess, } = useProcess();
const { getProcessTitleBy, } = useProcessTitle();
const router = useRouter();

const submitting = ref(false)
const process = ref<Process>({
  process_id: '',
  process_name: '',
});
const process_lists = ref<ProcessList[]>([]);
const process_titles = ref<ProcessTitle[]>([]);
const title_options = ref<any[]>([{
  value: '',
  title: `- คุณสมบัติ -`,
}])

onMounted(async () => {
  try {
    process.value.process_id = await generateProcessID()
    process_titles.value = await getProcessTitleBy().then(res => res.docs)
    title_options.value = [
      ...process_titles.value.map(item => ({
        value: item.process_title_id,
        title: `${item.process_title_name}`,
      })),
    ]
  } catch (e) {
    console.log(e)
  }
})

async function onSubmit() {
  if (submitting.value || !validateForm()) return

  try {
    submitting.value = true
    
    await insertProcess({
      process: process.value,
      process_lists: process_lists.value,
    });
    void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })
    await router.push({ path: '/process' });
  } catch (e) {
    console.log(e)
    submitting.value = false
  }
}

function validateForm(): boolean {
  const {
    process_id,
    process_name,
  } = process.value

  if (!(process_id && process_name)) {
    void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
    return false
  }
  return true
}

function deleteRow(idx: number) {
  process_lists.value.splice(idx, 1);
}

function addRow() {
  process_lists.value.push({
    process_list_id: '',
    process_id: process.value.process_id,
    process_title_id: '',
    process_list_name: '',
  });
}

function handleRowChange(process_title_id: string, idx: number) {
  const title = process_titles.value.find(val => val.process_title_id === process_title_id)
  process_lists.value[idx].process_list_name = title ? title.process_title_name : ''
}
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'โปรเซทงาน', to: '/process', },
    { title: 'เพิ่มรายการใหม่', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>เพิ่มรายการใหม่</v-card-title>
    <v-card-text class="py-4">
      <v-row>
        <v-col cols="12" md="12">
          <v-row>
            <v-col cols="12" sm="6" lg="3">
              <v-label class="mb-2">รหัสโปรเซทงาน<span class="text-error ml-1">*</span></v-label>
              <v-text-field v-model="process.process_id" density="compact" :rules="[rules.required]"
                variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-label class="mb-2">ชื่อโปรเซทงาน<span class="text-error ml-1">*</span></v-label>
              <v-text-field v-model="process.process_name" :rules="[rules.required]" density="compact" variant="outlined"
                class="btn-small"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="mt-4 mb-4" style="overflow-x: auto">
        <table class="table table-bordered" style="min-width: 800px" aria-describedby="title">
          <thead>
            <tr>
              <th scope="Title">คุณสมบัติ</th>
              <th scope="#" style="width: 100px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(list, idx) in process_lists" :key="idx">
              <td class="align-middle text-center" align-self="center">
                <v-select v-model="list.process_title_id" :items="title_options" label="คุณสมบัติ" density="compact" variant="outlined" hide-details style="min-width: 350px;" :onselect="handleRowChange(list.process_title_id, idx)"></v-select>
              </td>
              <td class="align-middle text-center">
                <v-icon clickable @click="deleteRow(idx)" color="error">mdi mdi-close-thick</v-icon>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="align-middle text-center" :colspan="2">
                <v-btn color="success" @click="addRow">
                  <v-icon>mdi mdi-plus-thick</v-icon>เพิ่มคุณสมบัติ
                </v-btn>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn color="save" @click="onSubmit">
        <template v-if="submitting">
          <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
        </template> บันทึก
      </v-btn>
      <v-btn color="muted" :to="'/process'">ยกเลิก</v-btn>
    </v-card-text>
  </v-card>
</template>