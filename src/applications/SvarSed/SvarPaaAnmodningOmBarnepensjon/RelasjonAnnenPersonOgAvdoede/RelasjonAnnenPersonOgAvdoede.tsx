import {State} from "../../../../declarations/reducers";
import {MainFormProps, MainFormSelector} from "../../MainForm";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../store";
import {useTranslation} from "react-i18next";
import {
  JaNei,
  Periode,
  RelasjonAnnenPerson,
  SvarYtelseTilForeldreloese_V42,
  SvarYtelseTilForeldreloese_V43
} from "../../../../declarations/sed";
import _ from "lodash";
import {BodyLong, Box, Button, Heading, VStack, HGrid, Select, Label} from "@navikt/ds-react";
import {RepeatableBox, TextAreaDiv} from "../../../../components/StyledComponents";
import TextArea from "../../../../components/Forms/TextArea";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import {getIdx} from "../../../../utils/namespace";
import {Validation} from "../../../../declarations/types";
import {AlignEndColumn, RadioPanel, RadioPanelGroup, AlignStartRow} from "@navikt/hoykontrast";
import AddRemovePanel from "../../../../components/AddRemovePanel/AddRemovePanel";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "../../../../utils/validation";
import useLocalValidation from "../../../../hooks/useLocalValidation";
import {validateRelasjon, validateRelasjoner, ValidationRelasjonerProps, ValidationRelasjonProps} from "./validation";
import useUnmount from "../../../../hooks/useUnmount";
import performValidation from "../../../../utils/performValidation";
import {resetValidation, setValidation} from "../../../../actions/validation";
import PeriodeInput from "../../../../components/Forms/PeriodeInput";
import {Options} from "../../../../declarations/app";
import Input from "../../../../components/Forms/Input";
import DateField, {toDateFormat} from "../../../../components/DateField/DateField";
import PeriodeText from "../../../../components/Forms/PeriodeText";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const RelasjonAnnenPersonOgAvdoede: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const {validation} = useAppSelector(mapState)
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-relasjonannenpersonogavdoede`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.annenPerson`
  const svarYtelseTilForeldreloeseTarget = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const CDM_VERSJON = options.cdmVersjon
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V43 | SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, svarYtelseTilForeldreloeseTarget)
  const relasjoner: Array<RelasjonAnnenPerson> | undefined = _.get(replySed, `${target}.relasjoner`)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_newRelasjon, _setNewRelasjon] = useState<RelasjonAnnenPerson | undefined>(undefined)
  const [_editRelasjon, _setEditRelasjon] = useState<RelasjonAnnenPerson | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationRelasjonProps>(validateRelasjon, namespace)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationRelasjonerProps>(
      clonedValidation, namespace, validateRelasjoner, {
        relasjoner
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const getId = (f: RelasjonAnnenPerson | null): string => f ? (f.familierelasjonstype + '-' + (f.periode?.startdato ?? '')) : 'new'

  const setYtelseTilForeldreloeseProperty = (property: string, value: string) => {
    dispatch(updateReplySed(`${target}.${property}`, value.trim()))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditRelasjon(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewRelasjon(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (r: RelasjonAnnenPerson, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditRelasjon(r)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationRelasjonProps>(
      clonedValidation, namespace, validateRelasjon, {
        relasjon: _editRelasjon,
        relasjoner,
        index: _editIndex
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}.relasjoner[${_editIndex}]`, _editRelasjon!))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedRelasjon: RelasjonAnnenPerson) => {
    const newRelasjoner: Array<RelasjonAnnenPerson> = _.reject(relasjoner,
      (r: RelasjonAnnenPerson) => _.isEqual(removedRelasjon, r))
    dispatch(updateReplySed(target + '.relasjoner', newRelasjoner))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      relasjon: _newRelasjon,
      relasjoner
    })

    if (!!_newRelasjon && valid) {
      let newRelasjoner : Array<RelasjonAnnenPerson> | undefined = _.cloneDeep(relasjoner)
      if (_.isNil(newRelasjoner)) {
        newRelasjoner = []
      }
      newRelasjoner.push(_newRelasjon)
      dispatch(updateReplySed(target + '.relasjoner', newRelasjoner))
      onCloseNew()
    }
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewRelasjon({
        ..._newRelasjon,
        periode
      } as RelasjonAnnenPerson)
      _resetValidation(namespace + '-periode')
      return
    }
    _setEditRelasjon({
      ..._editRelasjon,
      periode
    } as RelasjonAnnenPerson)
    dispatch(resetValidation(namespace + getIdx(index) + '-periode'))
  }


  const setRelasjonProperty = (property: string, value: string, id: string, index: number) => {
    if (index < 0) {
      _setNewRelasjon({
        ..._newRelasjon,
        [property]: value
      } as RelasjonAnnenPerson)
      _resetValidation(namespace + '-' + id)
      return
    }
    _setEditRelasjon({
      ..._editRelasjon,
      [property]: value
    } as RelasjonAnnenPerson)
    dispatch(resetValidation(namespace + getIdx(index) + '-' + id))
  }

  const familieRelasjonTypeOptions: Options = [
    { label: t('el:option-familierelasjon-gift'), value: 'gift' },
    { label: t('el:option-familierelasjon-samboer'), value: 'samboer' },
    { label: t('el:option-familierelasjon-registrert_partnerskap'), value: 'registrert_partnerskap' },
    { label: t('el:option-familierelasjon-skilt'), value: 'skilt' },
    { label: t('el:option-familierelasjon-aleneforelder'), value: 'aleneforelder' },
    { label: t('el:option-familierelasjon-annet'), value: 'annet' }
  ]

  const renderRow = (relasjon: RelasjonAnnenPerson | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _relasjon = index < 0 ? _newRelasjon : (inEditMode ? _editRelasjon : relasjon)

    const addremovepanel = (
      <AlignEndColumn>
        <AddRemovePanel<RelasjonAnnenPerson>
          item={relasjon}
          marginTop={false}
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
    )
    return (
      <RepeatableBox
        padding="4"
        background="surface-subtle"
        borderWidth="1"
        borderColor="border-subtle"
        id={'repeatablerow-' + _namespace}
        key={getId(relasjon)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        {inEditMode
          ? (

                <VStack gap="4">
                  <Select
                    value={_relasjon?.familierelasjonstype ?? ''}
                    id={namespace + '-type-relasjon'}
                    error={_v[namespace + '-type-relasjon']?.feilmelding}
                    label={t('label:type')}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRelasjonProperty("familierelasjonstype",  e.target.value,"type-relasjon", index)}
                  >
                    <option value="" key="">{t('el:placeholder-select-default')}</option>
                    {familieRelasjonTypeOptions.map((o) => {
                      return <option value={o.value} key={o.value}>{o.label}</option>
                    })}
                  </Select>
                  {_relasjon?.familierelasjonstype === 'annet' &&
                    <Input
                      error={_v[_namespace + '-annen-relasjon']?.feilmelding}
                      namespace={_namespace}
                      id='annen-relasjon'
                      label={t('label:annen-relasjon')}
                      onChanged={(value: string) => setRelasjonProperty("annenRelasjon", value, "annen-relasjon", index)}
                      value={_relasjon?.annenRelasjon}
                    />
                  }
                  <AlignStartRow>
                    <PeriodeInput
                      namespace={_namespace + '-periode'}
                      error={{
                        startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                        sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                      }}
                      hideLabel={false}
                      requiredStartDato={false}
                      setPeriode={(p: Periode) => setPeriode(p, index)}
                      value={_relasjon?.periode}
                    />
                  </AlignStartRow>
                  <Input
                    error={_v[_namespace + '-annen-person']?.feilmelding}
                    namespace={_namespace}
                    id='annen-person'
                    label={t('label:annen-person')}
                    onChanged={(value: string) => setRelasjonProperty("annenPerson", value, "-annen-person", index)}
                    value={_relasjon?.annenPerson}
                  />
                  <Input
                    error={_v[_namespace + '-annen-person-navn']?.feilmelding}
                    namespace={_namespace}
                    id='annen-person-navn'
                    label={t('label:person-navn')}
                    onChanged={(value: string) => setRelasjonProperty("personnavn", value, "annen-person-navn", index)}
                    value={_relasjon?.personnavn}
                  />
                  <DateField
                    namespace={_namespace}
                    error={_v[_namespace + '-relasjonsstartdato']?.feilmelding}
                    id='relasjonsstartdato'
                    label={t('label:startdato')}
                    onChanged={(value: string) => setRelasjonProperty("relasjonsstartdato", value, "relasjonsstartdato", index)}
                    dateValue={_relasjon?.relasjonsstartdato}
                  />
                  <RadioPanelGroup
                    value={_relasjon?.varKravstillerISammeHushold ?? ''}
                    data-no-border
                    data-testid={namespace + '-var-kravstiller-i-samme-hushold'}
                    error={_v[namespace + '-var-kravstiller-i-samme-hushold']?.feilmelding}
                    id={namespace + '-var-kravstiller-i-samme-hushold'}
                    legend={t('label:var-kravstiller-i-samme-hushold')}
                    name={namespace + '-var-kravstiller-i-samme-hushold'}
                    onChange={(e:string) => setRelasjonProperty("varKravstillerISammeHushold",  e as JaNei,"var-kravstiller-i-samme-hushold", index)}
                  >
                    <HGrid gap="1" columns={2}>
                      <RadioPanel value='ja'>
                        Ja
                      </RadioPanel>
                      <RadioPanel value='nei'>
                        Nei
                      </RadioPanel>
                    </HGrid>
                  </RadioPanelGroup>

                  {addremovepanel}
                </VStack>

          )
          : (
            <>
              <VStack gap="1">
                <div><Label>{t('label:type')}:</Label> {t('el:option-familierelasjon-' + _relasjon?.familierelasjonstype)}</div>
                {_relasjon?.familierelasjonstype === 'annet' && <div><Label>{t('label:annen-relasjon')}:</Label> {_relasjon?.annenRelasjon}</div>}
                <div>
                  <Label>Periode</Label>
                  <PeriodeText
                    error={{
                      startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                      sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                    }}
                    namespace={_namespace + '-periode'}
                    periode={_relasjon?.periode}
                  />
                </div>
                <div><Label>{t('label:annen-person')}:</Label> {_relasjon?.annenPerson}</div>
                <div><Label>{t('label:person-navn')}:</Label> {_relasjon?.personnavn}</div>
                <div><Label>{t('label:startdato')}:</Label> {toDateFormat(_relasjon?.relasjonsstartdato, 'DD.MM.YYYY')}</div>
                <div><Label>{t('label:var-kravstiller-i-samme-hushold')}:</Label> {_relasjon?.varKravstillerISammeHushold?.toUpperCase()}</div>
                {addremovepanel}
              </VStack>

            </>
          )
        }
      </RepeatableBox>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        {CDM_VERSJON === "4.2" &&
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <TextAreaDiv>
              <TextArea
                error={validation[namespace + '-annen-person-relasjoner']?.feilmelding}
                namespace={namespace}
                id='annen-person-relasjoner'
                label={t('label:relasjon-mellom-annen-person-og-avdoede')}
                hideLabel={true}
                onChanged={(v) => setYtelseTilForeldreloeseProperty('relasjontilavdoedefritekst', v)}
                value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.annenPerson?.relasjontilavdoedefritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {CDM_VERSJON === "4.3" &&
          <>
            {_.isEmpty(relasjoner) && !_newForm
              ? (
                  <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
                    <BodyLong>
                      {t('message:warning-no-relasjon')}
                    </BodyLong>
                  </Box>
                  )
              : (
                  relasjoner?.map(renderRow)
                )
            }

            {_newForm
              ? (
                  renderRow(null, -1)
                )
              : (
                  <Box padding="0">
                    <Button
                      variant='tertiary'
                      onClick={() => _setNewForm(true)}
                      icon={<PlusCircleIcon/>}
                    >
                      {t('el:button-add-new-x', {x: "Relasjon mellom annen person og den avdøde".toLowerCase()})}
                    </Button>
                  </Box>
                )
            }
          </>
        }
      </VStack>
    </Box>
  )
}

export default RelasjonAnnenPersonOgAvdoede
