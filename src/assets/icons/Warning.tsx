import React from 'react'

const Warning: React.FC<any> = (props: any) => (
  <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 16a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm1-11v9h-2V5h2z'
      fill='#FFA733'
    />
  </svg>
)

export default Warning