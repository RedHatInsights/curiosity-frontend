import React from 'react';
import { mount, shallow } from 'enzyme';
import { Pagination } from '../pagination';

describe('Pagination Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      perPage: 20
    };

    const component = shallow(<Pagination {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle per-page limit, and page offset updates through props', () => {
    const props = {
      itemCount: 39,
      offset: 0,
      perPage: 20
    };

    const component = shallow(<Pagination {...props} />);
    const { offset: perPageOffset, page: perPagePage, perPage: perPagePerPage } = component.props();
    expect({
      perPageOffset,
      perPagePage,
      perPagePerPage
    }).toMatchSnapshot('per-page, limit');

    component.setProps({
      offset: 20
    });

    const { offset: pageOffset, page: pagePage, perPage: pagePerPage } = component.props();
    expect({
      pageOffset,
      pagePage,
      pagePerPage
    }).toMatchSnapshot('page, offset');
  });

  it('should handle events for paging and adjusting per-page limit', () => {
    const updatedOnPage = jest.fn();
    const updatedOnPerPage = jest.fn();

    const props = {
      itemCount: 39,
      offset: 0,
      perPage: 20,
      onPage: updatedOnPage,
      onPerPage: updatedOnPerPage
    };

    const component = mount(<Pagination {...props} />);

    component.find('button[data-action="next"]').simulate('click');
    expect(updatedOnPage).toHaveBeenCalledTimes(1);

    component.find('button.pf-c-options-menu__toggle-button').simulate('click');
    component.update();
    component.find('button[data-action="per-page-10"]').first().simulate('click');
    expect(updatedOnPerPage).toHaveBeenCalledTimes(1);
  });
});
