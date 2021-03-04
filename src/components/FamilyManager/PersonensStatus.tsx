import Tilsette from 'assets/icons/Tilsette'
import Arbeidsforhold from 'components/Arbeidsforhold/Arbeidsforhold'
import { ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import LesMer from 'components/LesMer/LesMer'

interface PersonensStatusProps {
  gettingArbeidsforholdList: boolean
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation,

  getArbeidsforholdList: (fnr: string | undefined) => void,
  arbeidsforholdList: any
}
const PersonensStatusDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`

const PersonensStatus: React.FC<PersonensStatusProps> = ({
/*  highContrast,
  onValueChanged,

  validation,*/
  gettingArbeidsforholdList,
  personID,
  replySed,
  getArbeidsforholdList,
  arbeidsforholdList
}:PersonensStatusProps): JSX.Element => {
  const [_arbeidsforhold, setArbeidsforhold] = useState<string>('')
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const [_arbeidsforholdList, setArbeidsforholdList] = useState<Array<Arbeidsforholdet> | undefined>(undefined)
  const [_valgteArbeidsforhold, setValgtArbeidsforhold] = useState<Array<Arbeidsforholdet>>([])
  const [_seeNewPeriodeInSender, setSeeNewPeriodeInSender] = useState<boolean>(false)
  const [_seeNewReasonToComing, setSeeNewReasonToComing] = useState<boolean>(false)
  const [_seeNewArbeidsperiode, setSeeNewArbeidsperiode] = useState<boolean>(false)
  const { t } = useTranslation()
  const fnr: string | undefined = _.find(_.get(replySed, `${personID}.personInfo.pin`), p => p.land === 'NO')?.identifikator

  const onArbeidsforholdClick = (item: any, checked: boolean) => {
    let newValgtArbeidsforhold: Array<Arbeidsforholdet>
    if (checked) {
      newValgtArbeidsforhold = _valgteArbeidsforhold.concat(item)
    } else {
      newValgtArbeidsforhold = _.filter(_valgteArbeidsforhold, v => v !== item)
    }
    setValgtArbeidsforhold(newValgtArbeidsforhold)
  }

  const onArbeidsforholdChanged = (e: string) => {
    setIsDirty(true)
    setArbeidsforhold(e)
  }

  useEffect(() => {
    if (_arbeidsforholdList === undefined && arbeidsforholdList !== undefined) {
      setArbeidsforholdList(arbeidsforholdList)
    }
  },[_arbeidsforholdList, arbeidsforholdList, setArbeidsforholdList])

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
              { label: t('ui:option-personensstatus-1'), value: 'arbeidsforhold-1' },
              { label: t('ui:option-personensstatus-2'), value: 'arbeidsforhold-2' },
              {
                label: (
                  <LesMer
                    visibleText={t('ui:option-personensstatus-3')}
                    invisibleText={t('ui:option-personensstatus-3-more')}
                    moreText={t('ui:label-see-more')}
                    lessText={t('ui:label-see-less')}
                  />),
                value: 'arbeidsforhold-3'
              },
              { label: t('ui:option-personensstatus-4'), value: 'arbeidsforhold-4' },
              {
                label: (
                  <LesMer
                    visibleText={t('ui:option-personensstatus-5')}
                    invisibleText={t('ui:option-personensstatus-5-more')}
                    moreText={t('ui:label-see-more')}
                    lessText={t('ui:label-see-less')}
                  />),
                value: 'arbeidsforhold-5'
              }
            ]}
            onChange={(e: any) => onArbeidsforholdChanged(e.target.value)}
          />
        </Column>
      </Row>
      {_arbeidsforhold === 'arbeidsforhold-1' && (
        <>
          <Arbeidsforhold
            getArbeidsforholdList={() => getArbeidsforholdList(fnr)}
            valgteArbeidsforhold={_valgteArbeidsforhold}
            arbeidsforholdList={_arbeidsforholdList}
            onArbeidsforholdClick={onArbeidsforholdClick}
            gettingArbeidsforholdList={gettingArbeidsforholdList}
          />

          {!_seeNewArbeidsperiode ? (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setSeeNewArbeidsperiode(true)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add-new-arbeidsperiode')}
            </HighContrastFlatknapp>
            ) : (
            <div>Ad</div>
          )}

          <VerticalSeparatorDiv data-size='2'/>
          <Undertittel>
            {t('ui:label-periode-in-sender')}
          </Undertittel>
          <VerticalSeparatorDiv/>

          {!_seeNewPeriodeInSender ? (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setSeeNewPeriodeInSender(true)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add-new-periode-in-sender')}
            </HighContrastFlatknapp>
          ) : (
            <div>Ad</div>
          )}

          <VerticalSeparatorDiv data-size='2'/>
          <Undertittel>
            {t('ui:label-reason-for-coming')}
          </Undertittel>
          <VerticalSeparatorDiv/>

          {!_seeNewReasonToComing ? (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setSeeNewReasonToComing(true)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add-new-reason-to-coming')}
            </HighContrastFlatknapp>
          ) : (
            <div>Ad</div>
          )}


        </>
      )}
      {_isDirty && '*'}
    </PersonensStatusDiv>
  )
}

export default PersonensStatus
