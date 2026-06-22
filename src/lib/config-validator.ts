import { AppConfig, ValidatedConfig, FieldType, EntityConfig, PageConfig } from '@/types/config'
import { nanoid } from 'nanoid'

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function validateConfig(raw: unknown): ValidatedConfig {
  // 1. Check if raw is valid object
  if (raw === null || raw === undefined || typeof raw !== 'object') {
    throw new Error("Invalid config: must be a JSON object")
  }

  // 2. Cast to Record
  const config = raw as Record<string, unknown>

  // 3. Extract app name
  const app = typeof config.app === 'string' && config.app.trim() 
    ? config.app.trim() 
    : "Untitled App"

  // 4. Extract and validate entities
  const validatedEntities: EntityConfig[] = []
  const rawEntities = Array.isArray(config.entities) ? config.entities : []

  for (const entity of rawEntities) {
    if (typeof entity !== 'object' || entity === null) continue

    const entityObj = entity as Record<string, unknown>
    const entityName = typeof entityObj.name === 'string' ? entityObj.name : "Unknown Entity"
    
    const validatedFields = []
    const rawFields = Array.isArray(entityObj.fields) ? entityObj.fields : []

    for (const field of rawFields) {
      if (typeof field !== 'object' || field === null) continue

      const fieldObj = field as Record<string, unknown>
      
      // Skip if no valid name
      if (typeof fieldObj.name !== 'string') continue

      const fieldName = fieldObj.name
      const validFieldTypes: FieldType[] = ["string", "number", "boolean", "date", "enum", "text"]
      const fieldType: FieldType = validFieldTypes.includes(fieldObj.type as FieldType) 
        ? fieldObj.type as FieldType 
        : "string"

      const required = Boolean(fieldObj.required)
      
      let values: string[] | undefined
      if (fieldType === "enum") {
        if (Array.isArray(fieldObj.values) && fieldObj.values.every(v => typeof v === 'string')) {
          values = fieldObj.values as string[]
        } else {
          values = ["option1", "option2"]
        }
      }

      const label = typeof fieldObj.label === 'string' ? fieldObj.label : capitalize(fieldName)

      validatedFields.push({
        name: fieldName,
        type: fieldType,
        required,
        values,
        label,
        defaultValue: fieldObj.defaultValue
      })
    }

    validatedEntities.push({
      name: entityName,
      fields: validatedFields
    })
  }

  // 5. Extract and validate pages
  let validatedPages: PageConfig[] = []
  
  if (Array.isArray(config.pages)) {
    for (const page of config.pages) {
      if (typeof page !== 'object' || page === null) continue

      const pageObj = page as Record<string, unknown>
      const validPageTypes = ["list", "form", "dashboard"]
      const pageType = validPageTypes.includes(pageObj.type as string) 
        ? pageObj.type as "list" | "form" | "dashboard"
        : "list"

      if (typeof pageObj.entity !== 'string') continue

      const entityName = pageObj.entity
      
      // Check if entity exists in validated entities
      const entityExists = validatedEntities.some(e => e.name === entityName)
      if (!entityExists) continue

      const title = typeof pageObj.title === 'string' ? pageObj.title : undefined

      validatedPages.push({
        type: pageType,
        entity: entityName,
        title
      })
    }
  } else {
    // Generate default pages from entities
    for (const entity of validatedEntities) {
      validatedPages.push({
        type: "list",
        entity: entity.name,
        title: `${entity.name} List`
      })
    }
  }

  // 6. Generate appId
  const appId = nanoid(10)

  // 7. Return ValidatedConfig
  return {
    appId,
    app,
    entities: validatedEntities,
    pages: validatedPages
  }
}

export function safeValidateConfig(raw: unknown): { success: true, config: ValidatedConfig } | { success: false, error: string } {
  try {
    const config = validateConfig(raw)
    return { success: true, config }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error'
    return { success: false, error: errorMessage }
  }
}