import { describe, it, expect } from 'vitest';
import { calculateWuXingScore, calculateDayMasterStrength, generateWuXingAnalysis } from './index';
import type { FourPillars } from '../../types';

describe('WuXing Analysis', () => {
  const mockFourPillars: FourPillars = {
    year: { stem: '甲', branch: '子' },
    month: { stem: '丙', branch: '寅' },
    day: { stem: '戊', branch: '辰' },
    hour: { stem: '庚', branch: '申' },
  };

  it('should calculate WuXing scores', () => {
    const score = calculateWuXingScore(mockFourPillars);
    expect(score.total).toBeGreaterThan(0);
    expect(score.wood).toBeGreaterThan(0);
    expect(score.fire).toBeGreaterThan(0);
    expect(score.earth).toBeGreaterThan(0);
    expect(score.metal).toBeGreaterThan(0);
    expect(score.water).toBeGreaterThan(0);
  });

  it('should calculate day master strength', () => {
    const score = calculateWuXingScore(mockFourPillars);
    const strength = calculateDayMasterStrength(mockFourPillars, score);
    expect(strength.status).toBeDefined();
    expect(strength.score).toBeGreaterThan(0);
  });

  it('should generate analysis', () => {
    const score = calculateWuXingScore(mockFourPillars);
    const strength = calculateDayMasterStrength(mockFourPillars, score);
    const analysis = generateWuXingAnalysis(mockFourPillars, score, strength);
    expect(analysis.overview).toContain('日主');
    expect(Object.keys(analysis.details)).toHaveLength(5);
    expect(analysis.favorableElements).toBeDefined();
    expect(analysis.unfavorableElements).toBeDefined();
  });
});
