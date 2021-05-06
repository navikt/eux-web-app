import HelpIcon from 'assets/icons/HelpIcon'
import TextArea from 'components/Forms/TextArea'
import { AlignStartRow, FlexCenterDiv, PaddedDiv, TextAreaDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastRadioPanelGroup, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface SvarPåForespørselProps {
  highContrast: boolean,
  personID: string
  parentNamespace: string,
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const HelpProperIcon = styled(HelpIcon)`
  &.hjelpetekst__ikon {
    width: 22px;
    height: 22px;
  }
`
const SvarPåForespørsel: React.FC<SvarPåForespørselProps> = ({
  personID,
  parentNamespace,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:SvarPåForespørselProps): JSX.Element => {
  const { t } = useTranslation()
  // TODO this
  const target = 'xxx-sisteansettelsesforhold'
  const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-sisteansettelsesforhold`

  const setSvar = (newSvar: string) => {
    updateReplySed(`${target}.svar`, newSvar.trim())
    if (validation[namespace + '-svar']) {
      resetValidation(namespace + '-svar')
    }
  }

  const setVedlegg = (newVedlegg: string) => {
    updateReplySed(`${target}.vedlegg`, newVedlegg.trim())
    if (validation[namespace + '-vedlegg']) {
      resetValidation(namespace + '-vedlegg')
    }
  }

  const setSender = (sender: string) => {
    updateReplySed(`${target}.sender`, sender.trim())
    if (validation[namespace + '-sender']) {
      resetValidation(namespace + '-sender')
    }
  }

  const setGrunner = (grunner: string) => {
    updateReplySed(`${target}.grunner`, grunner.trim())
    if (validation[namespace + '-grunner']) {
      resetValidation(namespace + '-grunner')
    }
  }

  /*
    const setAvkall = (avkall: string) => {
      updateReplySed(`${target}.avkall`, avkall.trim())
      if (validation[namespace + '-avkall']) {
        resetValidation(namespace + '-avkall')
      }
    }

    const setGrunn = (grunn: string) => {
      updateReplySed(`${target}.grunn`, grunn.trim())
      if (validation[namespace + '-grunn']) {
        resetValidation(namespace + '-grunn')
      }
    }

    const setAnnenYtelser = (annenYtelser: string) => {
      updateReplySed(`${target}.annenYtelser`, annenYtelser.trim())
      if (validation[namespace + '-annenytelser']) {
        resetValidation(namespace + '-annenytelser')
      }
    } */

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:siste-ansettelsesforhold')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <label className='skjemaelement__label'>
            {t('label:type-beløp')}
          </label>
          <HighContrastRadioPanelGroup
            checked={xxx?.svar}
            data-multiple-line
            data-no-border
            data-test-id={namespace + '-svar'}
            feil={validation[namespace + '-svar']?.feilmelding}
            id={namespace + '-svar'}
            name={namespace + '-svar'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvar(e.target.value)}
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
                value: 'svar-1'
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
                value: 'svar-2'
              }
            ]}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {!_.isNil(xxx?.svar) && (
        <>
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <TextAreaDiv>
                <TextArea
                  feil={validation[namespace + '-vedlegg']?.feilmelding}
                  namespace={namespace}
                  id='vedlegg'
                  label={t('label:vi-vedlegger')}
                  onChanged={setVedlegg}
                  value={xxx?.vedlegg}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <TextAreaDiv>
                <TextArea
                  feil={validation[namespace + '-sender']?.feilmelding}
                  namespace={namespace}
                  id='sender'
                  label={t('label:vi-sender')}
                  onChanged={setSender}
                  value={xxx?.sender}
                />
              </TextAreaDiv>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
        </>
      )}
      {xxx?.svar === 'svar-2' && (
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <TextAreaDiv>
              <TextArea
                feil={validation[namespace + '-grunner']?.feilmelding}
                namespace={namespace}
                id='grunner'
                label={t('label:grunner')}
                onChanged={setGrunner}
                value={xxx?.grunner}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>
      )}
    </PaddedDiv>
  )
}

export default SvarPåForespørsel
