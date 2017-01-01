/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
} from 'react-native';
import Config from './config.js'
import store from 'react-native-simple-store';
import Frisbee from 'frisbee';

export default class esaReactNative extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authorized: true
    }
  }
  async componentDidMount() {
    console.log('componentDidMount')
    var accessToken = await store.get('accessToken')
    if (!accessToken) this.setState({ authorized: false })
  }
  authorize() {
    Linking.openURL([
      'https://api.esa.io/oauth/authorize',
      '?response_type=code',
      '&client_id=' + Config.CLIENT_ID,
      '&redirect_uri=' + Config.REDIRECT_URI,
    ].join(''))
  }
  render() {
    return (
      <View style={styles.container}>
        { this.state.authorized ?
          <Text>Authorized</Text> :
          <View>
            <Text> Not Authorized </Text>
            <Button title='Authorize' onPress={this.authorize}/>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('esaReactNative', () => esaReactNative);
