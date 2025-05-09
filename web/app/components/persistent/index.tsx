'use client'

import { useRef } from 'react'
import PersistentFileUpload from './file-upload'

const Persistent = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  return (
    <div ref={containerRef} className='relative flex grow flex-col overflow-y-auto bg-background-body'>
      <PersistentFileUpload />
    </div>
  )
}

export default Persistent 