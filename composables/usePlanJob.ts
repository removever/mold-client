import { Job, JobPart, JobPosition, JobProcess, } from "~~/misc/types"

const prefix = 'plan/job'

const getPlanJobBy = (data: any = {}): Promise<{ docs: Job[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getPlanJobBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getPlanJobByID = (data: { job_id: string }): Promise<Job> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getPlanJobByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertPlanJob = (data: {
  job: Job,
  job_parts: JobPart[],
  job_positions: JobPosition[],
}): Promise<Job> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertPlanJob`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updatePlanJobBy = (data: {
  job: Job,
  job_parts: JobPart[],
  job_process: JobProcess[],
  job_positions: JobPosition[],
}): Promise<Job> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updatePlanJobBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deletePlanJobBy = (data: { job_id: string }): Promise<Job> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deletePlanJobBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function usePlanJob() {
  return {
    getPlanJobBy,
    getPlanJobByID,
    insertPlanJob,
    updatePlanJobBy,
    deletePlanJobBy,
  };
}