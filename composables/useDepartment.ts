import { Department } from "~~/misc/types"

const prefix = 'department'

const generateDepartmentID = (): Promise<string> => secureFetch(`${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateDepartmentID`, { method: "POST", })

const getDepartmentBy = (data?: any): Promise<{ docs: Department[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getDepartmentBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getDepartmentByID = (data: { department_id: string }): Promise<Department> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getDepartmentByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertDepartment = (data: Department): Promise<Department> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertDepartment`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateDepartmentBy = (data: Department): Promise<Department> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateDepartmentBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteDepartmentBy = (data: { department_id: string }): Promise<Department> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteDepartmentBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useDepartment() {
  return {
    generateDepartmentID,
    getDepartmentBy,
    getDepartmentByID,
    insertDepartment,
    updateDepartmentBy,
    deleteDepartmentBy
  };
}