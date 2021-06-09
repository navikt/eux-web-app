import { setReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import HelpIcon from 'assets/icons/HelpIcon'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { HSed, HSvarType } from 'declarations/sed'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import Tooltip from 'rc-tooltip'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const HelpProperIcon = styled(HelpIcon)`
  &.hjelpetekst__ikon {
    width: 22px;
    height: 22px;
  }
`

const mapState = (state: State): PersonManagerFormSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const SvarPåForespørsel: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()

  const doWeHavePositive: boolean = !!(replySed as HSed)?.positivtSvar?.informasjon ||
    !!(replySed as HSed)?.positivtSvar?.dokument ||
    !!(replySed as HSed)?.positivtSvar?.sed

  const doWeHaveNegative: boolean = (replySed as HSed)?.negativeSvar?.length > 0

  const [_svar, _setSvar] = useState<HSvarType | undefined>(() =>
    doWeHavePositive ? 'positivt' :
      doWeHaveNegative ? 'negative' : undefined
  )

  const syncWithReplySed = (needle: string, value: any) => {
    let svarChanged: boolean = needle === 'svar'
    let thisSvar = svarChanged ? value : _svar
    if (thisSvar === 'positivt') {
      console.log('unmounting svarPaForespørsel as positive')
      let newPositivtSvar = {
        informasjon: svarChanged ? (replySed as HSed).negativeSvar[0].informasjon :  (replySed as HSed).positivtSvar.informasjon,
        dokument: svarChanged ? (replySed as HSed).negativeSvar[0].dokument :  (replySed as HSed).positivtSvar.dokument,
        sed: svarChanged ? (replySed as HSed).negativeSvar[0].sed :  (replySed as HSed).positivtSvar.sed
      }
      if (!svarChanged) {
        // @ts-ignore
        newPositivtSvar[needle] = value
      }
      dispatch(setReplySed({
        ...replySed,
        positivtSvar: newPositivtSvar,
        negativeSvar: []
      }))
    } else {
      console.log('unmounting svarPaForespørsel as negative')

      let newNegativtSvar = {
        informasjon: svarChanged ? (replySed as HSed).positivtSvar.informasjon :  (replySed as HSed).negativeSvar[0].informasjon,
        dokument: svarChanged ? (replySed as HSed).positivtSvar.dokument :  (replySed as HSed).negativeSvar[0].dokument,
        sed: svarChanged ? (replySed as HSed).positivtSvar.sed :  (replySed as HSed).negativeSvar[0].sed
      }
      if (!svarChanged) {
        // @ts-ignore
        newNegativtSvar[needle] = value
      }

      dispatch(setReplySed({
        ...replySed,
        positivtSvar: {},
        negativeSvar: [newNegativtSvar]
      }))
    }
  }

  const namespace = `${parentNamespace}-${personID}-svarpaforespørsel`

  const setSvar = (newSvar: HSvarType) => {
    _setSvar(newSvar)
    syncWithReplySed('svar', newSvar)
    if (validation[namespace + '-svar']) {
      dispatch(resetValidation(namespace + '-svar'))
    }
  }

  const setDokument = (newDokument: string) => {
    syncWithReplySed('dokument', newDokument)
    if (validation[namespace + '-dokument']) {
      dispatch(resetValidation(namespace + '-dokument'))
    }
  }

  const setInformasjon = (newInformasjon: string) => {
    syncWithReplySed('informasjon', newInformasjon)
    if (validation[namespace + '-informasjon']) {
      dispatch(resetValidation(namespace + '-informasjon'))
    }
  }

  const setSed = (newSed: string) => {
    syncWithReplySed('sed', newSed)
    if (validation[namespace + '-sed']) {
      dispatch(resetValidation(namespace + '-sed'))
    }
  }

  const setGrunn = (newGrunn: string) => {
    syncWithReplySed('grunn', newGrunn)
    if (validation[namespace + '-grunn']) {
      dispatch(resetValidation(namespace + '-grunn'))
    }
  }

  const data = _svar === 'positivt' ? (replySed as HSed).positivtSvar : (replySed as HSed).negativeSvar[0]

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:svar-på-forespørsel')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <label className='skjemaelement__label'>
            {t('label:choose')}
          </label>
          <HighContrastRadioPanelGroup
            checked={_svar}
            data-multiple-line
            data-no-border
            data-test-id={namespace + '-svar'}
            feil={validation[namespace + '-svar']?.feilmelding}
            id={namespace + '-svar'}
            name={namespace + '-svar'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value !== _svar) {
                setSvar(e.target.value as HSvarType)
              }
            }}
            radios={[
              {
                label: (
                  <FlexCenterDiv>
                    <span>{t('el:option-svar-1')}</span>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Tooltip placement='top' trigger={['hover']} overlay={<span>{t('message:help-jeg-kan-sende')}</span>}>
                      <HelpProperIcon className='hjelpetekst__ikon' />
                    </Tooltip>
                  </FlexCenterDiv>
                ),
                value: 'positivt' as HSvarType
              },
              {
                label: (
                  <FlexCenterDiv>
                    <span>{t('el:option-svar-2')}</span>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Tooltip placement='top' trigger={['hover']} overlay={<span>{t('message:help-jeg-kan-ikke-sende')}</span>}>
                      <HelpProperIcon className='hjelpetekst__ikon' />
                    </Tooltip>
                  </FlexCenterDiv>
                ),
                value: 'negative' as HSvarType
              }
            ]}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {!_.isNil(_svar) && (
        <>
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.05s' }}>
            <Column>
              <TextAreaDiv>
                <TextArea
                  feil={validation[namespace + '-dokument']?.feilmelding}
                  namespace={namespace}
                  id='dokument'
                  label={t('label:vi-vedlegger-dokumenter')}
                  onChanged={setDokument}
                  value={data?.dokument ?? ''}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <TextAreaDiv>
                <TextArea
                  feil={validation[namespace + '-informasjon']?.feilmelding}
                  namespace={namespace}
                  id='informasjon'
                  label={t('label:vi-sender-informasjon')}
                  onChanged={setInformasjon}
                  value={data?.informasjon ?? ''}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.15s' }}>
            <Column>
              <TextAreaDiv>
                <TextArea
                  feil={validation[namespace + '-sed']?.feilmelding}
                  namespace={namespace}
                  id='sed'
                  label={t('label:sed')}
                  onChanged={setSed}
                  value={data?.sed ?? ''}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
      )}
      {_svar === 'negative' && (
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
          <Column>
            <TextAreaDiv>
              <TextArea
                feil={validation[namespace + '-grunn']?.feilmelding}
                namespace={namespace}
                id='grunn'
                label={t('label:grunn')}
                onChanged={setGrunn}
                value={data?.grunn ?? ''}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
      )}
    </PaddedDiv>
  )
}

export default SvarPåForespørsel
