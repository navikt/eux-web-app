import { XMarkIcon, PencilIcon, EnvelopeClosedIcon, PaperplaneIcon, StarIcon } from '@navikt/aksel-icons'
import { Detail, Label, HStack, VStack } from '@navikt/ds-react'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import _ from 'lodash'
import React  from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'store'

export interface SEDDetailsSelector {
  replySed: ReplySed | null | undefined
}

const mapState = (state: State): SEDDetailsSelector => ({
  replySed: state.svarsed.replySed
})

const SEDDetails: React.FC = () => {
  const { t } = useTranslation()
  const { replySed }: SEDDetailsSelector = useAppSelector(mapState)

  if (!replySed) {
    return <div />
  }


  return (
    <HStack gap="4" align="start">
      <VStack gap="1" align="center" title={t('')}>
        {replySed?.sed?.status === 'received' && <EnvelopeClosedIcon width='20' height='20' />}
        {replySed?.sed?.status === 'sent' && <PaperplaneIcon width='20' height='20' />}
        {(_.isNil(replySed?.sed) || replySed?.sed?.status === 'new') && <StarIcon width='20' height='20' />}
        {replySed?.sed?.status === 'active' && <PencilIcon width='20' height='20' />}
        {replySed?.sed?.status === 'cancelled' && <XMarkIcon width='20' height='20' />}
        <Detail>
          {t('app:status-received-' + (replySed?.sed?.status?.toLowerCase() ?? 'new'))}
        </Detail>
      </VStack>
      <Label>
        {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
      </Label>
    </HStack>
  )
}

export default SEDDetails
