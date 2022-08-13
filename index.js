import express from "express"
import { Client } from "@notionhq/client"
import { shiftPhase } from "./shiftPhase.js"

import dotenv from "dotenv"
dotenv.config()

export const notion = new Client({ auth: process.env.NOTION_KEY })

const startServer = async () => {
  const app = express()

  app.get('/:id', async (req, res) => {
    const taskId = req.params.id
    const updatedObject = await shiftPhase(taskId)
    console.log(updatedObject)
    res.send(updatedObject)
  })

  app.listen(3000, () => {
    console.log(`Endpoint live at http://localhost:3000`)  
  })
}

startServer()

