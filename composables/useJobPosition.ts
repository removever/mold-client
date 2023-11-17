import { JobPosition, } from "~~/misc/types"

const prefix = 'job-position'

const getJobPositionBy = (data: any = {}): Promise<{ docs: JobPosition[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobPositionBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getJobPositionByID = (data: { job_position_id: string }): Promise<JobPosition> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobPositionByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertJobPosition = (data: { job_position: JobPosition }): Promise<JobPosition> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertJobPosition`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateJobPositionBy = (data: { job_position: JobPosition }): Promise<JobPosition> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateJobPositionBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteJobPositionBy = (data: { job_position_id: string }): Promise<JobPosition> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteJobPositionBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useJobPosition() {
  return {
    getJobPositionBy,
    getJobPositionByID,
    insertJobPosition,
    updateJobPositionBy,
    deleteJobPositionBy
  };
}