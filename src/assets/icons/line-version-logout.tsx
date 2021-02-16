import React from 'react'

const LogoutIcon: React.FC<any> = (props: any) => (
  <svg
    contentScriptType='text/ecmascript' zoomAndPan='magnify'
    contentStyleType='text/css'
    id='Outline_Version' enableBackground='new 0 0 24 24' version='1.1'
    width='24px' preserveAspectRatio='xMidYMid meet'
    viewBox='0 0 24 24' height='24px' xmlns='http://www.w3.org/2000/svg'
    x='0px' y='0px' {...props}
  >
    <g fill={props.color || '#3e3832'}>
      <path d='M13.5,18c-0.276,0-0.5,0.224-0.5,0.5V22H1V2h12v3.5C13,5.776,13.224,6,13.5,6S14,5.776,14,5.5v-4C14,1.224,13.776,1,13.5,1   h-13C0.224,1,0,1.224,0,1.5v21C0,22.776,0.224,23,0.5,23h13c0.276,0,0.5-0.224,0.5-0.5v-4C14,18.224,13.776,18,13.5,18z' />
      <path d='M23.961,12.691c0.051-0.122,0.051-0.26,0-0.382c-0.025-0.062-0.062-0.117-0.108-0.163l-5-5 c-0.195-0.195-0.512-0.195-0.707,0s-0.195,0.512,0,0.707L22.293,12H5.5C5.224,12,5,12.224,5,12.5S5.224,13,5.5,13h16.793   l-4.146,4.146c-0.195,0.195-0.195,0.512,0,0.707C18.244,17.951,18.372,18,18.5,18s0.256-0.049,0.354-0.146l5-5   C23.899,12.808,23.936,12.752,23.961,12.691z' />
    </g>
  </svg>
)

export default LogoutIcon
