'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RiAddLine, RiFolder2Fill } from '@remixicon/react'

interface DatasetSelectorProps {
  selected: string
  onChange: (datasetId: string) => void
}

interface Dataset {
  id: string
  name: string
  type: string
  samples: number
  lastUpdated: string
}

export default function DatasetSelector({ selected, onChange }: DatasetSelectorProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [showUpload, setShowUpload] = useState(false)
  
  // 模拟获取数据集列表
  useEffect(() => {
    // 在实际应用中，可以从服务器获取数据集列表
    const sampleDatasets: Dataset[] = [
      { id: 'alpaca-en', name: 'Alpaca (English)', type: 'instruction', samples: 52000, lastUpdated: '2023-04-20' },
      { id: 'alpaca-zh', name: 'Alpaca (Chinese)', type: 'instruction', samples: 51000, lastUpdated: '2023-04-21' },
      { id: 'sharegpt', name: 'ShareGPT', type: 'conversation', samples: 90000, lastUpdated: '2023-06-15' },
      { id: 'hh-rlhf', name: 'HH-RLHF', type: 'preference', samples: 160000, lastUpdated: '2023-05-10' },
      { id: 'custom-data', name: '自定义数据集', type: 'custom', samples: 1200, lastUpdated: '2023-09-30' },
    ]
    
    setDatasets(sampleDatasets)
  }, [])
  
  // 过滤数据集
  const filteredDatasets = searchQuery 
    ? datasets.filter(dataset => 
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : datasets
  
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('training.datasetSelection.selectDataset')}
        </label>
        <button
          onClick={() => setShowUpload(prev => !prev)}
          className="flex items-center text-xs text-blue-600 hover:text-blue-700"
        >
          <RiAddLine className="mr-1 h-3 w-3" />
          {t('training.uploadDataset')}
        </button>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('training.searchDataset')}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        
        {showUpload && (
          <div className="border rounded p-4 mb-2 bg-blue-50">
            <h3 className="font-medium text-sm mb-2">{t('training.uploadNewDataset')}</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
              <RiFolder2Fill className="h-8 w-8 text-gray-400 mb-2" />
              <div className="text-sm text-gray-500">{t('training.dragDropFiles')}</div>
              <div className="mt-2">
                <button className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50">
                  {t('training.selectFiles')}
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="border rounded max-h-60 overflow-y-auto">
          {filteredDatasets.length > 0 ? (
            filteredDatasets.map((dataset) => (
              <div
                key={dataset.id}
                onClick={() => onChange(dataset.id)}
                className={`
                  p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0
                  ${selected === dataset.id ? 'bg-blue-50' : ''}
                `}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium">{dataset.name}</div>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <span className="mr-2">{t(`training.datasetType.${dataset.type}`)}</span>
                      <span className="mr-2">•</span>
                      <span>{t('training.samples', { count: dataset.samples })}</span>
                    </div>
                  </div>
                  {selected === dataset.id && (
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">{t('training.noDatasetsFound')}</div>
          )}
        </div>
      </div>
    </div>
  )
} 