import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Label } from '@navikt/ds-react'
import Flag from '@navikt/flagg-ikoner'
import {
  AlignStartRow,
  PaddedRow,
  Column,
  AlignEndColumn,
  FlexCenterDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import CountryData, { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
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
  onFoedestedChanged: (newFoedested: Foedested | undefined, whatChanged: string | undefined) => void
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
  const [_newBy, _setNewBy] = useState<string>('')
  const [_newRegion, _setNewRegion] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [_editMode, _setEditMode] = useState<boolean>(false)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)

  const emptyFoedsted: boolean = (
    _.isEmpty(foedested?.by?.trim()) &&
    _.isEmpty(foedested?.region?.trim()) &&
    _.isEmpty(foedested?.land?.trim())
  )

  const onByChange = (newBy: string, index: number) => {
    if (index < 0) {
      _setNewBy(newBy.trim())
      return
    }
    let newFoedested: Foedested | undefined = _.cloneDeep(foedested)
    if (_.isEmpty(newFoedested)) {
      newFoedested = {} as Foedested
    }
    newFoedested!.by = newBy.trim()
    onFoedestedChanged(newFoedested, namespace + '[' + index + ']-by')
  }

  const onRegionChange = (newRegion: string, index: number) => {
    if (index < 0) {
      _setNewRegion(newRegion.trim())
      return
    }
    let newFoedested: Foedested | undefined = _.cloneDeep(foedested)
    if (_.isEmpty(newFoedested)) {
      newFoedested = {} as Foedested
    }
    newFoedested!.region = newRegion.trim()
    onFoedestedChanged(newFoedested, namespace + '[' + index + ']-region')
  }

  const onLandChange = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewLand(newLand.trim())
      return
    }
    let newFoedested: Foedested | undefined = _.cloneDeep(foedested)
    if (_.isEmpty(newFoedested)) {
      newFoedested = {} as Foedested
    }
    newFoedested!.land = newLand.trim()
    onFoedestedChanged(newFoedested, namespace + '[' + index + ']-land')
  }

  const onRemove = () => {
    standardLogger(loggingNamespace + '.foedested.remove')
    onFoedestedChanged(undefined, 'remove')
  }

  const resetForm = () => {
    _setNewBy('')
    _setNewRegion('')
    _setNewLand('')
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    _setEditMode(false)
    resetForm()
  }

  const onAdd = () => {
    const newFoedested: Foedested = {
      land: _newLand,
      region: _newRegion,
      by: _newBy
    }
    // this one does not have validation.
    standardLogger(loggingNamespace + '.foedested.add')
    onFoedestedChanged(newFoedested, 'add')
    onCancel()
  }

  const renderRow = (foedested: Foedested | null) => {
    const index = foedested === null ? -1 : 0
    const isNew = index < 0
    const displayForms = _editMode || isNew
    return (
      <RepeatableRow className={classNames({
        new: foedested === null
      })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <Row>
          <Column>
            {displayForms
              ? (
                <Input
                  error={validation[namespace + '-by']?.feilmelding}
                  id='by'
                  label={t('label:by')}
                  hideLabel={index >= 0}
                  namespace={namespace}
                  onChanged={(newBy: string) => onByChange(newBy, index)}
                  value={foedested?.by ?? ''}
                />
                )
              : (
                <BodyLong>{foedested?.by}</BodyLong>
                )}
          </Column>
          <Column>
            {displayForms
              ? (
                <Input
                  error={validation[namespace + '-region']?.feilmelding}
                  id='region'
                  label={t('label:region')}
                  hideLabel={index >= 0}
                  namespace={namespace}
                  onChanged={(newRegion: string) => onRegionChange(newRegion, index)}
                  value={foedested?.region ?? ''}
                />
                )
              : (
                <BodyLong>{foedested?.region}</BodyLong>
                )}
          </Column>
          <Column>
            {displayForms
              ? (
                <CountrySelect
                  data-testid={namespace + '-land'}
                  error={validation[namespace + '-land']?.feilmelding}
                  id={namespace + '-land'}
                  includeList={CountryFilter.STANDARD({})}
                  label={t('label:land')}
                  hideLabel={index >= 0}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => onLandChange(e.value, index)}
                  values={foedested?.land ?? ''}
                />
                )
              : (
                <FlexCenterDiv>
                  {foedested?.land && (
                    <>
                    <Flag size='S' country={foedested?.land!} />
                    <HorizontalSeparatorDiv />
                    </>
                  )}
                  {countryData.findByValue(foedested?.land)?.label ?? foedested?.land}
                </FlexCenterDiv>
                )}
          </Column>
        </Row>
        <PaddedRow size='0.5'>
          <AlignEndColumn>
            <AddRemovePanel2<Foedested>
              getId={(foedested): string => foedested.by + '-' + foedested.region + '-' + foedested.land}
              item={foedested}
              index={index}
              editing={_editMode}
              namespace={namespace}
              onRemove={onRemove}
              onAddNew={onAdd}
              onCancelNew={onCancel}
              onEditing={() => _setEditMode(true)}
              onCancelEditing={() => _setEditMode(false)}
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
              {renderRow(foedested!)}
            </>
          )
      }
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null)
        : (
          <>
            {emptyFoedsted && (
              <PaddedDiv>
                <Row>
                  <Column>
                    <Button
                      variant='tertiary'
                      onClick={() => _setSeeNewForm(true)}
                    >
                      <AddCircle />
                      {t('el:button-add-new-x', { x: t('label:fødested')?.toLowerCase() })}
                    </Button>
                  </Column>
                </Row>
              </PaddedDiv>
            )}
          </>
        )
      }
    </>
  )
}

export default FoedestedFC
