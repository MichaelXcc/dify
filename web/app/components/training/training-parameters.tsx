'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RiInformationLine } from '@remixicon/react'

interface TrainingParametersProps {
  modelType: string
}

interface Parameter {
  id: string
  name: string
  description: string
  type: 'select' | 'number' | 'text' | 'checkbox' | 'slider'
  defaultValue: any
  options?: Array<{ value: string, label: string }>
  min?: number
  max?: number
  step?: number
  category: 'method' | 'hyperparameter' | 'advanced'
}

export default function TrainingParameters({ modelType }: TrainingParametersProps) {
  const { t } = useTranslation()
  const [parameters, setParameters] = useState<Record<string, any>>({})
  const [activeCategory, setActiveCategory] = useState<string>('method')
  
  // 定义参数列表
  const parameterList: Parameter[] = [
    // 方法参数
    { 
      id: 'training_method', 
      name: t('training.trainingMethod'), 
      description: t('training.trainingMethodDescription'),
      type: 'select', 
      defaultValue: 'lora',
      options: [
        { value: 'lora', label: 'LoRA' },
        { value: 'qlora', label: 'QLoRA' },
        { value: 'full', label: t('training.fullParameters') },
      ],
      category: 'method'
    },
    { 
      id: 'lora_rank', 
      name: t('training.loraRank'), 
      description: t('training.loraRankDescription'),
      type: 'number', 
      defaultValue: 8,
      min: 1,
      max: 256,
      category: 'method'
    },
    { 
      id: 'lora_alpha', 
      name: t('training.loraAlpha'), 
      description: t('training.loraAlphaDescription'),
      type: 'number', 
      defaultValue: 16,
      min: 1,
      max: 512,
      category: 'method'
    },
    
    // 超参数
    { 
      id: 'learning_rate', 
      name: t('training.learningRate'), 
      description: t('training.learningRateDescription'),
      type: 'number', 
      defaultValue: 2e-4,
      min: 1e-6,
      max: 1e-2,
      step: 1e-6,
      category: 'hyperparameter'
    },
    { 
      id: 'num_epochs', 
      name: t('training.numEpochs'), 
      description: t('training.numEpochsDescription'),
      type: 'number', 
      defaultValue: 3,
      min: 1,
      max: 100,
      category: 'hyperparameter'
    },
    { 
      id: 'batch_size', 
      name: t('training.batchSize'), 
      description: t('training.batchSizeDescription'),
      type: 'number', 
      defaultValue: 4,
      min: 1,
      max: 128,
      category: 'hyperparameter'
    },
    
    // 高级参数
    { 
      id: 'gradient_accumulation_steps', 
      name: t('training.gradientAccumulationSteps'), 
      description: t('training.gradientAccumulationStepsDescription'),
      type: 'number', 
      defaultValue: 4,
      min: 1,
      max: 32,
      category: 'advanced'
    },
    { 
      id: 'warmup_ratio', 
      name: t('training.warmupRatio'), 
      description: t('training.warmupRatioDescription'),
      type: 'slider', 
      defaultValue: 0.1,
      min: 0,
      max: 0.5,
      step: 0.01,
      category: 'advanced'
    },
    { 
      id: 'use_8bit_optimizer', 
      name: t('training.use8bitOptimizer'), 
      description: t('training.use8bitOptimizerDescription'),
      type: 'checkbox', 
      defaultValue: false,
      category: 'advanced'
    },
  ]
  
  // 初始化参数
  useEffect(() => {
    const initialParams: Record<string, any> = {}
    parameterList.forEach(param => {
      initialParams[param.id] = param.defaultValue
    })
    setParameters(initialParams)
  }, [])
  
  // 更新参数值
  const handleParameterChange = (paramId: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramId]: value
    }))
  }
  
  // 渲染参数输入控件
  const renderParameterInput = (param: Parameter) => {
    switch (param.type) {
      case 'select':
        return (
          <select
            value={parameters[param.id] || param.defaultValue}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {param.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'number':
        return (
          <input
            type="number"
            value={parameters[param.id] || param.defaultValue}
            onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
            min={param.min}
            max={param.max}
            step={param.step || 1}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        )
      
      case 'slider':
        return (
          <div className="mt-1 flex items-center space-x-3">
            <input
              type="range"
              value={parameters[param.id] || param.defaultValue}
              onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
              min={param.min}
              max={param.max}
              step={param.step || 0.01}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">{parameters[param.id] || param.defaultValue}</span>
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={parameters[param.id] || param.defaultValue}
                onChange={(e) => handleParameterChange(param.id, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">{t('training.enable')}</span>
            </label>
          </div>
        )
      
      default:
        return null
    }
  }
  
  // 获取当前类别的参数
  const currentCategoryParams = parameterList.filter(
    param => param.category === activeCategory
  )
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-medium mb-4">{t('training.trainingParameters')}</h3>
      
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeCategory === 'method' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveCategory('method')}
        >
          {t('training.categories.method')}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeCategory === 'hyperparameter' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveCategory('hyperparameter')}
        >
          {t('training.categories.hyperparameter')}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeCategory === 'advanced' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveCategory('advanced')}
        >
          {t('training.categories.advanced')}
        </button>
      </div>
      
      <div className="space-y-4">
        {currentCategoryParams.map((param) => (
          <div key={param.id} className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-4">
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700">
                  {param.name}
                </label>
                <div className="group relative ml-1">
                  <RiInformationLine className="h-4 w-4 text-gray-400" />
                  <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow-lg w-48 z-10">
                    {param.description}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-8">
              {renderParameterInput(param)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 