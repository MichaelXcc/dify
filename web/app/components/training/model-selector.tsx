'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ModelSelectorProps {
  selected: string
  onChange: (modelId: string) => void
}

interface Model {
  id: string
  name: string
  category: string
  description?: string
}

export default function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [models, setModels] = useState<Model[]>([])
  
  // 模拟获取模型列表
  useEffect(() => {
    // 在实际应用中，可以从服务器获取模型列表
    const sampleModels: Model[] = [
      { id: 'llama2-7b', name: 'LLaMA-2 7B', category: 'base' },
      { id: 'llama2-13b', name: 'LLaMA-2 13B', category: 'base' },
      { id: 'llama3-8b', name: 'LLaMA-3 8B', category: 'base' },
      { id: 'mistral-7b', name: 'Mistral 7B', category: 'base' },
      { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', category: 'base' },
      { id: 'vicuna-7b', name: 'Vicuna 7B', category: 'instruct' },
      { id: 'vicuna-13b', name: 'Vicuna 13B', category: 'instruct' },
      { id: 'qwen-7b', name: 'Qwen 7B', category: 'base' },
      { id: 'baichuan2-7b', name: 'Baichuan2 7B', category: 'base' },
      { id: 'yi-6b', name: 'Yi 6B', category: 'base' },
    ]
    
    setModels(sampleModels)
    
    // 如果没有选中模型且有模型列表，则默认选中第一个
    if (!selected && sampleModels.length > 0) {
      onChange(sampleModels[0].id)
    }
  }, [selected, onChange])
  
  // 过滤模型
  const filteredModels = searchQuery 
    ? models.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : models
  
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('training.modelProvider.selectModel')}
        </label>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('training.searchModel')}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        
        <div className="border rounded max-h-60 overflow-y-auto">
          {filteredModels.length > 0 ? (
            filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => onChange(model.id)}
                className={`
                  p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0
                  ${selected === model.id ? 'bg-blue-50' : ''}
                `}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {t(`training.modelCategory.${model.category}`)}
                    </div>
                  </div>
                  {selected === model.id && (
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">{t('training.noModelsFound')}</div>
          )}
        </div>
      </div>
    </div>
  )
} 