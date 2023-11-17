import { ProcessList } from "~~/misc/types"
const prefix = 'process-list'

const generateProcessListID = (): Promise<string> => secureFetch(`${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateProcessListID`, { method: "POST", })

const getProcessListBy = (data?: any): Promise<{ docs: ProcessList[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getProcessListBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertProcessList = (data: any): Promise<ProcessList> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertProcessList`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateProcessListBy = (data: any): Promise<ProcessList> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateProcessListBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteProcessListBy = (data: any): Promise<ProcessList> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteProcessListBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useProcessList() {
  return {
    generateProcessListID,
    getProcessListBy,
    insertProcessList,
    updateProcessListBy,
    deleteProcessListBy
  };
}