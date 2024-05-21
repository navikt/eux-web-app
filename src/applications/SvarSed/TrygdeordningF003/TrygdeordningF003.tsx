import { Heading } from '@navikt/ds-react'
import {
  Column,
  FlexRadioPanels,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { validateTrygdeordninger, ValidateTrygdeordningerProps } from 'applications/SvarSed/TrygdeordningF003/validation'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import {JaNei, Periode, ReplySed} from 'declarations/sed'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const TrygdeordningF003: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
/*  updateReplySed,
  setReplySed*/
}: MainFormProps): JSX.Element => {
  const namespace = `${parentNamespace}-${personID}-trygdeordning`
  const target = `${personID}`
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const perioderMedYtelser: Array<Periode> | undefined = _.get(replySed, `${target}.perioderMedYtelser`)
  const ikkeRettTilYtelser: any | undefined = _.get(replySed, `${target}.ikkeRettTilYtelser`)

  const [_rettTilFamilieYtelser, _setRettTilFamilieYtelser] = useState<string>("")

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidateTrygdeordningerProps>(
      clonedValidation, namespace, validateTrygdeordninger, {
        // clone it, or we can have some state inconsistences between dispatches
        replySed: _.cloneDeep(replySed as ReplySed),
        personID: personID!,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  useEffect(() => {
    if(perioderMedYtelser && perioderMedYtelser.length > 0){
      _setRettTilFamilieYtelser("ja")
    } else if(ikkeRettTilYtelser){
      _setRettTilFamilieYtelser("nei")
    }
  }, [])

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          Trygdeordninger
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <Row>
          <Column flex='2'>
            <RadioPanelGroup
              value={_rettTilFamilieYtelser}
              data-no-border
              data-testid={namespace + '-rettTilFamilieYtelser'}
              error={validation[namespace + '-rettTilFamilieYtelser']?.feilmelding}
              id={namespace + '-rettTilFamilieYtelser'}
              legend={t('label:rett-til-familieytelser')}
              name={namespace + '-rettTilFamilieYtelser'}
              onChange={(e: string) => _setRettTilFamilieYtelser(e as JaNei)}
            >
              <FlexRadioPanels>
                <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column />
        </Row>
        <VerticalSeparatorDiv />
      </PaddedDiv>
    </>
  )
}

export default TrygdeordningF003
