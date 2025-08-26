import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import StartPage from '../app/page'

test('StartPage', () => {
  render(<StartPage />)
  expect(screen.getByText('Browser RPG')).toBeDefined()
  expect(screen.getByText('冒険の旅が始まります')).toBeDefined()
  expect(screen.getByText('ゲーム開始')).toBeDefined()
})

test('StartPage navigation link', () => {
  render(<StartPage />)
  const gameStartLink = screen.getByRole('link', { name: 'ゲーム開始' })
  expect(gameStartLink).toBeDefined()
  expect(gameStartLink.getAttribute('href')).toBe('/home')
})