import { ScheduleHoliday } from "~~/misc/types"

const prefix = 'schedule-holiday'

const getScheduleHolidayBy = (data?: any): Promise<{ docs: ScheduleHoliday[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getScheduleHolidayBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useSchedule() {
  return {
    getScheduleHolidayBy,
  };
}