import { JobProcess, } from "~~/misc/types"

const prefix = 'job-process'

const getJobProcessBy = (data: any = {}): Promise<{ docs: JobProcess[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobProcessBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getJobProcessByID = (data: { job_process_id: string }): Promise<JobProcess> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobProcessByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertJobProcess = (data: { job_process: JobProcess }): Promise<JobProcess> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertJobProcess`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateJobProcessBy = (data: { job_process: JobProcess }): Promise<JobProcess> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateJobProcessBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteJobProcessBy = (data: { job_process_id: string }): Promise<JobProcess> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteJobProcessBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useJobProcess() {
  return {
    getJobProcessBy,
    getJobProcessByID,
    insertJobProcess,
    updateJobProcessBy,
    deleteJobProcessBy
  };
}