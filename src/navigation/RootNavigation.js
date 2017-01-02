import React, { Component } from 'react';

import {
  NavigationProvider,
  createRouter,
  StackNavigation,
  TabNavigation,
  TabNavigationItem as TabItem,
} from '@exponent/ex-navigation';

// import { FontAwesome } from '@exponent/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

import Router from './Router.js'

export default class RootNavigation extends Component {
  renderIcon(name, size) {
    return (
      <Icon
        name={name}
        size={24}
      />
    )
  }

  render() {
    return(
      <TabNavigation
        id="main"
        initialTab="list">
        <TabItem
          id="home"
          title="Home"
          renderIcon={() => this.renderIcon('home')}
        >
          <StackNavigation
            id="home"
            initialRoute={Router.getRoute('home')}
          />
        </TabItem>

        <TabItem
          id="list"
          title="Posts"
          renderIcon={() => this.renderIcon('file-text-o')}
        >
          <StackNavigation
            id="list"
            initialRoute={Router.getRoute('list')}
          />
        </TabItem>
      </TabNavigation>
    )
  }
}
