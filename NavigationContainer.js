import * as React from 'react'

import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation'
import { RecentListScreen, StarredListScreen, WatchedListScreen } from './src/screens/ListScreen.js'
import DetailScreen from './src/screens/DetailScreen.js'
import TeamScreen from './src/screens/TeamScreen.js'

import { MaterialIcons } from '@expo/vector-icons';

const RecentStack = createStackNavigator({
  RecentListScreen,
  DetailScreen,
})

RecentStack.navigationOptions = () => ({
  tabBarLabel: 'Home',
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons
      name='home'
      size={29}
      color={tintColor}
    />
  )
})

const StarredStack = createStackNavigator({
  StarredListScreen,
  DetailScreen
})

StarredStack.navigationOptions = () => ({
  tabBarLabel: 'Starred',
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons
      name='star'
      size={28}
      color={tintColor}
    />
  )
})

const WatchedStack = createStackNavigator({
  WatchedListScreen,
  DetailScreen
})

WatchedStack.navigationOptions = () => ({
  tabBarLabel: 'Watching',
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons
      name='visibility'
      size={28}
      color={tintColor}
    />
  )
})

const TeamStack = createStackNavigator({
  TeamScreen
})

TeamStack.navigationOptions = () => ({
  tabBarLabel: 'Teams',
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons
      name='group'
      size={28}
      color={tintColor}
    />
  )
})

const TabNavigator = createBottomTabNavigator({
  RecentStack,
  StarredStack,
  WatchedStack,
  TeamStack
},
{
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: '#09918A',
    inactiveTintColor: '#aaa',
    style: {
      borderTopWidth: 1,
      borderTopColor: '#eee'
    }
  }
})

const Navigator = createStackNavigator(
  {
    Main: TabNavigator,
    DetailScreen
  },
  {
    // FIXME: どっかに移動
    navigationOptions: ({ navigation }) => {
      return {...(Platform.OS == 'android'
        ? {
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#09918A'
            },
            headerTitleStyle: {
              color: 'white'
            }
          }
        : {})}
    }
  }
)

export default createAppContainer(TabNavigator)
