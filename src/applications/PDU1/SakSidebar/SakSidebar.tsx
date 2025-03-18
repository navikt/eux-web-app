import { State } from 'declarations/reducers'
import {PersonInfoPDL} from 'declarations/types'
import React, { useCallback } from 'react'
import { useAppSelector } from 'store'
import PersonPanel from "../../OpprettSak/PersonPanel/PersonPanel";

interface SakSidebarSelector {
  person: PersonInfoPDL |null |undefined
}

const mapState = (state: State):SakSidebarSelector => ({
  person: state.person.person
})

const SakSidebar = () => {
  const { person }: SakSidebarSelector = useAppSelector(mapState)
  const isPersonValid = useCallback((person: PersonInfoPDL) =>
    person?.fnr !== undefined,
  []
  )

  if (person && isPersonValid(person)) {
    return (
      <PersonPanel
        className='neutral'
        person={person}
      />
    )
  }

  return <div />
}

export default SakSidebar
