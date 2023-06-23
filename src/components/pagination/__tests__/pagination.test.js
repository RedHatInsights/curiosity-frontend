import React from 'react';
import { Pagination } from '../pagination';

describe('Pagination Component', () => {
  it('should render a basic component', async () => {
    const props = {
      perPage: 20
    };

    const component = await shallowComponent(<Pagination {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle per-page limit, and page offset updates through props', async () => {
    const props = {
      itemCount: 39,
      offset: 0,
      perPage: 20
    };

    const component = await shallowComponent(<Pagination {...props} />);
    const { offset: perPageOffset, page: perPagePage, perPage: perPagePerPage } = component.render().props;
    expect({
      perPageOffset,
      perPagePage,
      perPagePerPage
    }).toMatchSnapshot('per-page, limit');

    const componentOffset = await component.setProps({
      offset: 20
    });

    const { offset: pageOffset, page: pagePage, perPage: pagePerPage } = componentOffset.render().props;
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

    const component = renderComponent(<Pagination {...props} />);
    const inputNext = component.find('button[data-action="next"]');
    component.fireEvent.click(inputNext);

    expect(updatedOnPage).toHaveBeenCalledTimes(1);

    const inputToggle = component.find('button.pf-c-options-menu__toggle-button');
    component.fireEvent.click(inputToggle);

    const inputPerPage = component.find('button[data-action="per-page-10"]');
    component.fireEvent.click(inputPerPage);

    expect(updatedOnPerPage).toHaveBeenCalledTimes(1);
  });
});
