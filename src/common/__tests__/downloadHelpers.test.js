import { downloadHelpers } from '../downloadHelpers';

/**
 * ToDo: evaluate the clearing of timers with pending and real
 * It's unclear if this is actively helping/necessary...
 */
describe('DownloadHelpers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should have specific functions', () => {
    expect(downloadHelpers).toMatchSnapshot('helpers');
  });

  it('should throw an error attempting to download data', done => {
    downloadHelpers.downloadData().catch(error => {
      expect(error).toMatchSnapshot('download error');
      done();
    });
  });

  it('should throw an error attempting to access a log', done => {
    downloadHelpers.debugLog().catch(error => {
      expect(error).toMatchSnapshot('access error');
      done();
    });
  });

  it('should attempt to download data', done => {
    window.URL = {
      createObjectURL: jest.fn(),
      revokeObjectURL: jest.fn()
    };

    downloadHelpers.downloadData().then(value => {
      expect(value).toMatchSnapshot('data download');
      done();
    });

    jest.runAllTimers();

    window.URL = {
      createObjectURL: undefined,
      revokeObjectURL: undefined
    };
  });
});
