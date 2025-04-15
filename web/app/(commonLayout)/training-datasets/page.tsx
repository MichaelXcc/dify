'use client'

import { useEffect, useState } from 'react'

export default function TrainingDatasetsPage() {
  const [iframeHeight, setIframeHeight] = useState('calc(100vh - 64px)')

  useEffect(() => {
    // 计算iframe的高度，减去header的高度
    const headerHeight = 64 // 假设header高度为64px
    const windowHeight = window.innerHeight
    setIframeHeight(`${windowHeight - headerHeight}px`)

    const handleResize = () => {
      setIframeHeight(`${window.innerHeight - headerHeight}px`)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="w-full h-full">
      <iframe 
        src="http://localhost:1717/" 
        className="w-full border-none"
        style={{ height: iframeHeight }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        title="Training Dataset Platform"
      />
    </div>
  )
} 