import { OT } from "~~/misc/types"

const prefix = 'ot'

const getOTBy = (data?: any): Promise<{ docs: OT[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getOTBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getOTByID = (data: { ot_id: string }): Promise<OT> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getOTByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertOT = (data: any): Promise<OT> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertOT`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateOTBy = (data: any): Promise<OT> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateOTBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteOTBy = (data: { ot_id: string }): Promise<OT> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteOTBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useOT() {
  return {
    getOTBy,
    getOTByID,
    insertOT,
    updateOTBy,
    deleteOTBy
  };
}