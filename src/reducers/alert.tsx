import { ExternalLink } from '@navikt/ds-icons'
import * as types from 'constants/actionTypes'
import i18n from 'i18n'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { FlexDiv, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import { Link } from '@navikt/ds-react'
import React from 'react'
import { Action } from 'redux'

export interface AlertState {
  stripeStatus: string | undefined
  stripeMessage: JSX.Element | string | undefined
  bannerStatus: string | undefined
  bannerMessage: string | undefined
  uuid: string | undefined
  error: any | undefined
  type: string | undefined
}

export const initialAlertState: AlertState = {
  stripeStatus: undefined,
  stripeMessage: undefined,
  bannerStatus: undefined,
  bannerMessage: undefined,
  uuid: undefined,
  error: undefined,
  type: undefined
}

const alertReducer = (state: AlertState = initialAlertState, action: Action | ActionWithPayload = { type: '' }): AlertState => {
  let stripeMessage: JSX.Element | string | undefined
  let bannerMessage: string | undefined
  let stripeStatus: string
  let bannerStatus: string

  if (
    action.type === types.ALERT_CLIENT_CLEAR ||
    action.type === types.APP_CLEAN_DATA ||
    action.type === types.SAK_PERSON_RELATERT_RESET ||
    action.type === types.SAK_PERSON_GET_REQUEST ||
    action.type === types.SAK_PERSON_RELATERT_SEARCH_REQUEST ||
    action.type === types.SAK_ABROADPERSON_ADD_SUCCESS ||
    action.type === types.SAK_TPSPERSON_ADD_SUCCESS) {
    return initialAlertState
  }

  /**
   * All ERROR MESSAGES go here, to banner alert
   */
  if (_.endsWith(action.type, '/ERROR')) {
    bannerStatus = 'error'
    switch (action.type) {
      case types.SERVER_INTERNAL_ERROR:
        bannerMessage = i18n.t('message:error-serverInternalError')
        break

      case types.SERVER_UNAUTHORIZED_ERROR:
        bannerMessage = i18n.t('message:error-serverAuthenticationError')
        break

      default:
        bannerMessage = (action as ActionWithPayload).payload.message || i18n.t('message:error-serverInternalError')
        break
    }

    return {
      ...state,
      type: action.type,
      bannerMessage: bannerMessage,
      bannerStatus: bannerStatus,
      error: (action as ActionWithPayload).payload
        ? _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  /**
   * All FAILURE MESSAGES go here, to stripe alert
   */
  if (_.endsWith(action.type, '/FAILURE')) {
    stripeStatus = 'error'
    switch (action.type) {
      case types.SAK_PERSON_GET_FAILURE:
        stripeMessage = i18n.t('message:error-person-notFound')
        break

      case types.SAK_PERSON_RELATERT_SEARCH_FAILURE:
        stripeMessage = i18n.t('message:error-personRelated-notFound')
        break

      case types.SAK_ABROADPERSON_ADD_FAILURE:
        stripeMessage = i18n.t('message:error-abroadperson-exists')
        break

      case types.SAK_TPSPERSON_ADD_FAILURE:
        stripeMessage = i18n.t('message:error-tpsperson-exists')
        break

      case types.SVARSED_SED_CREATE_FAILURE:
        if ((action as ActionWithPayload).status === 409) {
          const url = (action as ActionWithPayload).context.sakUrl
          stripeMessage = (
            <FlexDiv>
              <span>{i18n.t('message:error-svarsed-failure-duplicate')}</span>
              <HorizontalSeparatorDiv size='0.5' />
              <Link target='_blank' href={url} rel='noreferrer'>
                <span>
                  {i18n.t('message:error-svarsed-failure-duplicate-2')}
                </span>
                <HorizontalSeparatorDiv size='0.35' />
                <ExternalLink />
              </Link>
            </FlexDiv>
          )
        } else {
          stripeMessage = i18n.t('message:error-svarsed-failure')
        }
        break

      default:
        if ((action as ActionWithPayload).payload && (action as ActionWithPayload).payload.error) {
          stripeMessage = _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        } else {
          stripeMessage = i18n.t('ui:error')
        }
        break
    }

    return {
      ...state,
      type: action.type,
      stripeStatus: stripeMessage ? stripeStatus : undefined,
      stripeMessage: stripeMessage,
      error: (action as ActionWithPayload).payload
        ? _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  /**
   * All OK MESSAGES for banner go here
   */
  let dealWithBanner = false
  if (action.type === types.APP_CLIPBOARD_COPY) {
    bannerMessage = i18n.t('message:success-clipboard-copy')
    dealWithBanner = true
  }

  if (action.type === types.LOCALSTORAGE_ENTRY_SAVE) {
    bannerMessage = i18n.t('message:success-localstorage-save')
    dealWithBanner = true
  }

  if (dealWithBanner) {
    return {
      ...state,
      type: action.type,
      bannerStatus: 'success',
      bannerMessage: bannerMessage,
      uuid: undefined,
      error: undefined
    }
  }

  /**
   * All OK MESSAGES for stripe go here
   */

  stripeStatus = 'success'

  if (action.type === types.SVARSED_REPLYSED_SET) {
    stripeMessage = undefined
  }

  if (!stripeMessage) {
    return state
  }

  return {
    ...state,
    type: action.type,
    stripeStatus: stripeStatus,
    stripeMessage: stripeMessage,
    uuid: undefined,
    error: undefined
  }
}

export default alertReducer
