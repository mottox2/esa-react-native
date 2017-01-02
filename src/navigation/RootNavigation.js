import React, { Component } from 'react';
import {
  NavigationProvider,
  createRouter,
  StackNavigation,
  TabNavigation,
  TabNavigationItem as TabItem,
} from '@exponent/ex-navigation';

import Router from './Router.js'

export default class RootNavigation extends Component {
  render() {
    return(
      <TabNavigation
        id="main"
        initialTab="list">
        <TabItem
          id="home"
          title="Home"
        >
          <StackNavigation
            id="home"
            initialRoute={Router.getRoute('home')}
          />
        </TabItem>

        <TabItem
          id="list"
          title="list"
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
