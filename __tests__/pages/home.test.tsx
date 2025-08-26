import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '../../app/home/page'

test('HomePage', () => {
  render(<HomePage />)
  expect(screen.getByText('ホーム画面')).toBeDefined()
  expect(screen.getByText('編成')).toBeDefined()
  expect(screen.getByText('ダンジョン')).toBeDefined()
  expect(screen.getByText('編成画面へ')).toBeDefined()
  expect(screen.getByText('ダンジョン選択へ')).toBeDefined()
})