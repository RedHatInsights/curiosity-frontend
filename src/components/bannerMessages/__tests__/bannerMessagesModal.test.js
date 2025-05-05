import React from 'react';
import { BannerMessagesModal } from '../bannerMessagesModal';

describe('BannerMessagesModal Component', () => {
  it('should render a basic component', async () => {
    const props = {
      modalTitle: 'Lorem ipsum'
    };

    const component = await shallowComponent(<BannerMessagesModal {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle opening a modal', () => {
    const props = {
      modalTitle: 'Lorem ipsum'
    };

    const component = renderComponent(
      <div>
        <div className="curiosity" />
        <BannerMessagesModal {...props}>Click me</BannerMessagesModal>
      </div>
    );
    component.fireEvent.click(component.find('a'));
    expect(component.screen.render()).toMatchSnapshot('open');
  });
});
