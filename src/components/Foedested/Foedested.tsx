import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Label } from '@navikt/ds-react'
import Flag from '@navikt/flagg-ikoner'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  PaddedRow,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import CountryData, { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Foedested } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface FoedestedProps {
  foedested: Foedested | undefined
  onFoedestedChanged: (newFoedested: Foedested) => void
  namespace: string,
  loggingNamespace: string,
  validation: Validation
}

const FoedestedFC: React.FC<FoedestedProps> = ({
  loggingNamespace,
  foedested,
  onFoedestedChanged,
  namespace,
  validation
}: FoedestedProps) => {
  const { t } = useTranslation()
  const countryData = CountryData.getCountryInstance('nb')

  const [_newFoedested, _setNewFoedested] = useState<Foedested | undefined>(undefined)
  const [_editFoedested, _setEditFoedested] = useState<Foedested | undefined>(undefined)

  const [_editMode, _setEditMode] = useState<boolean>(false)
  const [_newForm, _setNewForm] = useState<boolean>(false)

  const emptyFoedsted: boolean = (
    _.isEmpty(foedested?.by?.trim()) &&
    _.isEmpty(foedested?.region?.trim()) &&
    _.isEmpty(foedested?.land?.trim())
  )

  const setBy = (by: string, index: number) => {
    if (index < 0) {
      _setNewFoedested({
        ..._newFoedested,
        by: by.trim()
      })
      return
    }
    _setEditFoedested({
      ..._editFoedested,
      by: by.trim()
    })
  }

  const setRegion = (region: string, index: number) => {
    if (index < 0) {
      _setNewFoedested({
        ..._newFoedested,
        region: region.trim()
      })
      return
    }
    _setEditFoedested({
      ..._editFoedested,
      region: region.trim()
    })
  }

  const setLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewFoedested({
        ..._newFoedested,
        land: land.trim()
      })
      return
    }
    _setEditFoedested({
      ..._editFoedested,
      land: land.trim()
    })
  }

  const onCloseEdit = () => {
    _setEditFoedested(undefined)
    _setEditMode(false)
  }

  const onCloseNew = () => {
    _setNewFoedested(undefined)
    _setNewForm(false)
  }

  const onStartEdit = (f: Foedested) => {
    _setEditFoedested(f)
    _setEditMode(true)
  }

  const onSaveEdit = () => {
    onFoedestedChanged(_editFoedested ?? {} as Foedested)
    onCloseEdit()
  }

  const onRemove = () => {
    standardLogger(loggingNamespace + '.foedested.remove')
    onFoedestedChanged({})
  }

  const onAddNew = () => {
    // this one does not have validation.
    standardLogger(loggingNamespace + '.foedested.add')
    onFoedestedChanged(_newFoedested ?? {} as Foedested)
    onCloseNew()
  }

  const renderRow = (foedested: Foedested | null, index: number) => {
    const inEditMode = index < 0 || _editMode
    const _foedested = index < 0 ? _newFoedested : (inEditMode ? _editFoedested : foedested)
    return (
      <RepeatableRow
        id={'repeatablerow-' + namespace}
        className={classNames({
          new: index < 0
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <Row>
          <Column>
            {inEditMode
              ? (
                <Input
                  error={validation[namespace + '-by']?.feilmelding}
                  id='by'
                  label={t('label:by')}
                  hideLabel={index >= 0}
                  namespace={namespace}
                  onChanged={(newBy: string) => setBy(newBy, index)}
                  value={_foedested?.by}
                />
                )
              : (
                <BodyLong id={namespace + '-by'}>
                  {_foedested?.by}
                </BodyLong>
                )}
          </Column>
          <Column>
            {inEditMode
              ? (
                <Input
                  error={validation[namespace + '-region']?.feilmelding}
                  id='region'
                  label={t('label:region')}
                  hideLabel={index >= 0}
                  namespace={namespace}
                  onChanged={(newRegion: string) => setRegion(newRegion, index)}
                  value={_foedested?.region}
                />
                )
              : (
                <BodyLong id={namespace + '-region'}>{_foedested?.region}</BodyLong>
                )}
          </Column>
          <Column>
            {inEditMode
              ? (
                <CountrySelect
                  data-testid={namespace + '-land'}
                  error={validation[namespace + '-land']?.feilmelding}
                  id={namespace + '-land'}
                  includeList={CountryFilter.STANDARD({})}
                  label={t('label:land')}
                  hideLabel={index >= 0}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => setLand(e.value, index)}
                  values={_foedested?.land}
                />
                )
              : (
                <FlexCenterDiv id={namespace + '-land'}>
                  {_foedested?.land && (
                    <>
                      <Flag size='S' country={_foedested?.land!} />
                      <HorizontalSeparatorDiv />
                    </>
                  )}
                  {countryData.findByValue(_foedested?.land)?.label ?? _foedested?.land}
                </FlexCenterDiv>
                )}
          </Column>
        </Row>
        <PaddedRow size='0.5'>
          <Column style={{ minHeight: '2.5rem' }} />
          <AlignEndColumn>
            <AddRemovePanel<Foedested>
              item={foedested}
              inEditMode={inEditMode}
              index={index}
              onRemove={onRemove}
              onAddNew={onAddNew}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={onCloseEdit}
            />
          </AlignEndColumn>
        </PaddedRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      {
        emptyFoedsted
          ? (
            <PaddedHorizontallyDiv>
              <SpacedHr />
              <BodyLong>
                {t('message:warning-no-foedested')}
              </BodyLong>
              <SpacedHr />
            </PaddedHorizontallyDiv>
            )
          : (
            <>
              <PaddedHorizontallyDiv>
                <AlignStartRow>
                  <Column>
                    <Label>
                      {t('label:by')}
                    </Label>
                  </Column>
                  <Column>
                    <Label>
                      {t('label:region')}
                    </Label>
                  </Column>
                  <Column>
                    <Label>
                      {t('label:land')}
                    </Label>
                  </Column>
                </AlignStartRow>
              </PaddedHorizontallyDiv>
              <VerticalSeparatorDiv size='0.8' />
              {renderRow(foedested!, 0)}
            </>
            )
      }
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <>
            {emptyFoedsted && (
              <PaddedDiv>
                <Button
                  variant='tertiary'
                  onClick={() => _setNewForm(true)}
                  icon={<PlusCircleIcon />}
                >
                  {t('el:button-add-x', { x: t('label:fødested')?.toLowerCase() })}
                </Button>
              </PaddedDiv>
            )}
          </>
          )}
    </>
  )
}

export default FoedestedFC
