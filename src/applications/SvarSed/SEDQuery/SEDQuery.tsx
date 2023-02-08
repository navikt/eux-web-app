import { Alert, BodyLong, Loader, Search } from '@navikt/ds-react'
import validator from '@navikt/fnrvalidator'
import { AlignStartRow, Column, HorizontalSeparatorDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import classNames from 'classnames'
import { AlertstripeDiv } from 'components/StyledComponents'
import useLocalValidation from 'hooks/useLocalValidation'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateSEDQuery } from './validation'
import styled from 'styled-components'

const StyledSpan = styled.span`
  display: inline-block;
`

const SEDQuery = ({ parentNamespace, error, querying, onQueryChanged, initialQuery, onQuerySubmit, frontpage=false }: any) => {
  const { t } = useTranslation()
  const namespace = parentNamespace + '-sedquery'

  const [_validation, _resetValidation, _performValidation] = useLocalValidation(validateSEDQuery, namespace)
  const [_validMessage, _setValidMessage] = useState<string>('')
  const [_saksnummerOrFnr, _setSaksnummerOrFnr] = useState<string>(initialQuery ?? '')
  const [_queryType, _setQueryType] = useState<string | undefined>(undefined)

  const setSaksnummerOrFnr = (query: string) => {
    const q: string = query.trim()
    _resetValidation(namespace + '-saksnummerOrFnr')
    _setSaksnummerOrFnr(q)
    let message = ''; let queryType = ''
    const result = validator.idnr(q)
    if (result.status !== 'valid') {
      if (q.match(/^\d+$/)) {
        queryType = 'saksnummer'
        message = t('label:saksnummer')
      }
    } else {
      if (result.type === 'fnr') {
        queryType = 'fnr'
        message = t('label:valid-fnr')
      }
      if (result.type === 'dnr') {
        queryType = 'dnr'
        message = t('label:valid-dnr')
      }
    }
    _setQueryType(queryType)
    _setValidMessage(message)
    onQueryChanged(queryType)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaksnummerOrFnrClick()
    }
  }

  const onSaksnummerOrFnrClick = () => {
    const valid: boolean = _performValidation({
      saksnummerOrFnr: _saksnummerOrFnr.trim()
    })
    if (valid) {
      standardLogger('svarsed.selection.query', {
        type: _queryType
      })
      onQuerySubmit(_saksnummerOrFnr.trim())
    }
  }

  return (
    <>
      <AlignStartRow
        className={classNames({ error: _validation.saksnummerOrFnr })}
      >
        <HorizontalSeparatorDiv size='0.2' />
        <Column flex='2'>
          <PileDiv>
            <Search
              label={t('label:saksnummer-eller-fnr')}
              data-testid={namespace + '-saksnummerOrFnr'}
              id={namespace + '-saksnummerOrFnr'}
              onKeyPress={handleKeyPress}
              onChange={setSaksnummerOrFnr}
              required
              hideLabel={false}
              value={_saksnummerOrFnr}
              disabled={querying}
            >
              <Search.Button onClick={onSaksnummerOrFnrClick}>
                {querying
                  ? t('message:loading-searching')
                  : t('el:button-search')}
                {querying && <Loader />}
              </Search.Button>
            </Search>

            {_validation[namespace + '-saksnummerOrFnr']?.feilmelding && (
              <>
                <VerticalSeparatorDiv size='0.5' />
                <span className='navds-error-message navds-error-message--medium'>
                  {_validation[namespace + '-saksnummerOrFnr']?.feilmelding}
                </span>
              </>
            )}
          </PileDiv>
          <PileDiv>
            <BodyLong>
              <StyledSpan>{_validMessage}</StyledSpan>
            </BodyLong>
          </PileDiv>
        </Column>
      </AlignStartRow>
      {!frontpage && <VerticalSeparatorDiv size='3' />}
      {error && (
        <>
          <AlertstripeDiv>
            <Alert variant='warning'>
              {error}
            </Alert>
          </AlertstripeDiv>
          <VerticalSeparatorDiv />
        </>
      )}
    </>
  )
}

export default SEDQuery
