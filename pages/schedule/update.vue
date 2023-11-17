
<script lang="ts" setup>
import moment from "moment";
import Swal from "sweetalert2"
import { Schedule, ScheduleHoliday, ScheduleWork } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getScheduleByID, updateScheduleBy, } = useSchedule();
const { getScheduleWorkBy, } = useScheduleWork();
const { getScheduleHolidayBy, } = useScheduleHoliday();
const { generateCapacityFree, } = useCapacityFree();

const router = useRouter();
const showWork = ref<{
  show: boolean,
  status: string,
  idx: number,
  schedule_work: ScheduleWork,
}>({
  show: false,
  status: 'insert',
  idx: 0,
  schedule_work: {
    schedule_work_id: '',
    schedule_work_name: '',
    schedule_id: '',
    schedule_work_start_time: '',
    schedule_work_end_time: '',
  }
})
const showHoliday = ref<{
  show: boolean,
  status: string,
  idx: number,
  schedule_holiday: ScheduleHoliday,
}>({
  show: false,
  status: 'insert',
  idx: 0,
  schedule_holiday: {
    schedule_holiday_id: '',
    schedule_id: '',
    schedule_holiday_name: '',
    schedule_holiday_date: '',
    schedule_holiday_type: 0,
    schedule_holiday_ot_status: 0,
  }
})
const submitting = ref(false)
const schedule_holidays = ref<ScheduleHoliday[]>([])
const schedule_works = ref<ScheduleWork[]>([])
const schedule = ref<Schedule>({
  schedule_id: '',
  schedule_start_date: formatDate(new Date,'yyyy-MM-dd'),
  schedule_end_date: '',
  schedule_remark: '',
});
const holiday_options = [
  { title: "วันหยุดประจำสัปดาห์", value: 1 },
  { title: "วันหยุดพิเศษ", value: 0 },
]
const weekend = ref<{
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean,
}>({
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
})

onMounted(async () => {
  try {

    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    schedule.value = await getScheduleByID({ schedule_id: query.id })
    schedule_works.value = await getScheduleWorkBy({ schedule_id: query.id }).then(res => res.docs)
    schedule_holidays.value = await getScheduleHolidayBy({ schedule_id: query.id }).then(res => res.docs)
    schedule.value.schedule_start_date = formatDate(schedule.value.schedule_start_date,'yyyy-MM-dd')
    schedule.value.schedule_end_date = formatDate(schedule.value.schedule_end_date,'yyyy-MM-dd')
  } catch (e) {
    console.log(e)
  }
})

async function onSubmit() {
  if (submitting.value || !validateForm()) return

  try {
    submitting.value = true
    await updateScheduleBy({
      schedule: schedule.value,
      schedule_works: schedule_works.value,
      schedule_holidays: schedule_holidays.value,
    });

    await generateCapacityFree({ schedule_id: schedule.value.schedule_id })
    void Swal.fire({ title: 'สำเร็จ', text: 'บันทึกข้อมูลแล้ว', icon: "success" })
    await router.push({ path: '/schedule' });
  } catch (e) {
    console.log(e)
    submitting.value = false
  }
}

function validateForm(): boolean {
  const {
    schedule_start_date,
    schedule_end_date,
  } = schedule.value

  if (!(schedule_start_date && schedule_end_date)) {
    void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
    return false
  }
  return true
}

function showWorkDialog(status: string, idx: number) {
  showWork.value.show = true
  showWork.value.status = status
  showWork.value.idx = idx

  if(status === 'update'){
    showWork.value.schedule_work = schedule_works.value[idx]
  }else{
    showWork.value.schedule_work = {
      schedule_work_id: '',
      schedule_work_name: '',
      schedule_id: '',
      schedule_work_start_time: '',
      schedule_work_end_time: '',
    }
  }
}

function validateWork(): boolean {
  const {
    schedule_work_name,
    schedule_work_start_time,
    schedule_work_end_time
  } = showWork.value.schedule_work

  if (!(schedule_work_name && schedule_work_start_time && schedule_work_end_time)) {
    void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
    return false
  }

  return true
}

function addWorkTime() {
  if (!validateWork()) return

  if(showWork.value.status === 'update'){
    schedule_works.value[showWork.value.idx] = showWork.value.schedule_work
  }else{
    schedule_works.value.push(showWork.value.schedule_work)
  } 
  showWork.value.show = false
}

function deleteWork(idx: number) {
  schedule_works.value.splice(idx, 1);
}

function showHolidayDialog(status: string, idx: number) {
  showHoliday.value.show = true
  showHoliday.value.status = status
  showHoliday.value.idx = idx

  if(status === 'update'){
    showHoliday.value.schedule_holiday = schedule_holidays.value[idx]
  }else{
    showHoliday.value.schedule_holiday = {
      schedule_holiday_id: '',
      schedule_id: '',
      schedule_holiday_name: '',
      schedule_holiday_date: '',
      schedule_holiday_type: 0,
      schedule_holiday_ot_status: 0,
    }
  }
}

function validateHoliday(): boolean {
  const {
    schedule_holiday_name,
    schedule_holiday_date,
    schedule_holiday_type
  } = showHoliday.value.schedule_holiday
  const date = schedule_holiday_date

  if(!schedule_holiday_type){
    if (!(schedule_holiday_name && schedule_holiday_date)) {
      void Swal.fire({ text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: "warning" })
      return false
    }else if(date <= schedule.value.schedule_start_date || date >= schedule.value.schedule_end_date){
      void Swal.fire({ text: 'กรุณากรอกวันที่ให้อยู่ภายในวันที่ '+ schedule.value.schedule_start_date +' - '+schedule.value.schedule_end_date, icon: "warning" })
      return false
    }
  }
  return true
}

function addHoliday() {
  if (!validateHoliday()) return

  if(!showHoliday.value.schedule_holiday.schedule_holiday_type){ 
    if(showHoliday.value.status === 'update'){
      schedule_holidays.value[showHoliday.value.idx] = showHoliday.value.schedule_holiday
    }else{
      schedule_holidays.value.push(showHoliday.value.schedule_holiday)
    } 
  }else{
    let num_of_day = Math.round(diffDate(schedule.value.schedule_start_date, schedule.value.schedule_end_date))

    for (let i = 0; i <= num_of_day; i++) {
      const date = moment(schedule.value.schedule_start_date, "YYYY-MM-DD").add(i, 'days')
      schedule_holidays.value = schedule_holidays.value.filter(val => formatDate(val.schedule_holiday_date) !== formatDate(date.toDate()))

      if(
        (weekend.value.monday && date.day() === 1) || 
        (weekend.value.tuesday && date.day() === 2) || 
        (weekend.value.wednesday && date.day() === 3) || 
        (weekend.value.thursday && date.day() === 4) || 
        (weekend.value.friday && date.day() === 5) || 
        (weekend.value.saturday && date.day() === 6) || 
        (weekend.value.sunday && date.day() === 0)
      ){
        schedule_holidays.value.push({
          schedule_holiday_id: '',
          schedule_id: '',
          schedule_holiday_name: 'วันหยุดประจำสัปดาห์',
          schedule_holiday_date: date.toDate(),
          schedule_holiday_type: showHoliday.value.schedule_holiday.schedule_holiday_type,
          schedule_holiday_ot_status: showHoliday.value.schedule_holiday.schedule_holiday_ot_status,
        })
      }
    }
  }
  showHoliday.value.show = false
}

function deleteHoliday(idx: number) {
  schedule_holidays.value.splice(idx, 1);
}
</script>

<template>
  <v-breadcrumbs :items="[
    { title: 'เวลาทำงาน', to: '/schedule', },
    { title: 'เพิ่มรายการใหม่', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-title>เเก้ไขรายการใหม่</v-card-title>
    <v-card-text class="py-4">
      <v-row>
        <v-col cols="12" md="12">
          <v-row>
            <v-col cols="12" sm="6" lg="4">
              <v-label class="mb-2">วันเริ่ม<span class="text-error ml-1">*</span></v-label>
              <v-text-field type="date" v-model="schedule.schedule_start_date" density="compact" variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-label class="mb-2">วันสิ้นสุด<span class="text-error ml-1">*</span></v-label>
              <v-text-field type="date" v-model="schedule.schedule_end_date" density="compact" variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <h3 class="mt-5">เวลาทำงาน</h3>
      <table class="table table-bordered mt-2" style="min-width: 400px" aria-describedby="title">
        <thead>
          <tr>
            <th scope="#" style="width: 120px"></th>
            <th scope="Title">กละ</th>
            <th scope="#" style="width: 350px">เวลาทำงาน</th>
            <th scope="#" style="width: 120px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="schedule_works.length" 
            v-for="(list, idx) in schedule_works" :key="idx">
            <td class="align-middle text-center" align-self="center">{{ idx+1 }}</td>
            <td class="align-middle text-center" align-self="center">{{ list.schedule_work_name }}</td>
            <td class="align-middle text-center" align-self="center">{{ `${list.schedule_work_start_time} - ${list.schedule_work_end_time}` }}</td>
            <td class="align-middle text-center" align-self="center">
              <v-icon size="20" color="warning" @click="showWorkDialog('update', idx)">mdi-square-edit-outline</v-icon>
              <v-icon size="20" color="error" @click="deleteWork(idx)">mdi-close-thick</v-icon>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="align-middle text-center" colspan="4">
              <v-btn color="success" @click="showWorkDialog('insert', 0)">
                <v-icon size="20">mdi-plus</v-icon> เพิ่มเวลาการทำงาน
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </table>

      <h3 class="mt-10">วันหยุด</h3>
      <table class="table table-bordered mt-2" style="min-width: 400px" aria-describedby="title">
        <thead>
          <tr>
            <th scope="#" style="width: 120px"></th>
            <th scope="Title">วันหยุด</th>
            <th scope="#" style="width: 350px">วันที่หยุด</th>
            <th scope="#" style="width: 120px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="schedule_holidays.length" 
            v-for="(list, idx) in schedule_holidays" :key="idx">
            <td class="align-middle text-center" align-self="center">{{ idx + 1 }}</td>
            <td class="align-middle text-center" align-self="center">{{ list.schedule_holiday_name }}</td>
            <td class="align-middle text-center" align-self="center">{{ `${formatDate(list.schedule_holiday_date)}` }}</td>
            <td class="align-middle text-center" align-self="center">
              <v-icon v-if="!list.schedule_holiday_type" size="20" color="warning" @click="showHolidayDialog('update', idx)">mdi-square-edit-outline</v-icon>
              <v-icon size="20" color="error" @click="deleteHoliday(idx)">mdi-close-thick</v-icon>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="align-middle text-center" colspan="4">
              <v-btn color="success" @click="showHolidayDialog('insert', 0)">
                <v-icon size="20">mdi-plus</v-icon> เพิ่มวันหยุด
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </table>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn color="save" @click="onSubmit">
        <template v-if="submitting">
          <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
        </template> บันทึก
      </v-btn>
      <v-btn color="muted" :to="'/schedule'">ยกเลิก</v-btn>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showWork.show" max-width="1360">
    <v-card>
      <v-card-title class="text-h5">เวลาทำงาน </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" lg="4">
            <v-label class="mb-2">ชื่อกละ<span class="text-error ml-1">*</span></v-label>
            <v-text-field v-model="showWork.schedule_work.schedule_work_name" :rules="[rules.required]" density="compact" variant="outlined"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" lg="4">
            <v-label class="mb-2">เวลาเริ่ม<span class="text-error ml-1">*</span></v-label>
              <v-text-field type="time" v-model="showWork.schedule_work.schedule_work_start_time" density="compact" variant="outlined" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" lg="4">
            <v-label class="mb-2">เวลาสิ้นสุด<span class="text-error ml-1">*</span></v-label>
              <v-text-field type="time" v-model="showWork.schedule_work.schedule_work_end_time" density="compact" variant="outlined" :rules="[rules.required]"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="d-flex justify-center gap-2 mb-2">
        <v-btn color="save" @click="addWorkTime()">บันทึก</v-btn>
        <v-btn color="muted" @click="showWork.show = false">ปิด</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  
  <v-dialog v-model="showHoliday.show" max-width="1360">
    <v-card>
      <v-card-title class="text-h5">วันหยุด </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" lg="3">
            <v-label class="mb-2">ประเภท<span class="text-error ml-1">*</span></v-label>
            <v-select v-model="showHoliday.schedule_holiday.schedule_holiday_type" :items="holiday_options" density="compact" variant="outlined" hide-details style="min-width: 350px;" :disabled="showHoliday.status === 'update' ? true : false"></v-select>
          </v-col>
          <v-col cols="12" sm="6" lg="2">
            <v-switch class="mt-8 ml-15" v-model="showHoliday.schedule_holiday.schedule_holiday_ot_status" label="เปิด OT" color="primary" hide-details></v-switch>
          </v-col>
        </v-row>

        <v-row v-if="showHoliday.schedule_holiday.schedule_holiday_type === 1">
          <v-col cols="12">
            <v-label class="mb-2">การทำซ้ำ</v-label>
          </v-col>
          <v-col cols="12">
            <v-btn class="mr-2" :color="weekend.monday ? 'primary' : 'secondary'" @click="weekend.monday = !weekend.monday">Mon</v-btn>
            <v-btn class="mr-2" :color="weekend.tuesday ? 'primary' : 'secondary'" @click="weekend.tuesday = !weekend.tuesday">Tue</v-btn>
            <v-btn class="mr-2" :color="weekend.wednesday ? 'primary' : 'secondary'" @click="weekend.wednesday = !weekend.wednesday">Wed</v-btn>
            <v-btn class="mr-2" :color="weekend.thursday ? 'primary' : 'secondary'" @click="weekend.thursday = !weekend.thursday">Thu</v-btn>
            <v-btn class="mr-2" :color="weekend.friday ? 'primary' : 'secondary'" @click="weekend.friday = !weekend.friday">Fri</v-btn>
            <v-btn class="mr-2" :color="weekend.saturday ? 'primary' : 'secondary'" @click="weekend.saturday = !weekend.saturday">Sat</v-btn>
            <v-btn class="mr-2" :color="weekend.sunday ? 'primary' : 'secondary'" @click="weekend.sunday = !weekend.sunday">Sun</v-btn>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12" sm="6" lg="4">
            <v-label class="mb-2">ชื่อวันหยุด<span class="text-error ml-1">*</span></v-label>
            <v-text-field v-model="showHoliday.schedule_holiday.schedule_holiday_name" :rules="[rules.required]" density="compact" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" lg="4">
            <v-label class="mb-2">วันที่หยุด<span class="text-error ml-1">*</span></v-label>
            <v-text-field type="date" v-model="showHoliday.schedule_holiday.schedule_holiday_date" density="compact" variant="outlined" :rules="[rules.required]"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="d-flex justify-center gap-2 mb-2">
        <v-btn color="save" @click="addHoliday()">บันทึก</v-btn>
        <v-btn color="muted" @click="showHoliday.show = false">ปิด</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>