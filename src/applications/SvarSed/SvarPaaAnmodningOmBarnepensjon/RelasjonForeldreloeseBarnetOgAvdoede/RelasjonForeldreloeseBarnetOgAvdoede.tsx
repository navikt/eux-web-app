import {State} from "../../../../declarations/reducers";
import {MainFormProps, MainFormSelector} from "../../MainForm";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../store";
import {useTranslation} from "react-i18next";
import {
  JaNei,
  Periode,
  RelasjonBarn,
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
import {validateRelasjon, validateRelasjoner, ValidationRelasjonProps} from "./validation";
import useUnmount from "../../../../hooks/useUnmount";
import performValidation from "../../../../utils/performValidation";
import {resetValidation, setValidation} from "../../../../actions/validation";
import PeriodeInput from "../../../../components/Forms/PeriodeInput";
import PeriodeText from "../../../../components/Forms/PeriodeText";
import {ValidationYtelseTilForeldreloeseProps} from "../validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const RelasjonForeldreloeseBarnetOgAvdoede: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const {validation} = useAppSelector(mapState)
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-relasjonen-mellom-den-foreldreloese-barnet-og-avdoede`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.barnet`
  const svarYtelseTilForeldreloeseTarget = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese`
  const CDM_VERSJON = options.cdmVersjon
  const svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V43 | SvarYtelseTilForeldreloese_V42 | undefined = _.get(replySed, svarYtelseTilForeldreloeseTarget)
  const relasjoner: Array<RelasjonBarn> | undefined = _.get(replySed, `${target}.relasjoner`)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_newRelasjon, _setNewRelasjon] = useState<RelasjonBarn | undefined>(undefined)
  const [_editRelasjon, _setEditRelasjon] = useState<RelasjonBarn | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationRelasjonProps>(validateRelasjon, namespace)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationYtelseTilForeldreloeseProps>(
      clonedValidation, namespace, validateRelasjoner, {
        svarYtelseTilForeldreloese,
        CDM_VERSJON
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const getId = (f: RelasjonBarn | null): string => f ? (f.typeRelasjon + '-' + (f.periode?.startdato ?? '')) : 'new'

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

  const onStartEdit = (r: RelasjonBarn, index: number) => {
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

  const onRemove = (removedRelasjon: RelasjonBarn) => {
    const newRelasjoner: Array<RelasjonBarn> = _.reject(relasjoner,
      (r: RelasjonBarn) => _.isEqual(removedRelasjon, r))
    dispatch(updateReplySed(target + '.relasjoner', newRelasjoner))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      relasjon: _newRelasjon,
      relasjoner
    })

    if (!!_newRelasjon && valid) {
      let newRelasjoner : Array<RelasjonBarn> | undefined = _.cloneDeep(relasjoner)
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
      } as RelasjonBarn)
      _resetValidation(namespace + '-periode')
      return
    }
    _setEditRelasjon({
      ..._editRelasjon,
      periode
    } as RelasjonBarn)
    dispatch(resetValidation(namespace + getIdx(index) + '-periode'))
  }


  const setRelasjonProperty = (property: string, value: string, id: string, index: number) => {
    if (index < 0) {
      _setNewRelasjon({
        ..._newRelasjon,
        [property]: value
      } as RelasjonBarn)
      _resetValidation(namespace + '-' + id)
      return
    }
    _setEditRelasjon({
      ..._editRelasjon,
      [property]: value
    } as RelasjonBarn)
    dispatch(resetValidation(namespace + getIdx(index) + '-' + id))
  }

  const renderRow = (relasjon: RelasjonBarn | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _relasjon = index < 0 ? _newRelasjon : (inEditMode ? _editRelasjon : relasjon)

    const addremovepanel = (
      <AlignEndColumn>
        <AddRemovePanel<RelasjonBarn>
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
                  <RadioPanelGroup
                    value={_relasjon?.relasjonTilPerson ?? ''}
                    data-no-border
                    data-testid={namespace + '-relasjon-til-person'}
                    error={_v[namespace + '-relasjon-til-person']?.feilmelding}
                    id={namespace + '-relasjon-til-person'}
                    legend={t('label:relasjon-med') + ' *'}
                    name={namespace + '-relasjon-til-person'}
                    onChange={(e:string) => setRelasjonProperty("relasjonTilPerson",  e,"relasjon-til-person", index)}
                  >
                    <VStack gap="2">
                      <HGrid gap="1" columns={2}>
                        <RadioPanel value='soeker'>
                          {t('el:option-relasjonbarn-relasjontilperson-soeker')}
                        </RadioPanel>
                        <RadioPanel value='ektefelle_partner'>
                          {t('el:option-relasjonbarn-relasjontilperson-ektefelle_partner')}
                        </RadioPanel>
                      </HGrid>
                      <HGrid gap="1" columns={2}>
                        <RadioPanel value='avdoed'>
                          {t('el:option-relasjonbarn-relasjontilperson-avdoed')}
                        </RadioPanel>
                        <RadioPanel value='annen_person'>
                          {t('el:option-relasjonbarn-relasjontilperson-annen_person')}
                        </RadioPanel>
                      </HGrid>
                    </VStack>
                  </RadioPanelGroup>
                  <Select
                    value={_relasjon?.typeRelasjon ?? ''}
                    id={namespace + '-type-relasjon'}
                    error={_v[namespace + '-type-relasjon']?.feilmelding}
                    label={t('label:type')}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRelasjonProperty("typeRelasjon",  e.target.value,"type-relasjon", index)}
                  >
                    <option value="" key="">{t('el:placeholder-select-default')}</option>
                    <option value="daglig_omsorg" key="daglig_omsorg">{t('el:option-relasjonbarn-type-daglig_omsorg')}</option>
                    <option value="født_i_ekteskap" key="født_i_ekteskap">{t('el:option-relasjonbarn-type-født_i_ekteskap')}</option>
                    <option value="eget_barn" key="eget_barn">{t('el:option-relasjonbarn-type-eget_barn')}</option>
                    <option value="adoptert_barn" key="adoptert_barn">{t('el:option-relasjonbarn-type-adoptert_barn')}</option>
                    <option value="født_utenfor_ekteskap" key="født_utenfor_ekteskap">{t('el:option-relasjonbarn-type-født_utenfor_ekteskap')}</option>
                    <option value="barn_av_ektefelle" key="barn_av_ektefelle">{t('el:option-relasjonbarn-type-barn_av_ektefelle')}</option>
                    <option value="barnebarn_bror_søster_nevø_niese" key="barnebarn_bror_søster_nevø_niese">{t('el:option-relasjonbarn-type-barnebarn_bror_søster_nevø_niese')}</option>
                    <option value="fosterbarn" key="fosterbarn">{t('el:option-relasjonbarn-type-fosterbarn')}</option>
                  </Select>
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
                  <RadioPanelGroup
                    value={_relasjon?.fellesOmsorg ?? ''}
                    data-no-border
                    data-testid={namespace + '-felles-omsorg'}
                    error={_v[namespace + '-felles-omsorg']?.feilmelding}
                    id={namespace + '-felles-omsorg'}
                    legend={t('label:delt-foreldreansvar')}
                    name={namespace + '-felles-omsorg'}
                    onChange={(e:string) => setRelasjonProperty("fellesOmsorg",  e as JaNei,"felles-omsorg", index)}
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
                  <RadioPanelGroup
                    value={_relasjon?.borISammeHusstandSomKravstiller ?? ''}
                    data-no-border
                    data-testid={namespace + '-bor-i-samme-hustand-som-kravstiller'}
                    error={_v[namespace + '-bor-i-samme-hustand-som-kravstiller']?.feilmelding}
                    id={namespace + '-bor-i-samme-hustand-som-kravstiller'}
                    legend={t('label:bor-i-samme-hustand-som-søkeren')}
                    name={namespace + '-bor-i-samme-hustand-som-kravstiller'}
                    onChange={(e:string) => setRelasjonProperty("borISammeHusstandSomKravstiller",  e as JaNei,"bor-i-samme-hustand-som-kravstiller", index)}
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
                  <RadioPanelGroup
                    value={_relasjon?.borISammeHusstandSomEktefelle ?? ''}
                    data-no-border
                    data-testid={namespace + '-bor-i-samme-hustand-som-ektefelle'}
                    error={_v[namespace + '-bor-i-samme-hustand-som-ektefelle']?.feilmelding}
                    id={namespace + '-bor-i-samme-hustand-som-ektefelle'}
                    legend={t('label:bor-i-samme-hustand-som-ektefelle-partneren')}
                    name={namespace + '-bor-i-samme-hustand-som-ektefelle'}
                    onChange={(e:string) => setRelasjonProperty("borISammeHusstandSomEktefelle",  e as JaNei,"bor-i-samme-hustand-som-ektefelle", index)}
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
                  <RadioPanelGroup
                    value={_relasjon?.borISammeHusstandSomAnnenPerson ?? ''}
                    data-no-border
                    data-testid={namespace + '-bor-i-samme-hustand-som-annen-person'}
                    error={_v[namespace + '-bor-i-samme-hustand-som-annen-person']?.feilmelding}
                    id={namespace + '-bor-i-samme-hustand-som-annen-person'}
                    legend={t('label:bor-i-samme-hustand-som-den-andre-aktuelle-personen')}
                    name={namespace + '-bor-i-samme-hustand-som-annen-person'}
                    onChange={(e:string) => setRelasjonProperty("borISammeHusstandSomAnnenPerson",  e as JaNei,"bor-i-samme-hustand-som-annen-person", index)}
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
                  <RadioPanelGroup
                    value={_relasjon?.borPaaInstitusjon ?? ''}
                    data-no-border
                    data-testid={namespace + '-bor-paa-institusjon'}
                    error={_v[namespace + '-bor-paa-institusjon']?.feilmelding}
                    id={namespace + '-bor-paa-institusjon'}
                    legend={t('label:bor-barnet-paa-institusjon')}
                    name={namespace + '-bor-paa-institusjon'}
                    onChange={(e:string) => setRelasjonProperty("borPaaInstitusjon",  e as JaNei,"bor-paa-institusjon", index)}
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
                <div><Label>{t('label:relasjon-med')}:</Label> {t('el:option-relasjonbarn-relasjontilperson-' + _relasjon?.relasjonTilPerson)}</div>
                <div><Label>{t('label:type')}:</Label> {t('el:option-relasjonbarn-type-' + _relasjon?.typeRelasjon)}</div>
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
                <div><Label>{t('label:delt-foreldreansvar')}: </Label>{_relasjon?.fellesOmsorg?.toUpperCase()}</div>
                <div><Label>{t('label:bor-i-samme-hustand-som-søkeren')}: </Label>{_relasjon?.borISammeHusstandSomKravstiller?.toUpperCase()}</div>
                <div><Label>{t('label:bor-i-samme-hustand-som-ektefelle-partneren')}: </Label>{_relasjon?.borISammeHusstandSomEktefelle?.toUpperCase()}</div>
                <div><Label>{t('label:bor-i-samme-hustand-som-den-andre-aktuelle-personen')}: </Label>{_relasjon?.borISammeHusstandSomAnnenPerson?.toUpperCase()}</div>
                <div><Label>{t('label:bor-barnet-paa-institusjon')}: </Label>{_relasjon?.borPaaInstitusjon?.toUpperCase()}</div>
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
                error={validation[namespace + '-barnet-relasjoner']?.feilmelding}
                namespace={namespace}
                id='barnet-relasjoner'
                label={t('label:relasjon-mellom-den-foreldreloese-barnet-og-avdoede')}
                hideLabel={true}
                onChanged={(v) => setYtelseTilForeldreloeseProperty('relasjontilavdoedefritekst', v)}
                value={(svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.barnet?.relasjontilavdoedefritekst ?? ''}
              />
            </TextAreaDiv>
          </Box>
        }
        {(parseFloat(CDM_VERSJON) >= 4.3) &&
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
                      {t('el:button-add-new-x', {x: "Relasjon mellom den foreldreløse/barnet og den avdøde".toLowerCase()})}
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

export default RelasjonForeldreloeseBarnetOgAvdoede
