import {Alert, BodyLong, Loader, Search, HGrid, VStack, BodyShort} from '@navikt/ds-react'
import classNames from 'classnames'
import useLocalValidation from 'hooks/useLocalValidation'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateSEDQuery } from './validation'
import {validateFnrDnrNpid} from "../../../utils/fnrValidator";

const SEDQuery = ({ parentNamespace, error, querying, onQueryChanged, initialQuery, onQuerySubmit, frontpage=false}: any) => {
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
    const result = validateFnrDnrNpid(q)
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
      if (result.type === 'npid') {
        queryType = 'npid'
        message = t('label:valid-npid')
      }
      if(queryType ===  '') {
        queryType = result.type
        message = result.type
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
      onQuerySubmit(_saksnummerOrFnr.trim())
    }
  }

  return (
    <VStack gap="4">
      <HGrid
        columns="2"
        gap="4"
        className={classNames({ error: _validation.saksnummerOrFnr })}
        width="100%"
      >
        <VStack gap="2">
          <VStack gap="1">
            <BodyShort>
              {t('label:søk-rina-sak-for-å-sende-svarsed')}
            </BodyShort>
            <Search
              label={t('label:søk-rina-sak-for-å-sende-svarsed')}
              data-testid={namespace + '-saksnummerOrFnr'}
              id={namespace + '-saksnummerOrFnr'}
              onKeyPress={handleKeyPress}
              onChange={setSaksnummerOrFnr}
              required
              hideLabel={true}
              value={_saksnummerOrFnr}
              disabled={querying}
              placeholder={t('label:saksnummer-eller-fnr')}
            >
              <Search.Button onClick={onSaksnummerOrFnrClick}>
                {querying
                  ? t('message:loading-searching')
                  : t('el:button-search')}
                {querying && <Loader />}
              </Search.Button>
            </Search>

            {_validation[namespace + '-saksnummerOrFnr']?.feilmelding && (
              <span className='navds-error-message navds-error-message--medium'>
                {_validation[namespace + '-saksnummerOrFnr']?.feilmelding}
              </span>
            )}
          </VStack>
          <BodyLong>
            {_validMessage}
          </BodyLong>
        </VStack>
      </HGrid>
      {error && (
        <Alert variant='warning'>
          {error}
        </Alert>
      )}
    </VStack>
  )
}

export default SEDQuery
