import { notion } from "./index.js"

import dotenv from "dotenv"
dotenv.config()

const phasesDatabaseId = process.env.NOTION_PHASES_DATABASE_ID
const tasksDatabaseId = process.env.NOTION_TASKS_DATABASE_ID

export const shiftPhase = async (taskId) => {
  try {
    const phaseDatabase = await notion.databases.retrieve({ database_id: phasesDatabaseId })
    const taskDatabase = await notion.databases.retrieve({ database_id: tasksDatabaseId })

    const currentPhaseRelation = await notion.pages.properties.retrieve({
      page_id: taskId,
      property_id: taskDatabase.properties["Phase"].id
    })
    const currentPhase = await notion.pages.retrieve({ page_id: currentPhaseRelation.results[0].relation.id })

    const nextPhaseRelation = await notion.pages.properties.retrieve({
      page_id: currentPhase.id,
      property_id: phaseDatabase.properties["Next Phase"].id
    })
    const nextPhase = await notion.pages.retrieve({ page_id: nextPhaseRelation.results[0].relation.id })

    const response = await notion.pages.update({
      page_id: taskId,
      properties: {
        "Phase": {
          "relation": [
            {
              "id": nextPhase.id
            }
          ]
        },
        "Status": {
          "select": {
            "name": "Not started"
          }
        }
      }
    })
    return response
  } catch(error) {
    throw error
  }
}
