import { UserPosition } from "~~/misc/types"
const prefix = 'user-position'

const generateUserPositionID = (): Promise<string> => secureFetch(`${useRuntimeConfig().public.apiBaseUrl}/${prefix}/generateUserPositionID`, { method: "POST", })

const getUserPositionBy = (data?: any): Promise<{ docs: UserPosition[], totalDocs: number, }> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getUserPositionBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const getUserPositionByID = (data: { user_position_id: string }): Promise<UserPosition> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getUserPositionByID`, {
  method: "POST",
  body: JSON.stringify(data),
})

const insertUserPosition = (data: any): Promise<UserPosition> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertUserPosition`, {
  method: "POST",
  body: JSON.stringify(data),
})

const updateUserPositionBy = (data: any): Promise<UserPosition> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateUserPositionBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

const deleteUserPositionBy = (data: any): Promise<UserPosition> => secureFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteUserPositionBy`, {
  method: "POST",
  body: JSON.stringify(data),
})

export default function useUserPosition() {
  return {
    generateUserPositionID,
    getUserPositionBy,
    getUserPositionByID,
    insertUserPosition,
    updateUserPositionBy,
    deleteUserPositionBy
  };
}