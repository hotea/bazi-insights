import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

/**
 * 项目初始化验证测试
 * 确认 Vitest 和 fast-check 测试框架正常工作
 */
describe('项目初始化验证', () => {
  it('Vitest 正常运行', () => {
    expect(1 + 1).toBe(2)
  })

  it('fast-check 属性测试正常运行', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        // 验证加法交换律
        expect(a + b).toBe(b + a)
      }),
      { numRuns: 100 }
    )
  })
})
