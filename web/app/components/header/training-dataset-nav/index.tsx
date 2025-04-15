'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiDatabase2Fill,
  RiDatabase2Line,
} from '@remixicon/react'
import classNames from '@/utils/classnames'

type TrainingDatasetNavProps = {
  className?: string
}

const TrainingDatasetNav = ({
  className,
}: TrainingDatasetNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'training-datasets'

  return (
    <Link href="/training-datasets" className={classNames(
      'group text-sm font-medium',
      activated && 'font-semibold bg-components-main-nav-nav-button-bg-active hover:bg-components-main-nav-nav-button-bg-active-hover shadow-md',
      activated ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
      className,
    )}>
      {
        activated
          ? <RiDatabase2Fill className='mr-2 h-4 w-4' />
          : <RiDatabase2Line className='mr-2 h-4 w-4' />
      }
      {t('common.menus.trainingDatasets')}
    </Link>
  )
}

export default TrainingDatasetNav 