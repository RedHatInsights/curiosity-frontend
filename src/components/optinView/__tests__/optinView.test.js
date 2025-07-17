import React from 'react';
import { OptinView } from '../optinView';

describe('OptinView Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowComponent(<OptinView {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it.each([
    {
      description: '200 view',
      props: {
        useSession: () => ({})
      }
    },
    {
      description: '401 view',
      props: {
        useSession: () => ({ errorStatus: 401 })
      }
    },
    {
      description: '403 view',
      props: {
        useSession: () => ({ errorStatus: 403 })
      }
    },
    {
      description: '4XX view',
      props: {
        useSession: () => ({ errorStatus: 418 })
      }
    },
    {
      description: '500 view',
      props: {
        useSession: () => ({ errorStatus: 500 })
      }
    },
    {
      description: 'null or undefined status view',
      props: {
        useSession: () => ({ errorStatus: null })
      }
    },
    {
      description: 'pending view',
      props: {
        useSelectorsResponse: () => ({ pending: true }),
        useSession: () => ({})
      }
    },
    {
      description: 'error view',
      props: {
        useSelectorsResponse: () => ({ error: true }),
        useSession: () => ({})
      }
    },
    {
      description: 'fulfilled view',
      props: {
        useSelectorsResponse: () => ({ fulfilled: true }),
        useSession: () => ({})
      }
    }
  ])('should render an API state driven view: $description', async ({ props }) => {
    const component = await shallowComponent(<OptinView {...props} />);
    expect(component.find('form')).toMatchSnapshot();
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
