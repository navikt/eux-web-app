import { BodyLong, Heading, Label } from '@navikt/ds-react'
import Flag from '@navikt/flagg-ikoner'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HorizontalSeparatorDiv,
  PaddedHorizontallyDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { mapState, MainFormProps } from 'applications/SvarSed/MainForm'
import Select from 'components/Forms/Select'
import { RepeatableRow } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { Pin } from 'declarations/sed'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'

const ExtraInformation: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const target = `${personID}.personInfo.pin`
  const pins: Array<Pin> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-extrainformation`

  const setSektor = (sektor: string, index: number) => {
    dispatch(updateReplySed(`${target}[${index}].sektor`, sektor))
    if (validation[namespace + getIdx(index) + '-sektor']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-sektor'))
    }
  }

  const personensStatusOptions: Options = [
    { label: t('tema:GEN'), value: 'GEN' },
    { label: t('tema:AAP'), value: 'AAP' }
  ]

  const renderRow = (pin: Pin, index: number) => {
    const idx = getIdx(index)
    return (
      <RepeatableRow>
        <AlignStartRow>
          <Column>
            <FlexCenterDiv style={{ marginTop: '2rem' }}>
              <Flag country={pin.land!} />
              <HorizontalSeparatorDiv />
              {pin.identifikator}
            </FlexCenterDiv>
          </Column>
          <Column>
            <Select
              defaultValue={_.find(personensStatusOptions, { value: pin.sektor })}
              error={validation[namespace + idx + '-sektor']?.feilmelding}
              key={namespace + idx + '-sektor-' + pin.sektor}
              id={namespace + idx + '-sektor'}
              menuPortalTarget={document.body}
              onChange={(o: unknown) => setSektor((o as Option).value, index)}
              options={personensStatusOptions}
              value={_.find(personensStatusOptions, { value: pin.sektor })}
            />
          </Column>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedHorizontallyDiv>
        <Heading size='small'>
          {t('label:extra-information')}
        </Heading>
      </PaddedHorizontallyDiv>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(pins)
        ? (
          <BodyLong>
            {t('message:warning-no-pins')}
          </BodyLong>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <Row>
                <Column>
                  <Label>{t('label:nasjonalitet')}</Label>
                </Column>
                <Column>
                  <Label>{t('label:personens-status')}</Label>
                </Column>
              </Row>
            </PaddedHorizontallyDiv>
            {pins?.map(renderRow)}
          </>
          )}
      <VerticalSeparatorDiv />
    </>
  )
}

export default ExtraInformation
