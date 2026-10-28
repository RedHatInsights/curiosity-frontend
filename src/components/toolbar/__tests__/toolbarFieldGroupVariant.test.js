import React from 'react';
import { ToolbarFieldGroupVariant, useToolbarFieldOptions, useOnSelect } from '../toolbarFieldGroupVariant';
import { store } from '../../../redux/store';

describe('ToolbarFieldGroupVariant Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useToolbarFieldOptions: () => [
        { title: 'lorem', value: 'lorem' },
        { title: 'ipsum', value: 'ipsum' },
        { title: 'dolor', value: 'dolor' },
        { title: 'sit', value: 'sit' }
      ]
    };
    const component = await shallowComponent(<ToolbarFieldGroupVariant {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should return a standalone component with toolbar', async () => {
    const props = {
      isStandalone: true,
      useToolbarFieldOptions: () => [
        { title: 'lorem', value: 'lorem' },
        { title: 'ipsum', value: 'ipsum' }
      ]
    };
    const component = await shallowComponent(<ToolbarFieldGroupVariant {...props} />);

    expect(component).toMatchSnapshot('standalone toolbar');
  });

  it('should return null, undefined, or empty if there are one or less options', async () => {
    const props = {
      useToolbarFieldOptions: () => [{ title: 'lorem', value: 'lorem' }]
    };
    const component = await shallowComponent(<ToolbarFieldGroupVariant {...props} />);

    expect(component).toMatchSnapshot('one or less');
  });

  it('should generate select options', async () => {
    const { result: toolbarFieldOptions } = await renderHook(() =>
      useToolbarFieldOptions({
        useRouteDetail: () => ({
          availableVariants: ['lorem', 'ipsum', 'dolor', 'sit', '']
        })
      })
    );

    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating through redux state with component', () => {
    const props = {
      useToolbarFieldOptions: () => [
        {
          selected: false,
          title: 't(curiosity-toolbar.label_variant, {"context":"ipsum"})',
          value: 'ipsum'
        },
        {
          selected: false,
          title: 't(curiosity-toolbar.label_variant, {"context":"lorem"})',
          value: 'lorem'
        }
      ]
    };

    const component = renderComponent(<ToolbarFieldGroupVariant {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.screen.getAllByRole('option').pop();
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating through redux state with hook', () => {
    const onSelect = useOnSelect({
      useNavigateVariant: () => jest.fn(),
      useProduct: () => ({ productGroup: 'loremIpsum' })
    });
    onSelect({
      value: 'dolor sit'
    });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });

  it('should reflect a selected variant in the browser url', () => {
    const mockNavigateVariant = jest.fn();

    const onSelect = useOnSelect({
      useNavigateVariant: () => mockNavigateVariant,
      useProduct: () => ({ productGroup: 'loremIpsum' })
    });
    onSelect({
      value: 'dolor sit'
    });

    expect(mockNavigateVariant).toHaveBeenCalledWith('dolor sit');
  });

  it('should ignore an empty selection', () => {
    const mockNavigateVariant = jest.fn();

    const onSelect = useOnSelect({
      useNavigateVariant: () => mockNavigateVariant,
      useProduct: () => ({ productGroup: 'loremIpsum' })
    });
    onSelect({});

    expect(mockNavigateVariant).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
