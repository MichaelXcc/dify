'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import ModelSelector from './model-selector'
import DatasetSelector from './dataset-selector'
import TrainingParameters from './training-parameters'
import Tabs from './tabs'
import { ModelInfoPanel } from './model-info-panel'
import { TrainingLogs } from './training-logs'
import { RunningTasks } from './running-tasks'
import ConnectPanel from './connect-panel'

export default function Training() {
  const { t } = useTranslation()
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('train')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedDataset, setSelectedDataset] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [serverUrl, setServerUrl] = useState('http://localhost:7860')

  const handleConnect = (url: string) => {
    setServerUrl(url)
    setIsConnected(true)
  }

  const tabs = [
    { id: 'train', name: t('training.tabs.train'), icon: 'RiSettings4Line' },
    { id: 'factory', name: t('training.tabs.factory'), icon: 'RiDashboardLine' },
    { id: 'evaluate', name: t('training.tabs.evaluate'), icon: 'RiFileListLine' },
    { id: 'tasks', name: t('training.tabs.tasks'), icon: 'RiListCheck' },
    { id: 'logs', name: t('training.tabs.logs'), icon: 'RiTerminalLine' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="py-4 px-6 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">{t('training.title')}</h1>
        <p className="text-gray-500 mt-1">{t('training.description')}</p>
      </div>

      {!isConnected ? (
        <ConnectPanel onConnect={handleConnect} />
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'train' && (
              <div className="flex gap-6">
                <div className="w-2/3 space-y-6">
                  <div className="flex gap-4">
                    <ModelSelector 
                      selected={selectedModel} 
                      onChange={setSelectedModel} 
                    />
                    <DatasetSelector
                      selected={selectedDataset}
                      onChange={setSelectedDataset}
                    />
                  </div>
                  
                  <TrainingParameters 
                    modelType={selectedModel}
                  />
                  
                  <div className="flex justify-end mt-6">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {t('training.startTraining')}
                    </button>
                  </div>
                </div>
                
                <div className="w-1/3">
                  <ModelInfoPanel modelId={selectedModel} />
                </div>
              </div>
            )}

            {activeTab === 'factory' && (
              <div className="flex flex-col space-y-4 h-full">
                {/* <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">{t('training.factoryInterface')}</h2>
                  <button 
                    onClick={() => {
                      if (iframeRef.current) {
                        iframeRef.current.src = `${serverUrl}/?__theme=light`
                      }
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                  >
                    {t('training.refreshInterface')}
                  </button>
                </div> */}
                <div className="flex-1 rounded-lg overflow-hidden border border-gray-200 bg-white min-h-[700px]">
                  <iframe 
                    ref={iframeRef}
                    src={`${serverUrl}/?__theme=light`} 
                    className="w-full h-full border-none"
                    title="LLaMA Factory"
                    sandbox="allow-same-origin allow-scripts allow-forms"
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'evaluate' && (
              <div className="flex flex-col space-y-6">
                <h2 className="text-xl font-medium">{t('training.evaluateModel')}</h2>
                <div className="border rounded-lg p-6 bg-white">
                  <iframe 
                    src={`${serverUrl}/evaluate`} 
                    className="w-full h-[800px] border-none"
                    title="LLaMA Factory Evaluation"
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'tasks' && (
              <RunningTasks />
            )}
            
            {activeTab === 'logs' && (
              <TrainingLogs />
            )}
          </div>
        </div>
      )}
    </div>
  )
} 