import { JobPart, } from "~~/misc/types"

const prefix = 'job-part'

const getJobPartBy = (data: any = {}): Promise<{ docs: JobPart[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobPartBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getJobPartByID = (data: { job_part_id: string }): Promise<JobPart> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobPartByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertJobPart = (data: { job_part: JobPart }): Promise<JobPart> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertJobPart`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateJobPartBy = (data: { job_part: JobPart }): Promise<JobPart> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateJobPartBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteJobPartBy = (data: { job_part_id: string }): Promise<JobPart> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteJobPartBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useJobPart() {
  return {
    getJobPartBy,
    getJobPartByID,
    insertJobPart,
    updateJobPartBy,
    deleteJobPartBy
  };
}