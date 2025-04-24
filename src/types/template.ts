export interface Template {
  _id?: string;
  name: string;
  type: string;
  code: string;
  isDefault: boolean;
  isExperimental?: boolean;
} 