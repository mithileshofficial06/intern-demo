export type FieldType = "string" | "number" | "boolean" | "date" | "enum" | "text"

export interface FieldConfig {
  name: string
  type: FieldType
  required?: boolean
  values?: string[] // for enum type
  label?: string
  defaultValue?: unknown
}

export interface EntityConfig {
  name: string
  fields: FieldConfig[]
}

export interface PageConfig {
  type: "list" | "form" | "dashboard"
  entity: string
  title?: string
}

export interface AppConfig {
  app: string
  entities: EntityConfig[]
  pages: PageConfig[]
}

export interface ValidatedConfig {
  appId: string
  app: string
  entities: EntityConfig[]
  pages: PageConfig[]
}