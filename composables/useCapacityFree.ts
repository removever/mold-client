import { CapacityFree } from "~~/misc/types"

const prefix = 'capacity-free'

const generateCapacityFree = (data?: any): Promise<{ docs: CapacityFree[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateCapacityFree`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useCapacityFree() {
  return {
    generateCapacityFree,
  };
}