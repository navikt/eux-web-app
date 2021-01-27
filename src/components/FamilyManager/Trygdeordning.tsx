import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { Person } from 'declarations/types'
import _ from 'lodash'
import { Ingress, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface TrygdeordningProps {
  person: Person,
  highContrast: boolean
}
const KontaktinformasjonDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`

interface Periode {
  startdato: string
  sluttdato?: string
}

type Category = 'dekket' | 'udekket' | 'familie'

type What = 'startdato' | 'sluttdato'

const Trygdeordning: React.FC<TrygdeordningProps> = ({
  // person,
  // highContrast
}: TrygdeordningProps): JSX.Element => {
  const [_perioder, setPerioder] = useState<{[k in Category]: Array<Periode>}>({
    dekket: [], udekket: [], familie: []
  })
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()

  const onAdd = (category: Category) => {
    const newPerioder = _.cloneDeep(_perioder)
    newPerioder[category] = newPerioder[category].concat({ startdato: '', sluttdato: '' })
    setPerioder(newPerioder)
  }

  const onRemoved = (category: Category, i: number) => {
    const newPerioder = _.cloneDeep(_perioder)
    newPerioder[category].splice(i, 1)
    setPerioder(newPerioder)
  }

  const onChanged = (e: string, what: What, category: Category, i: number) => {
    setIsDirty(true)
    const newPerioder = _.cloneDeep(_perioder)
    newPerioder[category][i][what] = e
    setPerioder(newPerioder)
  }

  const renderRow = (e: Periode, category: Category, i: number) => (
    <>
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-trygdeordning-' + category + '-' + i + '-startdato-input'}
            id={'c-familymanager-trygdeordning-' + category + '-' + i + '-startdato-input'}
            onChange={(e: any) => onChanged(e.target.value, 'startdato', category, i)}
            value={e.startdato}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-trygdeordning-' + category + '-' + i + '-sluttdato-input'}
            id={'c-familymanager-trygdeordning-' + category + '-' + i + '-sluttdato-input'}
            onChange={(e: any) => onChanged(e.target.value, 'sluttdato', category, i)}
            value={e.sluttdato}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => onRemoved(category, i)}
          >
            <Trashcan />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('ui:label-remove')}
          </HighContrastFlatknapp>
        </Column>
      </Row>
      <VerticalSeparatorDiv />
    </>
  )

  const renderCategory = (category: Category) => {
    return (
      <>
        <VerticalSeparatorDiv />
        <Ingress>
          {t('ui:label-trygdeordningen-' + category)}
        </Ingress>
        <VerticalSeparatorDiv />
        <Row>
          <Column>
            <label className='skjemaelement__label'>
              {t('ui:label-startDate')}
            </label>
          </Column>
          <Column>
            <label className='skjemaelement__label'>
              {t('ui:label-endDate')}
            </label>
          </Column>
          <Column />
        </Row>
        <VerticalSeparatorDiv />
        {_perioder[category].map((n, i) => (renderRow(n, category, i)))}
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={() => onAdd(category)}
        >
          <Tilsette />
          <HorizontalSeparatorDiv data-size='0.5' />
          {t('ui:label-add-new-period')}
        </HighContrastFlatknapp>
      </>
    )
  }

  return (
    <KontaktinformasjonDiv>
      <Undertittel>
        {t('ui:label-dekning-trygdeordningen')}
      </Undertittel>
      {renderCategory('dekket')}
      {renderCategory('udekket')}
      {renderCategory('familie')}
      {_isDirty && '*'}
    </KontaktinformasjonDiv>
  )
}

export default Trygdeordning
