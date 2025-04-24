'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ConnectPanelProps {
  onConnect: (url: string) => void
}

export default function ConnectPanel({ onConnect }: ConnectPanelProps) {
  const { t } = useTranslation()
  const [url, setUrl] = useState('http://192.168.2.221:7860')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!url || !url.startsWith('http')) {
      setError(t('training.invalidURL'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // 使用一个简单的超时方式检测URL
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // 尝试ping该URL，不关心结果，只关心能否连接
      await fetch(url, { 
        mode: 'no-cors',  // 避免CORS错误
        signal: controller.signal,
        cache: 'no-cache'
      });
      clearTimeout(timeoutId);
      
      // 如果能够到达这里，说明至少没有立即失败
      onConnect(url);
    } catch (e) {
      console.log('Connection error:', e);
      // 连接失败，显示错误信息
      setError(t('training.invalidIPAddress'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-medium mb-4">{t('training.connection.connectToServer')}</h2>
        
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm text-gray-600">{t('training.connection.enterServerURL')}</p>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('training.connection.connecting') : t('training.connection.connect')}
            </button>
            
            {/* <div className="border-t pt-4"> */}
              {/* <h3 className="font-medium mb-2">{t('training.connection.startServer')}</h3> */}
              {/* <p className="text-sm text-gray-600 mb-2">{t('training.connection.startServerTip')}</p> */}
              {/* <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                cd factory/llamafactory && python -m webui.app --listen
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  )
} 