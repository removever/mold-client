import { Process } from "~~/misc/types"
const prefix = 'process'

const generateProcessID = (): Promise<string> => secureFetch(`${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateProcessID`, { method: "POST", })

const getProcessBy = (data?: any): Promise<{ docs: Process[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getProcessBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getProcessByID = (data: { process_id: string }): Promise<Process> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getProcessByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertProcess = (data: any): Promise<Process> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertProcess`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateProcessBy = (data: any): Promise<Process> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateProcessBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteProcessBy = (data: any): Promise<Process> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteProcessBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useProcess() {
  return {
    generateProcessID,
    getProcessBy,
    getProcessByID,
    insertProcess,
    updateProcessBy,
    deleteProcessBy
  };
}