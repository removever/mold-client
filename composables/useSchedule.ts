import { Schedule } from "~~/misc/types"

const prefix = 'schedule'

const generateScheduleID = (): Promise<string> => secureFetch(`${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateScheduleID`, { method: "POST", })

const getScheduleBy = (data?: any): Promise<{ docs: Schedule[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getScheduleBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getScheduleByID = (data: { schedule_id: string }): Promise<Schedule> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getScheduleByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertSchedule = (data: any): Promise<Schedule> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertSchedule`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateScheduleBy = (data: any): Promise<Schedule> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateScheduleBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteScheduleBy = (data: { schedule_id: string }): Promise<Schedule> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteScheduleBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useSchedule() {
  return {
    generateScheduleID,
    getScheduleBy,
    getScheduleByID,
    insertSchedule,
    updateScheduleBy,
    deleteScheduleBy
  };
}