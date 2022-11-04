import cryptoMd5 from 'crypto-js/md5';
import { helpers } from '../helpers';

describe('Helpers', () => {
  it('should have specific functions', () => {
    expect(helpers).toMatchSnapshot('helpers');
  });

  /**
   * ToDo: review this test for writing against actual AggregateError
   * Right now we're purposefully using the fallback to this test.
   */
  it('should handle use aggregate error, or fallback', () => {
    const aggregateError = window.AggregateError;
    window.AggregateError = undefined;
    const aggregated = helpers.aggregatedError(
      [new Error('lorem ipsum'), new Error('dolor sit')],
      'testing aggregated'
    );
    expect({
      aggregated,
      ...aggregated
    }).toMatchSnapshot('emulated aggregate error');

    window.AggregateError = aggregateError;
  });

  it('should support generated IDs', () => {
    expect(helpers.generateId()).toBe('generatedid-');
    expect(helpers.generateId('lorem')).toBe('lorem-');
  });

  it('should support generated consistent hashes from objects', () => {
    expect(
      helpers.generateHash({ lorem: 'ipsum', dolor: ['sit', null, undefined, 1, () => 'hello world'] })
    ).toMatchSnapshot('hash');
    expect(
      helpers.generateHash(
        { lorem: 'ipsum', dolor: ['sit', null, undefined, 1, () => 'hello world'] },
        { method: cryptoMd5 }
      )
    ).toMatchSnapshot('method md5');
  });

  it('should determine a date', () => {
    expect(helpers.isDate(new Date('broken'))).toBe(true);
    expect(helpers.isDate(Date)).toBe(false);
    expect(helpers.isDate(1)).toBe(false);
    expect(helpers.isDate('lorem')).toBe(false);
  });

  it('should determine a promise', () => {
    expect(helpers.isPromise(Promise.resolve())).toBe(true);
    expect(helpers.isPromise(async () => {})).toBe(true);
    expect(helpers.isPromise(() => 'lorem')).toBe(false);
  });

  it('should apply a number display function', () => {
    expect(helpers.numberDisplay(null)).toBe(null);
    expect(helpers.numberDisplay(undefined)).toBe(undefined);
    expect(helpers.numberDisplay(NaN)).toBe(NaN);
    expect(helpers.numberDisplay(11)).toMatchSnapshot('number display function result');
  });

  it('should expose a window object', () => {
    helpers.browserExpose({ lorem: 'ipsum' });
    expect(window[helpers.UI_WINDOW_ID]).toMatchSnapshot('window object');

    helpers.browserExpose({ dolor: 'sit' }, { limit: true });
    expect(window[helpers.UI_WINDOW_ID]).toMatchSnapshot('limited window object');
  });
});
