import styled from 'styled-components'

export const Margin = styled.div`
  flex: 1;
`
export const Content = styled.div`
  flex: 10;
  margin: 1.5rem;
`
export const Container = styled.div`
  display: flex;
  margin: 0px;
`
export const VerticalSeparatorDiv = styled.div`
  margin-bottom: ${(props: any) => props['data-size'] || 1}rem;
`
export const HorizontalSeparatorDiv = styled.div`
  margin-left: ${(props: any) => props['data-size'] || 1}rem;
`
export const Row = styled.div`
  display: flex;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`
export const Column = styled.div`
  flex: 1;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`
