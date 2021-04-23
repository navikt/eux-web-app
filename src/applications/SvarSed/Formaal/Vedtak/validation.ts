import { PeriodeMedVedtak, Validation, Vedtak } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export const validateVedtakPeriode = (
  v: Validation,
  p: PeriodeMedVedtak,
  index: number,
  t: TFunction
): void => {
  v['vedtak-perioder' + (index < 0 ? '' : '[' + index + ']') + '-periode-startdato'] = p.periode.startdato
    ? undefined
    : {
      feilmelding: t('message:validation-noDate'),
      skjemaelementId: 'c-vedtak-perioder' + (index < 0 ? '' : '[' + index + ']') + '-periode-startdato-date'
    } as FeiloppsummeringFeil

  if (p.periode.startdato) {
    v['vedtak-perioder' + (index < 0 ? '' : '[' + index + ']') + '-periode-startdato'] = p.periode.startdato.match(/\d{2}\.\d{2}\.\d{4}/)
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDate'),
        skjemaelementId: 'c-vedtak-perioder' + (index < 0 ? '' : '[' + index + ']') + '-periode-startdato-date'
      } as FeiloppsummeringFeil
  }

  if (p.periode.sluttdato) {
    v['vedtak-perioder' + (index < 0 ? '' : '[' + index + ']') + '-periode-sluttdato'] = p.periode.sluttdato.match(/\d{2}\.\d{2}\.\d{4}/)
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDate'),
        skjemaelementId: 'c-vedtak-perioder' + (index < 0 ? '' : '[' + index + ']') + '-periode-sluttdato-date'
      } as FeiloppsummeringFeil
  }

  v['vedtak-perioder' + (index < 0 ? '' : '[' + index + ']') + '-vedtak'] = p.vedtak
    ? undefined
    : {
      feilmelding: t('message:validation-noVedtakChoice'),
      skjemaelementId: 'c-vedtak-perioder' + (index < 0 ? '' : '[' + index + ']') + '-vedtak-text'
    } as FeiloppsummeringFeil
}

export const validateVedtakPerioder = (
  v: Validation,
  perioder: Array<PeriodeMedVedtak>,
  t: TFunction
): void => {
  perioder?.forEach((periode: PeriodeMedVedtak, index: number) => {
    validateVedtakPeriode(v, periode, index, t)
  })
}

export const validateVedtak = (
  v: Validation,
  vedtak: Vedtak,
  t: TFunction
): void => {
  v['vedtak-allkids'] = vedtak.allkids
    ? undefined
    : {
      feilmelding: t('message:validation-noVedtakChoice'),
      skjemaelementId: 'c-vedtak-allkids-text'
    } as FeiloppsummeringFeil

  v['vedtak-periode-startdato'] = vedtak.periode.startdato
    ? undefined
    : {
      feilmelding: t('message:validation-noDate'),
      skjemaelementId: 'c-vedtak-periode-startdato-date'
    } as FeiloppsummeringFeil

  if (vedtak.periode.startdato) {
    v['vedtak-periode-startdato'] = vedtak.periode.startdato.match(/\d{2}\.\d{2}\.\d{4}/)
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDate'),
        skjemaelementId: 'c-vedtak-periode-startdato-date'
      } as FeiloppsummeringFeil
  }

  if (vedtak.periode.sluttdato) {
    v['vedtak-periode-sluttdato'] = vedtak.periode.sluttdato.match(/\d{2}\.\d{2}\.\d{4}/)
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDate'),
        skjemaelementId: 'c-vedtak-periode-sluttdato-date'
      } as FeiloppsummeringFeil
  }

  v['vedtak-type'] = vedtak.type
    ? undefined
    : {
      feilmelding: t('message:validation-noVedtakType'),
      skjemaelementId: 'c-vedtak-type-text'
    } as FeiloppsummeringFeil

  validateVedtakPerioder(v, vedtak.perioder, t)
}
