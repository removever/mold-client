import { Job, JobPart, JobPosition, JobProcess, } from "~~/misc/types"

const prefix = 'job'

const getJobBy = (data: any = {}): Promise<{ docs: Job[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getJobByID = (data: { job_id: string }): Promise<Job> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertJob = (data: {
  job: Job,
  job_parts: JobPart[],
  job_positions: JobPosition[],
}): Promise<Job> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertJob`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateJobBy = (data: {
  job: Job,
  job_parts: JobPart[],
  job_process: JobProcess[],
  job_positions: JobPosition[],
}): Promise<Job> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateJobBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteJobBy = (data: { job_id: string }): Promise<Job> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteJobBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useJob() {
  return {
    getJobBy,
    getJobByID,
    insertJob,
    updateJobBy,
    deleteJobBy
  };
}