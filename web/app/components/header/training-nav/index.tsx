'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiSettings4Fill,
  RiSettings4Line,
} from '@remixicon/react'
import classNames from '@/utils/classnames'

type TrainingNavProps = {
  className?: string
}

const TrainingNav = ({
  className,
}: TrainingNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'training'

  return (
    <Link href="/training" className={classNames(
      'group text-sm font-medium',
      activated && 'font-semibold bg-components-main-nav-nav-button-bg-active hover:bg-components-main-nav-nav-button-bg-active-hover shadow-md',
      activated ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
      className,
    )}>
      {
        activated
          ? <RiSettings4Fill className='mr-2 h-4 w-4' />
          : <RiSettings4Line className='mr-2 h-4 w-4' />
      }
      {t('common.menus.training')}
    </Link>
  )
}

export default TrainingNav 