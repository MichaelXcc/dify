'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { RiDownloadLine, RiRefreshLine, RiTerminalLine } from '@remixicon/react'

interface LogEntry {
  timestamp: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG'
  message: string
}

export function TrainingLogs() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [autoScroll, setAutoScroll] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)
  
  // 模拟获取日志数据
  useEffect(() => {
    // 在实际应用中，这里可能会连接到WebSocket获取实时日志
    setIsLoading(true)
    
    const sampleLogs: LogEntry[] = [
      { timestamp: '2023-09-15 14:32:10', level: 'INFO', message: '开始训练过程...' },
      { timestamp: '2023-09-15 14:32:11', level: 'INFO', message: '加载模型: LLaMA-2 7B...' },
      { timestamp: '2023-09-15 14:32:15', level: 'INFO', message: '模型已加载' },
      { timestamp: '2023-09-15 14:32:16', level: 'INFO', message: '加载数据集: Alpaca (Chinese)...' },
      { timestamp: '2023-09-15 14:32:20', level: 'INFO', message: '数据集已加载，共51000个样本' },
      { timestamp: '2023-09-15 14:32:21', level: 'INFO', message: '初始化优化器: AdamW' },
      { timestamp: '2023-09-15 14:32:22', level: 'INFO', message: '训练参数: 学习率=2e-4, 批次大小=4, 训练轮数=3' },
      { timestamp: '2023-09-15 14:32:23', level: 'INFO', message: '开始训练: 第1轮' },
      { timestamp: '2023-09-15 14:35:30', level: 'INFO', message: '进度: 10%, 损失: 2.4532' },
      { timestamp: '2023-09-15 14:38:45', level: 'INFO', message: '进度: 20%, 损失: 2.1245' },
      { timestamp: '2023-09-15 14:41:50', level: 'WARNING', message: 'CUDA内存不足，尝试减小批次大小' },
      { timestamp: '2023-09-15 14:42:05', level: 'INFO', message: '重新配置批次大小为2' },
      { timestamp: '2023-09-15 14:45:10', level: 'INFO', message: '进度: 30%, 损失: 1.8976' },
      { timestamp: '2023-09-15 14:48:20', level: 'INFO', message: '进度: 40%, 损失: 1.7654' },
      { timestamp: '2023-09-15 14:51:30', level: 'INFO', message: '进度: 50%, 损失: 1.6543' },
      { timestamp: '2023-09-15 14:54:40', level: 'INFO', message: '进度: 60%, 损失: 1.5432' },
      { timestamp: '2023-09-15 14:57:50', level: 'INFO', message: '进度: 70%, 损失: 1.4321' },
      { timestamp: '2023-09-15 15:01:00', level: 'INFO', message: '进度: 80%, 损失: 1.3210' },
      { timestamp: '2023-09-15 15:04:10', level: 'INFO', message: '进度: 90%, 损失: 1.2109' },
      { timestamp: '2023-09-15 15:07:20', level: 'INFO', message: '第1轮训练完成，平均损失: 1.1098' },
      { timestamp: '2023-09-15 15:07:25', level: 'INFO', message: '保存检查点: checkpoint-1.pt' },
      { timestamp: '2023-09-15 15:07:30', level: 'INFO', message: '开始训练: 第2轮' },
      { timestamp: '2023-09-15 15:10:40', level: 'INFO', message: '进度: 10%, 损失: 1.0987' },
      { timestamp: '2023-09-15 15:13:50', level: 'ERROR', message: '训练过程中断: CUDA设备错误' },
      { timestamp: '2023-09-15 15:14:00', level: 'INFO', message: '尝试恢复训练...' },
      { timestamp: '2023-09-15 15:14:10', level: 'INFO', message: '从检查点恢复: checkpoint-1.pt' },
      { timestamp: '2023-09-15 15:14:20', level: 'INFO', message: '恢复成功，继续训练' },
    ]
    
    setTimeout(() => {
      setLogs(sampleLogs)
      setIsLoading(false)
    }, 1000)
  }, [])
  
  // 自动滚动到底部
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])
  
  const getLogLevelClass = (level: string) => {
    switch (level) {
      case 'INFO':
        return 'text-blue-600'
      case 'WARNING':
        return 'text-amber-600'
      case 'ERROR':
        return 'text-red-600'
      case 'DEBUG':
        return 'text-gray-600'
      default:
        return 'text-gray-800'
    }
  }
  
  const refreshLogs = () => {
    setIsLoading(true)
    // 在实际应用中，这里会重新获取日志
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }
  
  const downloadLogs = () => {
    // 创建日志文本
    const logText = logs.map(log => `[${log.timestamp}] [${log.level}] ${log.message}`).join('\n')
    
    // 创建下载链接
    const element = document.createElement('a')
    const file = new Blob([logText], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `training-logs-${new Date().toISOString().slice(0, 10)}.txt`
    
    // 模拟点击下载
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{t('training.trainingLogs')}</h2>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="mr-1.5 rounded border-gray-300 text-blue-600"
            />
            {t('training.autoScroll')}
          </label>
          
          <button
            onClick={refreshLogs}
            className="flex items-center px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
            disabled={isLoading}
          >
            <RiRefreshLine className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('training.refresh')}
          </button>
          
          <button
            onClick={downloadLogs}
            className="flex items-center px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
          >
            <RiDownloadLine className="mr-1 h-4 w-4" />
            {t('training.downloadLogs')}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-2 p-4 bg-gray-50 rounded-lg h-96">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded" style={{ width: `${70 + Math.random() * 30}%` }}></div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute top-0 left-0 w-full p-2 bg-gray-800 text-white text-xs flex items-center">
            <RiTerminalLine className="mr-1 h-4 w-4" />
            <span>{t('training.terminalOutput')}</span>
          </div>
          
          <div className="bg-gray-900 text-gray-100 font-mono text-sm p-4 pt-10 rounded-lg h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="pb-1">
                  <span className="text-gray-400">[{log.timestamp}]</span>{' '}
                  <span className={getLogLevelClass(log.level)}>[{log.level}]</span>{' '}
                  <span>{log.message}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic">{t('training.noLogsFound')}</div>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </div>
  )
} 