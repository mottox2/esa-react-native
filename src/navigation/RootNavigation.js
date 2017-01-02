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

// import { FontAwesome } from '@exponent/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Router from './Router.js'

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
          selectedStyle={styles.selectedTab}
          renderIcon={isSelected => this.renderIcon('home', isSelected)}
        >
          <StackNavigation
            id="home"
            initialRoute={Router.getRoute('home')}
          />
        </TabItem>

        <TabItem
          id="list"
          title="Recent"
          renderIcon={isSelected => this.renderIcon('insert-drive-file', isSelected)}
        >
          <StackNavigation
            id="list"
            initialRoute={Router.getRoute('list')}
          />
        </TabItem>

        <TabItem
          id="starred"
          title="Starred"
          renderIcon={isSelected => this.renderIcon('star', isSelected)}
        >
          <StackNavigation
            id="starred"
            initialRoute={Router.getRoute('list')}
          />
        </TabItem>

        <TabItem
          id="profile"
          title="MyPosts"
          renderIcon={isSelected => this.renderIcon('person', isSelected)}
        >
          <StackNavigation
            id="profile"
            initialRoute={Router.getRoute('list')}
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
