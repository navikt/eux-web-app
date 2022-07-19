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
import { querySaks } from 'actions/svarsed'
import SEDPanel from 'applications/SvarSed/Sak/SEDPanel'
import Sakshandlinger from 'applications/SvarSed/Sakshandlinger/Sakshandlinger'
import Saksopplysninger from 'applications/SvarSed/Saksopplysninger/Saksopplysninger'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Sak, Sed } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'

export const PileStartDiv = styled(PileDiv)`
 align-items: flex-start;
`
export const MyRadioPanelGroup = styled(RadioPanelGroup)`
  .navds-radio-buttons {
    margin-top: 0rem !important;
  }
`

const SEDView = (): JSX.Element => {
  const sedMap: any = []
  const tempChildrenSed: Array<Sed> = []
  const tempSedMap: any = {}
  const dispatch = useAppDispatch()
  const { sakId } = useParams()
  const currentSak: Sak | undefined = useAppSelector(state => state.svarsed.currentSak)

  let seds: Array<Sed> | undefined
  if (currentSak) {
    seds = _.cloneDeep(currentSak.sedListe)
  }

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
      if (Object.prototype.hasOwnProperty.call(tempSedMap, connectedSed.sedIdParent) &&
         Object.prototype.hasOwnProperty.call(tempSedMap[connectedSed.sedIdParent], 'children')) {
        tempSedMap[connectedSed.sedIdParent].children.push(connectedSed)
      } else {
        tempSedMap[connectedSed.sedIdParent].children = [connectedSed]
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
                    )).map((connectedSed: Sed) => (
                      <div key={'sed-' + connectedSed.sedId}>
                        <SEDPanel
                          currentSak={currentSak}
                          connectedSed={connectedSed}
                        />
                        <VerticalSeparatorDiv />
                        {connectedSed.children?.sort((a: Sed, b: Sed) => (
                          moment(a.sistEndretDato, 'YYYY-MM-DD').isAfter(moment(b.sistEndretDato, 'YYYY-MM-DD')) ? -1 : 1
                        )).map((connectedSed2: Sed) => (
                          <div key={'sed-' + connectedSed2.sedId} style={{ marginLeft: '4rem' }}>
                            <SEDPanel
                              currentSak={currentSak}
                              connectedSed={connectedSed2}
                            />
                            <VerticalSeparatorDiv />
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
