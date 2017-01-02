import React, { Component } from 'react';

import {
  NavigationProvider,
  createRouter,
  StackNavigation,
  TabNavigation,
  TabNavigationItem as TabItem,
} from '@exponent/ex-navigation';

// import { FontAwesome } from '@exponent/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Router from './Router.js'

export default class RootNavigation extends Component {
  renderIcon(name, size) {
    return (
      <Icon
        name={name}
        size={28}
      />
    )
  }

  componentDidMount() {
      // this.props.navigator.push(Router.getRoute('detail'))
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
          title="Recent"
          renderIcon={() => this.renderIcon('insert-drive-file')}
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
