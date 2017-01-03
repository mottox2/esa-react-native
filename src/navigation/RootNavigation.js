import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
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
        color={isSelected ? '#fff' : '#888'}
      />
    )
  }

  renderTitle(isSelected, title) {
    return(
      <Text style={{ color: isSelected ? '#fff' : '#888', fontSize: 13, marginTop: 2}}>
        {title}
      </Text>
    )
  }

  render() {
    return(
      <TabNavigation
        id="main"
        tabBarColor="#222"
        initialTab="recent">
        <TabItem
          id="recent"
          title="Recent"
          showsTouches='true'
          nativeFeedbackBackground={TouchableNativeFeedback.Ripple('#aaa', true)}
          renderTitle={(isSelected, title) => this.renderTitle(isSelected, title)}
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
          showsTouches='true'
          nativeFeedbackBackground={TouchableNativeFeedback.Ripple('#aaa', true)}
          renderTitle={(isSelected, title) => this.renderTitle(isSelected, title)}
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
          showsTouches='true'
          nativeFeedbackBackground={TouchableNativeFeedback.Ripple('#aaa', true)}
          renderTitle={(isSelected, title) => this.renderTitle(isSelected, title)}
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
          showsTouches='true'
          nativeFeedbackBackground={TouchableNativeFeedback.Ripple('#aaa', true)}
          renderTitle={(isSelected, title) => this.renderTitle(isSelected, title)}
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
