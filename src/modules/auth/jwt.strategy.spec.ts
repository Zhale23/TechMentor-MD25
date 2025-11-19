import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('validate should normalize payload', async () => {
    const strategy = new JwtStrategy();
    const payload = { sub: 5, email: 'x@y.com', role: 'aprendiz' };
    const result = await strategy.validate(payload as any);
    expect(result).toEqual({ id: 5, email: 'x@y.com', role: 'aprendiz' });
  });
});
