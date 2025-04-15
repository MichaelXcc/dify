'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RiInformationLine, RiLinksLine, RiDownloadLine } from '@remixicon/react'

interface ModelInfoPanelProps {
  modelId: string
}

interface ModelInfo {
  id: string
  name: string
  category: string
  description: string
  parameters: string
  architecture: string
  license: string
  source: string
  requiresAuth: boolean
  infoLink: string
  downloadSize: string
}

export function ModelInfoPanel({ modelId }: ModelInfoPanelProps) {
  const { t } = useTranslation()
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 模拟获取模型信息
  useEffect(() => {
    if (!modelId) {
      setModelInfo(null)
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    
    // 模拟API请求
    setTimeout(() => {
      const modelDataMap: Record<string, ModelInfo> = {
        'llama2-7b': {
          id: 'llama2-7b',
          name: 'LLaMA-2 7B',
          category: 'base',
          description: 'LLaMA-2是Meta AI推出的开源大语言模型的最新版本，在多个基准测试中表现优异。',
          parameters: '7B',
          architecture: 'Decoder-only Transformer',
          license: 'Meta License',
          source: 'Meta AI',
          requiresAuth: true,
          infoLink: 'https://huggingface.co/meta-llama/Llama-2-7b',
          downloadSize: '13.5 GB'
        },
        'llama2-13b': {
          id: 'llama2-13b',
          name: 'LLaMA-2 13B',
          category: 'base',
          description: 'LLaMA-2是Meta AI推出的开源大语言模型的最新版本，13B参数版本在性能和效率之间提供了良好平衡。',
          parameters: '13B',
          architecture: 'Decoder-only Transformer',
          license: 'Meta License',
          source: 'Meta AI',
          requiresAuth: true,
          infoLink: 'https://huggingface.co/meta-llama/Llama-2-13b',
          downloadSize: '26 GB'
        },
        'llama3-8b': {
          id: 'llama3-8b',
          name: 'LLaMA-3 8B',
          category: 'base',
          description: 'LLaMA-3是Meta AI的最新模型，提供更强的推理能力和知识，上下文窗口更大。',
          parameters: '8B',
          architecture: 'Decoder-only Transformer',
          license: 'Meta License',
          source: 'Meta AI',
          requiresAuth: true,
          infoLink: 'https://huggingface.co/meta-llama/Llama-3-8b',
          downloadSize: '15 GB'
        },
        'mistral-7b': {
          id: 'mistral-7b',
          name: 'Mistral 7B',
          category: 'base',
          description: 'Mistral 7B是一个强大的开源模型，优化的注意力机制和训练方法使其性能超越许多同等规模的模型。',
          parameters: '7B',
          architecture: 'Decoder-only Transformer',
          license: 'Apache 2.0',
          source: 'Mistral AI',
          requiresAuth: false,
          infoLink: 'https://huggingface.co/mistralai/Mistral-7B-v0.1',
          downloadSize: '14 GB'
        },
        'mixtral-8x7b': {
          id: 'mixtral-8x7b',
          name: 'Mixtral 8x7B',
          category: 'base',
          description: 'Mixtral 8x7B是一个稀疏混合专家（MoE）模型，提供了惊人的性能和效率比，与大得多的模型相比。',
          parameters: '8x7B (MoE)',
          architecture: 'Mixture of Experts',
          license: 'Apache 2.0',
          source: 'Mistral AI',
          requiresAuth: false,
          infoLink: 'https://huggingface.co/mistralai/Mixtral-8x7B-v0.1',
          downloadSize: '45 GB'
        },
      }
      
      setModelInfo(modelDataMap[modelId] || null)
      setIsLoading(false)
    }, 500)
  }, [modelId])
  
  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 bg-white h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }
  
  if (!modelInfo) {
    return (
      <div className="border rounded-lg p-4 bg-white h-full flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <RiInformationLine className="h-8 w-8 mx-auto mb-2" />
          <p>{t('training.selectModelFirst')}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="border rounded-lg p-4 bg-white h-full">
      <h3 className="text-lg font-medium mb-3">{modelInfo.name}</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{modelInfo.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">{t('training.modelProperties.parameters')}</p>
            <p className="font-medium">{modelInfo.parameters}</p>
          </div>
          <div>
            <p className="text-gray-500">{t('training.modelProperties.architecture')}</p>
            <p className="font-medium">{modelInfo.architecture}</p>
          </div>
          <div>
            <p className="text-gray-500">{t('training.modelProperties.license')}</p>
            <p className="font-medium">{modelInfo.license}</p>
          </div>
          <div>
            <p className="text-gray-500">{t('training.modelProperties.source')}</p>
            <p className="font-medium">{modelInfo.source}</p>
          </div>
        </div>
        
        {modelInfo.requiresAuth && (
          <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-700">
            <p className="font-medium">{t('training.authRequired')}</p>
            <p className="text-xs mt-1">{t('training.authRequiredDescription')}</p>
          </div>
        )}
        
        <div className="flex space-x-2 pt-3">
          <a
            href={modelInfo.infoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
          >
            <RiLinksLine className="mr-1 h-4 w-4" />
            {t('training.viewModel')}
          </a>
          
          <button
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
          >
            <RiDownloadLine className="mr-1 h-4 w-4" />
            {t('training.downloadModel')} ({modelInfo.downloadSize})
          </button>
        </div>
      </div>
    </div>
  )
} 