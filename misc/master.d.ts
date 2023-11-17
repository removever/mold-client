export type Department = {
  department_id: string,
  department_name: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type JobType = {
  job_type_id: string,
  job_type_name: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type Process = {
  process_id: string,
  process_name: string,
  check?: boolean,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type ProcessTitle = {
  process_title_id: string,
  process_title_name: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type ProcessList = {
  process_list_id: string,
  process_id: string,
  process_title_id: string,
  process_list_name: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type Machine = {
  machine_id: string,
  machine_name: string,
  department_id: string,
  department_name?: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type MachineProcess = {
  machine_process_id: string,
  machine_id: string,
  process_id: string,
  process_name: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
  machine_process_lists?: MachineProcessList[],
};

export type MachineProcessList = {
  machine_process_list_id: string,
  machine_process_id: string,
  machine_id: string,
  process_id: string,
  process_list_id: string,
  machine_process_list_name: string,
  machine_process_list_value: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type MachineStop = {
  machine_stop_id: string,
  machine_id: string,
  machine_stop_start: DateTime | string,
  machine_stop_end: DateTime | string,
  machine_stop_remark: string,
  machine_stop_ot_status: boolean,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type Schedule = {
  schedule_id: string,
  schedule_start_date: Date | string,
  schedule_end_date: Date | string,
  schedule_remark: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type ScheduleHoliday = {
  schedule_holiday_id: string,
  schedule_id: string,
  schedule_holiday_name: string,
  schedule_holiday_type: number,
  schedule_holiday_date: Date | string,
  schedule_holiday_ot_status: number,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type ScheduleWork = {
  schedule_work_id: string,
  schedule_id: string,
  schedule_work_name: string,
  schedule_work_start_time: Time | string,
  schedule_work_end_time: Time | string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type OT = {
  ot_id: string,
  machine_id: string,
  machine_name?: string,
  ot_start: Datetime | string,
  ot_end: Datetime | string,
  ot_remark: string,
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};