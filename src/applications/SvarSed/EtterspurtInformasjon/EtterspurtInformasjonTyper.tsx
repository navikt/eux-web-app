import React, {useEffect, useState} from "react";
import {useAppDispatch} from "../../../store";
import {ComboboxOption} from "@navikt/ds-react/cjs/form/combobox/types";
import {EtterspurtInformasjon} from "declarations/sed";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateReplySedPayload} from "../../../declarations/types";
import {UNSAFE_Combobox} from "@navikt/ds-react";

interface EtterspurtInformasjonTyperProps {
  target: string
  initialOptions: ComboboxOption[]
  etterspurtInformasjon: EtterspurtInformasjon
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

const EtterspurtInformasjonTyper: React.FC<EtterspurtInformasjonTyperProps> = ({
  target,
  initialOptions,
  etterspurtInformasjon,
  updateReplySed
}: EtterspurtInformasjonTyperProps): JSX.Element => {
  const dispatch = useAppDispatch()

  let initialSelectedOptions:ComboboxOption[] = []
  const [selectedOptions, setSelectedOptions] = useState<ComboboxOption[]>(initialSelectedOptions);

  useEffect(() => {
    etterspurtInformasjon?.etterspurtInformasjonType?.typer?.forEach((type) => {
      // @ts-ignore
      const option: ComboboxOption = initialOptions?.find((o) => o.value === type)
      initialSelectedOptions.push(option)
    })
  }, [])

  useEffect(() => {
    const etterspurtInformasjonTypeArray: Array<string> = []
    selectedOptions.forEach((o) => {
      etterspurtInformasjonTypeArray.push(o.value)
    })
    dispatch(updateReplySed(`${target}.etterspurtInformasjonType.typer`, etterspurtInformasjonTypeArray))
  }, [selectedOptions])


  const onToggleSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      // @ts-ignore
      setSelectedOptions([...selectedOptions, initialOptions?.find((o) => o.value === option)]);
    } else {
      setSelectedOptions(selectedOptions.filter((o) => o?.value !== option));
    }
  };

  return(
    <UNSAFE_Combobox
      label="Etterspurt informasjon"
      isMultiSelect
      onToggleSelected={onToggleSelected}
      selectedOptions={selectedOptions}
      options={initialOptions}
    />
  )
}

export default EtterspurtInformasjonTyper
