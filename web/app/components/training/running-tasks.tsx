'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  RiPlayFill, 
  RiPauseFill, 
  RiStopFill, 
  RiDeleteBin6Line, 
  RiFileDownloadLine, 
  RiInformationLine,
  RiMoreLine
} from '@remixicon/react'

interface TrainingTask {
  id: string
  name: string
  model: string
  dataset: string
  status: 'running' | 'paused' | 'completed' | 'failed' | 'stopped'
  progress: number
  startTime: string
  endTime?: string
  gpuUsage?: string
  ramUsage?: string
  estimatedTimeLeft?: string
  loss?: number
}

export function RunningTasks() {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<TrainingTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  
  // 模拟获取任务列表
  useEffect(() => {
    setIsLoading(true)
    
    const sampleTasks: TrainingTask[] = [
      {
        id: 'task-1',
        name: 'LLaMA-2-7B LoRA训练',
        model: 'llama2-7b',
        dataset: 'alpaca-zh',
        status: 'running',
        progress: 45,
        startTime: '2023-09-15 14:30:00',
        gpuUsage: '13.2 GB / 16 GB',
        ramUsage: '24 GB / 64 GB',
        estimatedTimeLeft: '约2小时30分钟',
        loss: 1.8765
      },
      {
        id: 'task-2',
        name: 'Mistral-7B指令微调',
        model: 'mistral-7b',
        dataset: 'sharegpt',
        status: 'paused',
        progress: 23,
        startTime: '2023-09-15 12:15:00',
        gpuUsage: '0 GB / 16 GB',
        ramUsage: '0 GB / 64 GB',
        estimatedTimeLeft: '约3小时45分钟',
        loss: 2.1432
      },
      {
        id: 'task-3',
        name: 'Baichuan-7B全参数训练',
        model: 'baichuan2-7b',
        dataset: 'custom-data',
        status: 'completed',
        progress: 100,
        startTime: '2023-09-14 09:30:00',
        endTime: '2023-09-14 18:45:00',
        loss: 0.9876
      },
      {
        id: 'task-4',
        name: 'LLaMA-3-8B QLoRA训练',
        model: 'llama3-8b',
        dataset: 'hh-rlhf',
        status: 'failed',
        progress: 67,
        startTime: '2023-09-13 20:10:00',
        endTime: '2023-09-14 02:30:00',
        loss: 1.5432
      }
    ]
    
    setTimeout(() => {
      setTasks(sampleTasks)
      setIsLoading(false)
    }, 800)
  }, [])
  
  // 获取任务状态对应的样式和文本
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'running':
        return {
          text: t('training.taskStatus.running'),
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: <RiPlayFill className="h-4 w-4" />
        }
      case 'paused':
        return {
          text: t('training.taskStatus.paused'),
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <RiPauseFill className="h-4 w-4" />
        }
      case 'completed':
        return {
          text: t('training.taskStatus.completed'),
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: <RiInformationLine className="h-4 w-4" />
        }
      case 'failed':
        return {
          text: t('training.taskStatus.failed'),
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <RiStopFill className="h-4 w-4" />
        }
      case 'stopped':
        return {
          text: t('training.taskStatus.stopped'),
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <RiStopFill className="h-4 w-4" />
        }
      default:
        return {
          text: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: null
        }
    }
  }
  
  // 处理任务操作
  const handleTaskAction = (taskId: string, action: 'resume' | 'pause' | 'stop' | 'delete' | 'download') => {
    // 在实际应用中，这里会调用API执行相应操作
    console.log(`对任务 ${taskId} 执行操作: ${action}`)
    
    // 模拟状态更新
    if (action === 'pause') {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'paused' as const } : task
      ))
    } else if (action === 'resume') {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'running' as const } : task
      ))
    } else if (action === 'stop') {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'stopped' as const } : task
      ))
    } else if (action === 'delete') {
      setTasks(prev => prev.filter(task => task.id !== taskId))
    }
  }
  
  // 切换任务详情展开/折叠状态
  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTaskId(prev => prev === taskId ? null : taskId)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{t('training.runningTasks')}</h2>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status)
            const isExpanded = expandedTaskId === task.id
            
            return (
              <div key={task.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <h3 className="font-medium">{task.name}</h3>
                      <div className={`ml-3 px-2 py-0.5 text-xs rounded-full flex items-center ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                        {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
                        {statusInfo.text}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleTaskExpanded(task.id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <RiMoreLine className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">{t('training.taskProperties.model')}:</span>{' '}
                      {task.model}
                    </div>
                    <div>
                      <span className="text-gray-500">{t('training.taskProperties.dataset')}:</span>{' '}
                      {task.dataset}
                    </div>
                    <div>
                      <span className="text-gray-500">{t('training.taskProperties.startTime')}:</span>{' '}
                      {task.startTime}
                    </div>
                    <div>
                      {task.endTime && (
                        <>
                          <span className="text-gray-500">{t('training.taskProperties.endTime')}:</span>{' '}
                          {task.endTime}
                        </>
                      )}
                      {!task.endTime && task.estimatedTimeLeft && (
                        <>
                          <span className="text-gray-500">{t('training.taskProperties.timeLeft')}:</span>{' '}
                          {task.estimatedTimeLeft}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {task.status !== 'completed' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-500">{t('training.progress')}: {task.progress}%</span>
                        {task.loss && <span className="text-sm text-gray-500">{t('training.loss')}: {task.loss.toFixed(4)}</span>}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${task.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t">
                      {(task.gpuUsage || task.ramUsage) && (
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          {task.gpuUsage && (
                            <div>
                              <span className="text-gray-500">{t('training.taskProperties.gpuUsage')}:</span>{' '}
                              {task.gpuUsage}
                            </div>
                          )}
                          {task.ramUsage && (
                            <div>
                              <span className="text-gray-500">{t('training.taskProperties.ramUsage')}:</span>{' '}
                              {task.ramUsage}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex space-x-2 mt-2">
                        {task.status === 'running' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'pause')}
                            className="flex items-center px-3 py-1 text-sm text-yellow-600 border border-yellow-200 rounded hover:bg-yellow-50"
                          >
                            <RiPauseFill className="mr-1 h-4 w-4" />
                            {t('training.pauseTask')}
                          </button>
                        )}
                        
                        {task.status === 'paused' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'resume')}
                            className="flex items-center px-3 py-1 text-sm text-green-600 border border-green-200 rounded hover:bg-green-50"
                          >
                            <RiPlayFill className="mr-1 h-4 w-4" />
                            {t('training.resumeTask')}
                          </button>
                        )}
                        
                        {(task.status === 'running' || task.status === 'paused') && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'stop')}
                            className="flex items-center px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                          >
                            <RiStopFill className="mr-1 h-4 w-4" />
                            {t('training.stopTask')}
                          </button>
                        )}
                        
                        {task.status === 'completed' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'download')}
                            className="flex items-center px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                          >
                            <RiFileDownloadLine className="mr-1 h-4 w-4" />
                            {t('training.downloadModel')}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleTaskAction(task.id, 'delete')}
                          className="flex items-center px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                        >
                          <RiDeleteBin6Line className="mr-1 h-4 w-4" />
                          {t('training.deleteTask')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border rounded-lg p-8 bg-white text-center">
          <div className="text-gray-500">
            <RiInformationLine className="h-8 w-8 mx-auto mb-2" />
            <p>{t('training.noRunningTasks')}</p>
            <p className="text-sm mt-1">{t('training.startTrainingTip')}</p>
          </div>
        </div>
      )}
    </div>
  )
} 