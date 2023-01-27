export interface ClickUpError {
  err: string;
}

export type ClickUpResponse<T> = T | ClickUpError;

export type AsyncClickUpResponse<T> = Promise<ClickUpResponse<T>>;

export interface User {
  id: number;
  username: string;
  color: string;
  profilePicture: string;
}

export interface Member {
  user: User;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  avatar: string;
  members: Member[];
}

export interface Status {
  status: string;
  type: string;
  orderindex: number;
  color: string;
}

export interface DueDates {
  enabled: boolean;
  start_date: boolean;
  remap_due_dates: boolean;
  remap_closed_due_date: boolean;
}

export interface TimeTracking {
  enabled: boolean;
}

export interface Tags {
  enabled: boolean;
}

export interface TimeEstimates {
  enabled: boolean;
}

export interface Checklists {
  enabled: boolean;
}

export interface CustomFields {
  enabled: boolean;
}

export interface RemapDependencies {
  enabled: boolean;
}

export interface DependencyWarning {
  enabled: boolean;
}

export interface Portfolios {
  enabled: boolean;
}

export interface Features {
  due_dates: DueDates;
  time_tracking: TimeTracking;
  tags: Tags;
  time_estimates: TimeEstimates;
  checklists: Checklists;
  custom_fields: CustomFields;
  remap_dependencies: RemapDependencies;
  dependency_warning: DependencyWarning;
  portfolios: Portfolios;
}

export interface Space {
  id: string;
  name: string;
  private: boolean;
  statuses: Status[];
  multiple_assignees: boolean;
  features: Features;
}
