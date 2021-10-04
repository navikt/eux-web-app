import { amplitudeLogger } from 'metrics/amplitude'

export const linkLogger = (event: any, values?: object) => {
  const target = event.target.tagName !== 'A' ? event.target.parentNode : event.target
  const name = `${target.dataset.amplitude}.link`
  const url = target?.href || 'undefined'
  const data = values || {}
  amplitudeLogger(name, {
    ...data,
    url: url
  })
}

export const buttonLogger = (event: any, values?: object) => {
  const name = `${event.target.dataset.amplitude}.button`
  const data = values || {}
  amplitudeLogger(name, data)
}

export const checkboxLogger = (event: any, values?: object) => {
  const name = `${event.target.dataset.amplitude}.checkbox`
  const data = values || {}
  if (event.target.checked) {
    amplitudeLogger(name, data)
  }
}

export const radioLogger = (event: any, values?: object) => {
  const name = `${event.target.dataset.amplitude}.radiobutton`
  const data = values || {}
  if (event.target.checked) {
    amplitudeLogger(name, data)
  }
}

export const standardLogger = (name: string, values?: object) => {
  const data = values || {}
  amplitudeLogger(name, data)
}

export const timeLogger = (name: string, loggedTime: Date) => {
  timeDiffLogger(name, (new Date().getTime() - loggedTime.getTime()))
}

export const timeDiffLogger = (name: string, diff: number) => {
  standardLogger(`${name}.time`, {
    seconds: Math.ceil(diff / 1000),
    minutes: Math.ceil(diff / 1000 / 60)
  })
}
