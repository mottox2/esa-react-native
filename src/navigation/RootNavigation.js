import React, { Component } from 'react';

import {
  StyleSheet,
} from 'react-native';

import {
  NavigationProvider,
  createRouter,
  StackNavigation,
  TabNavigation,
  TabNavigationItem as TabItem,
} from '@exponent/ex-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Router from './Router.js'

const defaultRouteConfig = {
  navigationBar: {
    backgroundColor: '#2DA8A3',
    tintColor: '#FFF',
  }
}

export default class RootNavigation extends Component {
  renderIcon(name, isSelected) {
    return (
      <Icon
        name={name}
        size={28}
        color={isSelected ? '#2DA8A3' : '#9DA4AF'}
      />
    )
  }

  render() {
    return(
      <TabNavigation
        id="main"
        initialTab="recent">
        <TabItem
          id="recent"
          title="Recent"
          renderIcon={isSelected => this.renderIcon('insert-drive-file', isSelected)}
        >
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('list', { tabId: 'recent' })}
          />
        </TabItem>

        <TabItem
          id="starred"
          title="Starred"
          renderIcon={isSelected => this.renderIcon('star', isSelected)}
        >
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('list', { tabId: 'starred' })}
          />
        </TabItem>

        <TabItem
          id="watched"
          title="Watched"
          renderIcon={isSelected => this.renderIcon('remove-red-eye', isSelected)}
        >
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('list', { tabId: 'watched' })}
          />
        </TabItem>

        <TabItem
          id="profile"
          title="MyPosts"
          renderIcon={isSelected => this.renderIcon('person', isSelected)}
        >
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('list', { tabId: 'profile' })}
          />
        </TabItem>
      </TabNavigation>
    )
  }
}

const styles = StyleSheet.create({
  selectedTab: {
    color: '#2DA8A3',
  }
});
