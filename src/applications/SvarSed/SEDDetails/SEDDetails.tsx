import { XMarkIcon, PencilIcon, EnvelopeClosedIcon, PaperplaneIcon, StarIcon } from '@navikt/aksel-icons'
import { Detail, Label } from '@navikt/ds-react'
import { FlexBaseDiv, HorizontalSeparatorDiv, PileCenterDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
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
    <>
      <FlexBaseDiv>
        <PileCenterDiv style={{ alignItems: 'center' }} title={t('')}>
          {replySed?.sed?.status === 'received' && <EnvelopeClosedIcon width='20' height='20' />}
          {replySed?.sed?.status === 'sent' && <PaperplaneIcon width='20' height='20' />}
          {(_.isNil(replySed?.sed) || replySed?.sed?.status === 'new') && <StarIcon width='20' height='20' />}
          {replySed?.sed?.status === 'active' && <PencilIcon width='20' height='20' />}
          {replySed?.sed?.status === 'cancelled' && <XMarkIcon width='20' height='20' />}
          <VerticalSeparatorDiv size='0.35' />
          <Detail>
            {t('app:status-received-' + (replySed?.sed?.status?.toLowerCase() ?? 'new'))}
          </Detail>
        </PileCenterDiv>
        <HorizontalSeparatorDiv />
        <Label>
          {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
        </Label>
      </FlexBaseDiv>
    </>
  )
}

export default SEDDetails
