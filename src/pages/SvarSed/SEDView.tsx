import {
  AlignStartRow,
  Column,
  FullWidthDiv,
  PileDiv,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import SEDPanel from 'applications/SvarSed/Sak/SEDPanel'
import Sakshandlinger from 'applications/SvarSed/Sakshandlinger/Sakshandlinger'
import { Sak, Sed } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

export const PileStartDiv = styled(PileDiv)`
 align-items: flex-start;
`
export const MyRadioPanelGroup = styled(RadioPanelGroup)`
  .navds-radio-buttons {
    margin-top: 0rem !important;
  }
`

export interface SvarSedProps {
  sak: Sak
}

const SEDView: React.FC<SvarSedProps> = ({
  sak
}: SvarSedProps): JSX.Element => {
  const sedMap: any = []
  const tempChildrenSed: Array<Sed> = []
  const tempSedMap: any = {}
  const seds: Array<Sed> | undefined = _.cloneDeep(sak.sedListe)

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

  return (
    <PileStartDiv>
      <FullWidthDiv>
        <AlignStartRow>
          <Column>
            <Sakshandlinger
              sak={sak}
            />
          </Column>
          <Column flex='2'>
            <MyRadioPanelGroup>
              {sedMap
                .sort((a: Sed, b: Sed) => (
                  moment(a.sistEndretDato, 'YYYY-MM-DD').isAfter(moment(b.sistEndretDato, 'YYYY-MM-DD')) ? -1 : 1
                )).map((connectedSed: Sed) => (
                  <div key={'sed-' + connectedSed.sedId}>
                    <SEDPanel
                      currentSak={sak}
                      connectedSed={connectedSed}
                    />
                    <VerticalSeparatorDiv />
                    {connectedSed.children?.sort((a: Sed, b: Sed) => (
                      moment(a.sistEndretDato, 'YYYY-MM-DD').isAfter(moment(b.sistEndretDato, 'YYYY-MM-DD')) ? -1 : 1
                    )).map((connectedSed2: Sed) => (
                      <div key={'sed-' + connectedSed2.sedId} style={{ marginLeft: '4rem' }}>
                        <SEDPanel
                          currentSak={sak}
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
  )
}

export default SEDView
