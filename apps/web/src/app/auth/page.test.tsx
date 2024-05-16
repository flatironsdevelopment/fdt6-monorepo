import { render, screen } from '@testing-library/react'
import Home from './page'
import '@testing-library/jest-dom'

describe('Home', () => {
  it('renders', () => {
    render(<Home />)

    const heading = screen.getByText('Register an account')

    expect(heading).toBeInTheDocument()
  })
})
