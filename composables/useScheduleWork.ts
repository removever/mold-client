import { ScheduleWork } from "~~/misc/types"

const prefix = 'schedule-work'

const getScheduleWorkBy = (data?: any): Promise<{ docs: ScheduleWork[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getScheduleWorkBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useSchedule() {
  return {
    getScheduleWorkBy,
  };
}