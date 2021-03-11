import React from 'react'

const HelpIcon: React.FC<any> = (props: any) => (
  <svg
    focusable='false'
    height={props.height || '20'}
    width={props.width || '20'}
    viewBox='-2 -2 22 22'
    {...props}
  >
    <path
      d='M9.1 0C4.1 0 0 4.1 0 9.1s4.1 9.1 9.1 9.1 9.1-4.1 9.1-9.1S14.1 0 9.1 0zm0 17.2C4.6 17.2 1 13.6 1 9.1S4.6 1 9.1 1s8.1 3.6 8.1 8.1-3.6 8.1-8.1 8.1z'
    />
    <circle cx='9.1' cy='13.8' r='.9' />
    <path
      d='M9.1 11.5c-.3 0-.5-.2-.5-.5V8.6c0-.3.2-.5.5-.5 1 0 1.9-.8 1.9-1.9s-.8-1.9-1.9-1.9c-1 0-1.9.8-1.9 1.9 0 .3-.2.5-.5.5s-.5-.2-.5-.4c0-1.6 1.3-2.9 2.9-2.9S12 4.7 12 6.3c0 1.4-1 2.6-2.4 2.8V11c0 .3-.2.5-.5.5z'
    />
  </svg>
)

export default HelpIcon
