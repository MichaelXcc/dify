'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as React from 'react'
import { 
  RiSettings4Line, RiSettings4Fill,
  RiFileListLine, RiFileListFill,
  RiListCheck, RiListCheck2,
  RiTerminalLine, RiTerminalBoxFill
} from '@remixicon/react'

interface Tab {
  id: string
  name: string
  icon: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  const { t } = useTranslation()
  
  const getIcon = (iconName: string, isActive: boolean) => {
    const iconProps = { className: 'h-5 w-5' }
    
    switch (iconName) {
      case 'RiSettings4Line':
        return isActive ? <RiSettings4Fill {...iconProps} /> : <RiSettings4Line {...iconProps} />
      case 'RiFileListLine':
        return isActive ? <RiFileListFill {...iconProps} /> : <RiFileListLine {...iconProps} />
      case 'RiListCheck':
        return isActive ? <RiListCheck2 {...iconProps} /> : <RiListCheck {...iconProps} />
      case 'RiTerminalLine':
        return isActive ? <RiTerminalBoxFill {...iconProps} /> : <RiTerminalLine {...iconProps} />
      default:
        return null
    }
  }

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex px-6 space-x-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${isActive 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {getIcon(tab.icon, isActive)}
              <span className="ml-2">{tab.name}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
} 