import {
  AlignStartRow,
  Column,
  Container,
  Content,
  FullWidthDiv,
  Margin,
  PileDiv,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import * as localStorageActions from 'actions/localStorage'
import { querySaks } from 'actions/svarsed'
import SEDPanel from 'applications/SvarSed/Sak/SEDPanel'
import Sakshandlinger from 'applications/SvarSed/Sakshandlinger/Sakshandlinger'
import Saksopplysninger from 'applications/SvarSed/Saksopplysninger/Saksopplysninger'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Sak, Sed } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

export const PileStartDiv = styled(PileDiv)`
 align-items: flex-start;
`
export const MyRadioPanelGroup = styled(RadioPanelGroup)`
  .navds-radio-buttons {
    margin-top: 0rem !important;
  }
`

interface SEDViewSelector {
  entries: Array<LocalStorageEntry<PDU1 | ReplySed>> | null | undefined
  currentSak: Sak | undefined
}

const mapState = (state: State) => ({
  currentSak: state.svarsed.currentSak,
  entries: state.localStorage.svarsed.entries
})

const SEDView = (): JSX.Element => {
  const sedMap: any = []
  const tempChildrenSed: Array<Sed> = []
  const grandChildrenSedMap: any = {}
  const tempSedMap: any = {}
  const dispatch = useAppDispatch()
  const { sakId } = useParams()
  const { currentSak, entries }: SEDViewSelector = useAppSelector(mapState)
  const deletedSak = useAppSelector(state => state.svarsed.deletedSak)
  const navigate = useNavigate()


  const [loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)

  let seds: Array<Sed> | undefined
  if (currentSak) {
    seds = _.cloneDeep(currentSak.sedListe)
  }

  useEffect(() => {
    if (deletedSak) {
      navigate({
        pathname: '/'
      })
    }
  }, [deletedSak])

  useEffect(() => {
    if (!loadingSavedItems && entries === undefined) {
      setLoadingSavedItems(true)
      dispatch(localStorageActions.loadEntries('svarsed'))
    }
  }, [entries, loadingSavedItems])

  useEffect(() => {
    // reload, so it reflects changes made in potential SED save/send
    if (currentSak) {
      const params: URLSearchParams = new URLSearchParams(window.location.search)
      if (params.get('refresh') === 'true') {
        dispatch(querySaks(currentSak?.sakId, 'refresh'))
      }
    } else {
      if (sakId) {
        dispatch(querySaks(sakId, 'refresh'))
      }
    }
  }, [])

  seds?.forEach((connectedSed: Sed) => {
    // if you have a sedIdParent (not F002), let's put it under Children
    if (connectedSed.sedIdParent && connectedSed.sedType !== 'F002') {
      tempChildrenSed.push(connectedSed)
    } else {
      tempSedMap[connectedSed.sedId] = connectedSed
    }
  })

  // Now, let's put all children SED
  tempChildrenSed.forEach((connectedSed: Sed) => {
    if (connectedSed.sedIdParent) {
      if(tempSedMap[connectedSed.sedIdParent]){
        if (Object.prototype.hasOwnProperty.call(tempSedMap, connectedSed.sedIdParent) &&
           Object.prototype.hasOwnProperty.call(tempSedMap[connectedSed.sedIdParent], 'children')) {
          tempSedMap[connectedSed.sedIdParent].children.push(connectedSed)
        } else {
          tempSedMap[connectedSed.sedIdParent].children = [connectedSed]
        }
      } else {
        // Handle grand children
        if (Object.prototype.hasOwnProperty.call(grandChildrenSedMap, connectedSed.sedIdParent)) {
          grandChildrenSedMap[connectedSed.sedIdParent].push(connectedSed)
        } else {
          grandChildrenSedMap[connectedSed.sedIdParent] = [connectedSed]
        }
      }
    }
  })

  Object.keys(tempSedMap).forEach(key => sedMap.push(tempSedMap[key]))

  if (_.isUndefined(currentSak)) {
    return <WaitingPanel />
  }

  return (
    <Container>
      <Margin />
      <Content style={{ flex: 6 }}>
        <PileStartDiv>
          <FullWidthDiv>
            <AlignStartRow>
              <Column>
                <Sakshandlinger sak={currentSak} />
              </Column>
              <Column flex='2'>
                <MyRadioPanelGroup>
                  {sedMap
                    .sort((a: Sed, b: Sed) => (
                      moment(a.sistEndretDato, 'YYYY-MM-DD').isAfter(moment(b.sistEndretDato, 'YYYY-MM-DD')) ? -1 : 1
                    )).map((sed: Sed) => (
                      <div key={'sed-' + sed.sedId}>
                        <SEDPanel
                          currentSak={currentSak}
                          sed={sed}
                        />
                        <VerticalSeparatorDiv />
                        {sed.children?.sort((a: Sed, b: Sed) => (
                          moment(a.sistEndretDato, 'YYYY-MM-DD').isAfter(moment(b.sistEndretDato, 'YYYY-MM-DD')) ? -1 : 1
                        )).map((sed2: Sed) => (
                          <div key={'sed-' + sed2.sedId} style={{ marginLeft: '4rem' }}>
                            <SEDPanel
                              currentSak={currentSak}
                              sed={sed2}
                            />
                            <VerticalSeparatorDiv />
                            {grandChildrenSedMap[sed2.sedId]?.sort((a: Sed, b: Sed) => (
                              moment(a.sistEndretDato, 'YYYY-MM-DD').isAfter(moment(b.sistEndretDato, 'YYYY-MM-DD')) ? -1 : 1
                            )).map((sed3: Sed) => (
                              <div key={'sed-' + sed3.sedId} style={{ marginLeft: '4rem' }}>
                                <SEDPanel
                                  currentSak={currentSak}
                                  sed={sed3}
                                />
                                <VerticalSeparatorDiv />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                </MyRadioPanelGroup>
              </Column>
            </AlignStartRow>
          </FullWidthDiv>
        </PileStartDiv>
      </Content>
      <Content style={{ flex: 2 }}>
        <Saksopplysninger sak={currentSak} />
      </Content>
      <Margin />
    </Container>
  )
}

export default SEDView
