import { formatRelativeTime } from '../utils/time';

describe('formatRelativeTime', () => {
  const now = new Date();

  it('returns "just now" for times within 60 seconds', () => {
    const recent = new Date(now.getTime() - 30_000).toISOString();
    expect(formatRelativeTime(recent)).toBe('just now');
  });

  it('returns minutes for times < 1 hour ago', () => {
    const fiveMinAgo = new Date(now.getTime() - 5 * 60_000).toISOString();
    expect(formatRelativeTime(fiveMinAgo)).toBe('5m');
  });

  it('returns HH:mm for times earlier today', () => {
    const twoHoursAgo = new Date(now.getTime() - 2.5 * 3600_000).toISOString();
    const result = formatRelativeTime(twoHoursAgo);
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});
