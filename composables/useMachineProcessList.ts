import { MachineProcessList } from "~~/misc/types"
const prefix = 'machine-process-list'

const getMachineProcessListBy = (data?: any): Promise<{ docs: MachineProcessList[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getMachineProcessListBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteMachineProcessListBy = (data: any): Promise<MachineProcessList> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteMachineProcessListBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useMachineProcess() {
  return {
    getMachineProcessListBy,
    deleteMachineProcessListBy
  };
}