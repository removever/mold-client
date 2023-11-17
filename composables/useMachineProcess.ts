import { MachineProcess } from "~~/misc/types"
const prefix = 'machine-process'

const getMachineProcessBy = (data?: any): Promise<{ docs: MachineProcess[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getMachineProcessBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteMachineProcessBy = (data: any): Promise<MachineProcess> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteMachineProcessBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useMachineProcess() {
  return {
    getMachineProcessBy,
    deleteMachineProcessBy
  };
}