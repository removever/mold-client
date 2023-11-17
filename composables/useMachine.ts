import { Machine, Permission } from "~~/misc/types"

const prefix = 'machine'

const generateMachineID = (): Promise<string> => secureFetch(`${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateMachineID`, { method: "POST", })

const getMachineBy = (data? : any): Promise<{ docs: Machine[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getMachineBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getMachineByID = (data: { machine_id: string }): Promise<Machine> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getMachineByID`, {
  method: "POST",
  body: JSON.stringify(data),
})
const insertMachine = (data: any): Promise<Machine> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertMachine`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateMachineBy = (data: any): Promise<Machine> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateMachineBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteMachineBy = (data: any): Promise<Machine> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteMachineBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useMachine() {
  return {
    generateMachineID,
    getMachineBy,
    getMachineByID,
    insertMachine,
    updateMachineBy,
    deleteMachineBy
  };
}