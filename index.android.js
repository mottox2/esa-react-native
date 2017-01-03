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
import store from 'react-native-simple-store';
import Frisbee from 'frisbee';
import Config from './config.js'

import PostListView from './src/components/PostListView.js'

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

export default class esaReactNative extends Component {
  constructor(props) {
    console.disableYellowBox = true;

    super(props)
    this.state = {
      authorized: true, //false
      isReady: false,
    }
    Linking.addEventListener('url', event => this.handleOpenURL(event))
  }
  async componentDidMount() {
    console.log('componentDidMount')
    var accessToken = await store.get('accessToken')

    if (accessToken) this.setState({ authorized: true, isReady: true })
    else this.setState({ authorized: false, isReady: true })
  }
  componentWillUnmount() {
    Linking.removeEventListener('url');
  }
  authorize() {
    Linking.openURL([
      'https://api.esa.io/oauth/authorize',
      '?response_type=code',
      '&client_id=' + Config.CLIENT_ID,
      '&redirect_uri=' + Config.REDIRECT_URI,
    ].join(''))
  }
  async handleOpenURL(event) {
    const authorizationCode = event.url.match(/\?code=(.*)/)[1]
    const requestData = {
      client_id: Config.CLIENT_ID,
      client_secret: Config.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: Config.REDIRECT_URI,
      code: authorizationCode,
    }
    let headers = new Headers();
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')

    const response = await fetch('https://api.esa.io/oauth/token', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    })
    const responseJson = await response.json()
    console.log(responseJson)
    const accessToken = responseJson.access_token
    await store.save('accessToken', accessToken)
    const user = await api.jwt(accessToken).get('/v1/user')
    await store.save('screenName', user.body.screen_name)
    console.log('screen_name', user.body.screen_name)
    this.setState({authorized: true, isReady: true })
  }
  render() {
    return (
      <View style={styles.container}>
        { this.state.isReady &&
          <View style={styles.container}>
            { this.state.authorized ?
              <PostListView/> :
              <View>
                <Text> Not Authorized </Text>
                <Button title='Authorize' onPress={this.authorize}/>
              </View>
            }
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

AppRegistry.registerComponent('esaReactNative', () => esaReactNative);
