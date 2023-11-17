import { JobSub, } from "~~/misc/types"

const prefix = 'job-sub'

const getJobSubBy = (data: any = {}): Promise<{ docs: JobSub[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobSubBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getJobSubByID = (data: { job_sub_id: string }): Promise<JobSub> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobSubByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertJobSub = (data: { job_sub: JobSub }): Promise<JobSub> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertJobSub`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateJobSubBy = (data: { job_sub: JobSub }): Promise<JobSub> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateJobSubBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteJobSubBy = (data: { job_sub_id: string }): Promise<JobSub> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteJobSubBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useJobSub() {
  return {
    getJobSubBy,
    getJobSubByID,
    insertJobSub,
    updateJobSubBy,
    deleteJobSubBy
  };
}