import { MachineStop } from "~~/misc/types"

const prefix = 'machine-stop'

const getMachineStopBy = (data?: any): Promise<{ docs: MachineStop[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getMachineStopBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useSchedule() {
  return {
    getMachineStopBy,
  };
}