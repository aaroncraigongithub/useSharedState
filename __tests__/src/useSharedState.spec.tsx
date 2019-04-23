import * as React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import faker from 'faker';
import Simple from '../shared/Simple';
import Updating from '../shared/Updating';
import {
  update,
  registerMiddleware,
  SharedStateMiddleware,
  removeMiddleware,
} from '../../src';

describe('useSharedState', () => {
  const defaultValue = faker.lorem.word();
  const key = 'test-key';
  let component1: ReactWrapper;
  let component2: ReactWrapper;

  describe('simple shared state', () => {
    beforeEach(() => {
      component1 = mount(<Simple keyName={key} defaultValue={defaultValue} />);
      component2 = mount(<Simple keyName={key} />);
    });

    it('renders the default value', () => {
      expect(component1.find('span').text()).toEqual(defaultValue);
    });

    it('makes the default value available to another component', () => {
      expect(component2.find('span').text()).toEqual(defaultValue);
    });
  });

  describe('updating shared state', () => {
    beforeAll(() => {
      component1 = mount(
        <Updating keyName={key} defaultValue={defaultValue} />,
      );
      component2 = mount(<Updating keyName={key} />);

      component1.find('button').simulate('click');
    });

    it('updates the originating component', () => {
      expect(component1.find('button').text()).toEqual(`${defaultValue}x`);
    });

    it('updates other listening components', () => {
      expect(component2.find('button').text()).toEqual(`${defaultValue}x`);
    });
  });
});

describe('middleware', () => {
  let component: ReactWrapper;
  const key = 'update-test';
  const value = faker.lorem.word();
  const middleware: SharedStateMiddleware<string> = (value: string, next) => {
    next(`${value}x`);
  };

  beforeAll(() => {
    registerMiddleware<string>(key, middleware);
  });

  beforeEach(() => {
    component = mount(<Simple keyName={key} defaultValue={value} />);
  });

  afterAll(() => {
    removeMiddleware<string>(key, middleware);
  });

  it('passes through the middleware', () => {
    expect(component.find('span').text()).toEqual(`${value}x`);
  });
});

describe('update', () => {
  const defaultValue = faker.lorem.word();
  const newValue = `${defaultValue} new`;
  const key = 'update-test';
  let component: ReactWrapper;

  beforeEach(() => {
    component = mount(<Simple keyName={key} defaultValue={defaultValue} />);

    act(() => {
      update<string>(key, newValue);
    });
  });

  it('updates the listening component', () => {
    expect(component.find('span').text()).toEqual(newValue);
  });
});
