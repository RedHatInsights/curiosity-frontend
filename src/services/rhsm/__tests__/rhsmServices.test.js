import moxios from 'moxios';
import { rhsmServices } from '../rhsmServices';
import * as serviceConfig from '../../common/serviceConfig';

describe('RhsmServices', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(tally|capacity|instances|subscriptions|version).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return specific properties', () => {
    expect(rhsmServices).toMatchSnapshot('specific properties');
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings or missing globals, see "before" above, or the "setupTests" config
   */
  it.each([...Object.keys(rhsmServices).map(method => ({ method: rhsmServices[method], description: method }))])(
    'should call the serviceCall wrapper with consistent configuration, $description method',
    async ({ method }) => {
      const mockAxiosServiceCall = jest.spyOn(serviceConfig, 'axiosServiceCall');
      await method();
      expect(mockAxiosServiceCall.mock.calls).toMatchSnapshot();
    }
  );
});
