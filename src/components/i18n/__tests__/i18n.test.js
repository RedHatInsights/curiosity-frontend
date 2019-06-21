import React from 'react';
import { mount, shallow } from 'enzyme';
import { I18n } from '../i18n';

describe('I18n Component', () => {
  it('should render a basic component', () => {
    const props = {
      locale: 'es'
    };

    const component = mount(
      <I18n {...props}>
        <React.Fragment>lorem ipsum</React.Fragment>
      </I18n>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should pass children', () => {
    const component = shallow(
      <I18n>
        <React.Fragment>lorem ipsum</React.Fragment>
      </I18n>
    );

    expect(component.html()).toMatchSnapshot('children');
  });
});
