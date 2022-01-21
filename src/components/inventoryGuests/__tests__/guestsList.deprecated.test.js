import React from 'react';
import { shallow } from 'enzyme';
import { GuestsList } from '../guestsList.deprecated';

describe('GuestsList Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 0
    };

    const component = shallow(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle variations in data', () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 2,
      listData: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'amet', dolor: 'amet' }
      ]
    };

    const component = shallow(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('variable data');

    component.setProps({
      filterGuestsData: [{ id: 'lorem' }]
    });

    expect(component).toMatchSnapshot('filtered data');
  });

  it('should handle multiple display states', () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 1,
      pending: true
    };

    const component = shallow(<GuestsList {...props} />);
    expect(component).toMatchSnapshot('initial pending');

    component.setProps({
      pending: false,
      listData: [{ lorem: 'ipsum', dolor: 'sit' }]
    });

    expect(component).toMatchSnapshot('fulfilled');

    component.setState({ currentPage: 1 });

    component.setProps({
      pending: true,
      listData: []
    });

    expect(component).toMatchSnapshot('paged pending');
  });

  it('should handle updating paging state', () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 111,
      listData: [{ lorem: 'ipsum', dolor: 'sit' }]
    };

    const component = shallow(<GuestsList {...props} />);
    const componentInstance = component.instance();

    const initialState = component.state();

    componentInstance.onScroll({ target: { scrollHeight: 100, scrollTop: 20, clientHeight: 100 } });
    const scrollProgress = component.state();

    componentInstance.onScroll({ target: { scrollHeight: 100, scrollTop: 0, clientHeight: 100 } });
    const scrollComplete = component.state();

    expect({ initialState, scrollProgress, scrollComplete }).toMatchSnapshot('state');
  });
});
