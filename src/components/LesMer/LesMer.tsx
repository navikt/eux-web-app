import React, { useState } from 'react'
import { Link } from '@navikt/ds-react'
import styled from 'styled-components'

interface LesMerProps {
  visibleText: string
  invisibleText: string
  lessText: string
  moreText: string
}

const LesMerDiv = styled.div`
 .lenke {
    display: inline-flex !important;
 }
`

const LesMer: React.FC<LesMerProps> = ({ visibleText, invisibleText, moreText, lessText }: LesMerProps): JSX.Element => {
  const [_showInvisible, setShowInvisible] = useState<boolean>(false)
  return (
    <LesMerDiv>
      {_showInvisible ? invisibleText : visibleText}
      &nbsp;
      <Link
        href='#' onClick={(e: any) => {
          e.stopPropagation()
          e.preventDefault()
          setShowInvisible(!_showInvisible)
        }}
      >
        {_showInvisible ? lessText : moreText}
      </Link>
    </LesMerDiv>
  )
}

export default LesMer
