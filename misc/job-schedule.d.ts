export type DialogAction = 'add' | 'update' | 'duplicate'

export type JobPartDialog = {
  action: DialogAction,
  show: boolean,
  job_part_id: string,
  job_id: string,
  job_pre_part_ids: string[],
  job_part_name: string,
  job_part_day: number,
  job_part_hour: number,
  job_part_minute: number,
  job_part_remark: string,
  duplicate_id: string,
}

export type JobProcessDialog = {
  action: DialogAction,
  show: boolean,
  job_process_id: string,
  job_sub_id: string,
  job_id: string,
  job_part_id: string,
  job_pre_process_ids: string[],
  process_id: string,
  job_process_name: string,
  job_process_day: number,
  job_process_hour: number,
  job_process_minute: number,
  job_process_setup_time: number,
  job_process_setup_finish_time: number,
  job_process_x: number,
  job_process_y: number,
  job_process_z: number,
  job_process_remark: string,
  duplicate_id: string,
}

export type JobSubDialog = {
  action: DialogAction,
  show: boolean,
  job_sub_id: string,
  job_id: string,
  job_part_id: string,
  job_pre_sub_ids: string[],
  job_sub_name: string,
  job_sub_day: number,
  job_sub_hour: number,
  job_sub_minute: number,
  job_sub_remark: string,
  duplicate_id: string,
}

export type NewJobPart = {
  job_part_id: string,
  job_id: string,
  job_pre_part_ids: string[],
  job_part_name: string,
  job_part_day: number,
  job_part_hour: number,
  job_part_minute: number,
  job_part_remark: string,
  duplicate_id: string,
}

export type NewJobProcess = {
  job_process_id: string,
  job_sub_id: string,
  job_id: string,
  job_part_id: string,
  job_pre_process_ids: string[],
  process_id: string,
  job_process_name: string,
  job_process_day: number,
  job_process_hour: number,
  job_process_minute: number,
  job_process_setup_time: number,
  job_process_setup_finish_time: number,
  job_process_x: number,
  job_process_y: number,
  job_process_z: number,
  job_process_remark: string,
  duplicate_id: string,
}

export type NewJobSub = {
  job_sub_id: string,
  job_id: string,
  job_part_id: string,
  job_pre_sub_ids: string[],
  job_sub_name: string,
  job_sub_day: number,
  job_sub_hour: number,
  job_sub_minute: number,
  job_sub_remark: string,
  duplicate_id: string,
}