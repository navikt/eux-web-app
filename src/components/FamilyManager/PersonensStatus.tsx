import { Person } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import LesMer from 'components/LesMer/LesMer'

interface PersonensStatusProps {
  person: Person,
  highContrast: boolean
}
const PersonensStatusDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`

const PersonensStatus: React.FC<PersonensStatusProps> = ({
  // person,
  // highContrast
}:PersonensStatusProps): JSX.Element => {
  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const onArbeidsforholdChanged = (e: string) => {
    setIsDirty(true)
    setArbeidsforhold(e)
  }

  return (
    <PersonensStatusDiv>
      <Row>
        <Column>
          <Undertittel>
            {t('ui:label-arbeidsforhold-type')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <HighContrastRadioPanelGroup
            data-multiple-line='true'
            data-no-border='true'
            checked={_arbeidsforhold}
            data-test-id='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            id='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            feil={undefined}
            name='c-familymanager-personenstatus-arbeidsforhold-radiogroup'
            radios={[
              { label: t('ui:option-personensstatus-1'), value: '1' },
              { label: t('ui:option-personensstatus-2'), value: '2' },
              {
                label: (
                  <LesMer
                    visibleText={t('ui:option-personensstatus-3')}
                    invisibleText={t('ui:option-personensstatus-3-more')}
                    moreText={t('ui:label-see-more')}
                    lessText={t('ui:label-see-less')}
                  />),
                value: '3'
              },
              { label: t('ui:option-personensstatus-4'), value: '4' },
              {
                label: (
                  <LesMer
                    visibleText={t('ui:option-personensstatus-5')}
                    invisibleText={t('ui:option-personensstatus-5-more')}
                    moreText={t('ui:label-see-more')}
                    lessText={t('ui:label-see-less')}
                  />),
                value: '5'
              }
            ]}
            onChange={(e: any) => onArbeidsforholdChanged(e.target.value)}
          />

        </Column>
      </Row>
      {_isDirty && '*'}
    </PersonensStatusDiv>
  )
}

export default PersonensStatus
