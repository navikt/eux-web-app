import React from 'react'
export default (props: any) => (
  <svg focusable='false' viewBox='0 0 24 24' {...props}>
    <path d='M3.516 3.5h16v20h-16zm4-3h8v3h-8zm-6.5 3h22M7.516 7v12m4-12v12m4-12v12' stroke={props.color || '#000'} strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' fill='none' />
  </svg>
)
