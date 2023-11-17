import { ProcessTitle } from "~~/misc/types"
const prefix = 'process-title'

const generateProcessTitleID = (): Promise<string> => secureFetch(`${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateProcessTitleID`, { method: "POST", })

const getProcessTitleBy = (data?: any): Promise<{ docs: ProcessTitle[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getProcessTitleBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getProcessTitleByID = (data: { process_title_id: string }): Promise<ProcessTitle> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getProcessTitleByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertProcessTitle = (data: any): Promise<ProcessTitle> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertProcessTitle`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateProcessTitleBy = (data: any): Promise<ProcessTitle> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateProcessTitleBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteProcessTitleBy = (data: any): Promise<ProcessTitle> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteProcessTitleBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useProcessTitle() {
  return {
    generateProcessTitleID,
    getProcessTitleBy,
    getProcessTitleByID,
    insertProcessTitle,
    updateProcessTitleBy,
    deleteProcessTitleBy
  };
}