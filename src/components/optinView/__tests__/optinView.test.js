import React from 'react';
import { OptinView } from '../optinView';

describe('OptinView Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowComponent(<OptinView {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render an API state driven view', async () => {
    const props = {};

    const component = await shallowComponent(<OptinView {...props} />);
    expect(component).toMatchSnapshot('initial view');

    const component200 = await component.setProps({
      useSession: () => ({})
    });
    expect(component200.find('form')).toMatchSnapshot('200 view');

    const component401 = await component.setProps({
      useSession: () => ({ errorStatus: 401 })
    });
    expect(component401.find('form')).toMatchSnapshot('401 view');

    const component403 = await component.setProps({
      useSession: () => ({ errorStatus: 403 })
    });
    expect(component403.find('form')).toMatchSnapshot('403 view');

    const component418 = await component.setProps({
      useSession: () => ({ errorStatus: 418 })
    });
    expect(component418.find('form')).toMatchSnapshot('4XX view');

    const component500 = await component.setProps({
      useSession: () => ({ errorStatus: 500 })
    });
    expect(component500.find('form')).toMatchSnapshot('500 view');

    const componentNullUndefined = await component.setProps({
      useSession: () => ({ errorStatus: null })
    });
    expect(componentNullUndefined.find('form')).toMatchSnapshot('null or undefined status view');

    const componentPending = await component.setProps({
      useSelectorsResponse: () => ({ pending: true }),
      useSession: () => ({})
    });
    expect(componentPending.find('form')).toMatchSnapshot('pending view');

    const componentError = await component.setProps({
      useSelectorsResponse: () => ({ error: true })
    });
    expect(componentError.find('form')).toMatchSnapshot('error view');

    const componentFulfilled = await component.setProps({
      useSelectorsResponse: () => ({ fulfilled: true })
    });
    expect(componentFulfilled.find('form')).toMatchSnapshot('fulfilled view');
  });

  it('should submit an opt-in form', () => {
    const mockDispatch = jest.fn();
    const props = {
      useDispatch: () => mockDispatch,
      useSession: () => ({ errorStatus: 403 })
    };

    const component = renderComponent(<OptinView {...props} />);
    const input = component.find('form button');
    component.fireEvent.click(input);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
  });
});
