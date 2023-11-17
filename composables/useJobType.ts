import { JobType, } from "~~/misc/types"

const prefix = 'job-type'

const generateJobTypeID = (): Promise<string> => secureFetch(`${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateJobTypeID`, { method: "POST", })

const getJobTypeBy = (data?: any): Promise<{ docs: JobType[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobTypeBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getJobTypeByID = (data: { job_type_id: string }): Promise<JobType> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getJobTypeByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertJobType = (data: JobType): Promise<JobType> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertJobType`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateJobTypeBy = (data:JobType): Promise<JobType> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateJobTypeBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteJobTypeBy = (data: { job_type_id: string }): Promise<JobType> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteJobTypeBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useJobType() {
  return {
    generateJobTypeID,
    getJobTypeBy,
    getJobTypeByID,
    insertJobType,
    updateJobTypeBy,
    deleteJobTypeBy
  };
}