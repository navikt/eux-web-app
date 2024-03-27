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
  PaddedHorizontallyDiv, PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import CountryData, { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import {
  validateStatsborgerskap,
  validateStatsborgerskaper,
  ValidationStatsborgerskaperProps,
  ValidationStatsborgerskapProps
} from './validation'
import Modal from "../../../../components/Modal/Modal";
import {setStatsborgerskapModalShown} from "../../../../actions/pdu1";

export interface StatsborgerskapSelector {
  statsborgerskapModalShown: boolean
}
const mapStatsborgerskapState = (state: State): StatsborgerskapSelector => ({
  statsborgerskapModalShown: state.pdu1.statsborgerskapModalShown
})

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Statsborgerskap: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const { statsborgerskapModalShown } = useAppSelector(mapStatsborgerskapState)

  const dispatch = useAppDispatch()
  const target = 'bruker.statsborgerskap'
  const statsborgerskaper: Array<string> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-statsborgerskap`
  const countryData = CountryData.getCountryInstance('nb')

  const [_newStatsborgerskap, _setNewStatsborgerskap] = useState<string | undefined>(undefined)
  const [_editStatsborgerskap, _setEditStatsborgerskap] = useState<string | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationStatsborgerskapProps>(validateStatsborgerskap, namespace)

  const [_showStatborgerskapMissingModal, _setShowStatsborgerskapMissingModal] = useState<boolean>(false)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    const filteredStatsborgerskaper = statsborgerskaper ? statsborgerskaper?.filter(s => s) : statsborgerskaper // Remove NULL values from array
    performValidation<ValidationStatsborgerskaperProps>(
      clonedvalidation, namespace, validateStatsborgerskaper, {
        statsborgerskaper: filteredStatsborgerskaper
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  useEffect(() => {
    if(!statsborgerskapModalShown && statsborgerskaper?.some((s) => s === null)){
      _setShowStatsborgerskapMissingModal(true)
    }
  }, [])

  const onModalClose = () => {
    dispatch(setStatsborgerskapModalShown())
    _setShowStatsborgerskapMissingModal(false)
  }

  const onStatsborgerskapSelected = (land: string, index: number) => {
    if (index < 0) {
      _setNewStatsborgerskap(land.trim())
      _resetValidation(namespace + '-statsborgerskap')
      return
    }
    _setEditStatsborgerskap(land.trim())
    if (validation[namespace + getIdx(index) + '-statsborgerskap']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-statsborgerskap'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditStatsborgerskap(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewStatsborgerskap(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (s: string, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditStatsborgerskap(s)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationStatsborgerskapProps>(
      clonedvalidation, namespace, validateStatsborgerskap, {
        statsborgerskap: _editStatsborgerskap,
        statsborgerskaper,
        index: _editIndex
      })
    if (!!_editStatsborgerskap && !hasErrors) {
      let newStatsborgerskaper: Array<string> = _.cloneDeep(statsborgerskaper) as Array<string>
      newStatsborgerskaper[_editIndex!] = _editStatsborgerskap
      newStatsborgerskaper = newStatsborgerskaper.sort()
      dispatch(updateReplySed(target, newStatsborgerskaper))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removed: string) => {
    const newStatsborgerskaper: Array<string> = _.reject(statsborgerskaper,
      (s: string) => removed === s)
    dispatch(updateReplySed(target, newStatsborgerskaper))
    standardLogger('pdu1.editor.statsborgerskap.remove')
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      statsborgerskap: _newStatsborgerskap,
      statsborgerskaper
    })
    if (!!_newStatsborgerskap && valid) {
      let newStatsborgerskaper: Array<string> | undefined = _.cloneDeep(statsborgerskaper)
      if (_.isNil(newStatsborgerskaper)) {
        newStatsborgerskaper = []
      }
      newStatsborgerskaper.push(_newStatsborgerskap)
      newStatsborgerskaper = newStatsborgerskaper.sort()
      dispatch(updateReplySed(target, newStatsborgerskaper))
      standardLogger('pdu1.editor.statsborgerskap.add')
      onCloseNew()
    }
  }

  const renderRow = (statsborgerskap: string | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _statsborgerskap = index < 0 ? _newStatsborgerskap : (inEditMode ? _editStatsborgerskap : statsborgerskap)

    if(!inEditMode && !statsborgerskap) return
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={statsborgerskap}
        className={classNames({
          new: index < 0,
          error: _v[_namespace + '-land']
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {inEditMode
              ? (
                <CountrySelect
                  ariaLabel={t('label:statsborgerskap')}
                  closeMenuOnSelect
                  data-testid={_namespace + '-statsborgerskap'}
                  error={_v[_namespace + '-statsborgerskap']?.feilmelding}
                  flagWave
                  key={_namespace + '-statsborgerskap' + _statsborgerskap}
                  id={_namespace + '-statsborgerskap'}
                  label={t('label:land')}
                  hideLabel={false}
                  includeList={CountryFilter.STANDARD({ useUK: false })}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => onStatsborgerskapSelected(e.value, index)}
                  required
                  values={_statsborgerskap}
                />
                )
              : (
                  <FormText
                    id={_namespace + '-statsborgerskap'}
                    error={_v[_namespace + '-statsborgerskap']?.feilmelding}
                  >
                    <FlexCenterDiv>
                      <Flag size='S' country={_statsborgerskap ?? ''} />
                      <HorizontalSeparatorDiv />
                      {countryData.findByValue(_statsborgerskap)?.label ?? _statsborgerskap}
                    </FlexCenterDiv>
                  </FormText>
                )}
          </Column>
          <AlignEndColumn>
            <AddRemovePanel<string>
              item={statsborgerskap}
              marginTop={inEditMode}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemove}
              onAddNew={onAddNew}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={() => onCloseEdit(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <>
      <Modal
        open={_showStatborgerskapMissingModal}
        modal={{
          modalTitle: t("message:warning-unknown-statsborgerskap"),
          modalContent: (
            <div style={{ textAlign: 'center', display: 'block', minWidth: '400px', minHeight: '100px' }}>
              <PileDiv>
                <BodyLong>{t("message:warning-unknown-statsborgerskap-text1")}</BodyLong>
                <BodyLong>{t("message:warning-unknown-statsborgerskap-text2")}</BodyLong>
              </PileDiv>
            </div>
          ),
          modalButtons: [{
            main: true,
            text: 'OK',
            onClick: () => onModalClose()
          }]
        }}
        onModalClose={() => onModalClose()}
      />
      <VerticalSeparatorDiv />
      {_.isEmpty(statsborgerskaper)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr>
              <BodyLong>
                {t('message:warning-no-satsborgerskap')}
              </BodyLong>
            </SpacedHr>
            <VerticalSeparatorDiv />
          </PaddedHorizontallyDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('label:land')}
                  </Label>
                </Column>
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {statsborgerskaper?.map(renderRow)}
          </>
          )}
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x2', { x: t('label:statsborgerskap').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Statsborgerskap
