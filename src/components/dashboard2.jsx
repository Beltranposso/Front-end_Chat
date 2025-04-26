"use client"

import { useState } from "react"


import StatsPanel from "./stats-panel"

import { useMediaQuery } from "../hooks"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)
  const isMobile = useMediaQuery("(max-width: 768px)")



  return (



        <div className="p-4 h-full w-full">
          { (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
              <StatsPanel title="Visitantes" count={0} percentage="0.0%" lastDays={7} />
              <StatsPanel title="Chats" count={0} percentage="0.0%" lastDays={7} responded={0} missed={0} />
              <StatsPanel title="Páginas Vistas" count={0} percentage="0.0%" lastDays={7} />
              <StatsPanel title="Informes" sentiment="0%" commitment="0%" availability="0.0%" />
            </div>
          )}

        
        </div>
   
  
  )
}

