import React from 'react';
import { StyleSheet, Text, View, Linking, Button } from 'react-native';
import store from 'react-native-simple-store';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Frisbee from 'frisbee';
import Config from './config.js'

// import PostListView from './src/components/PostListView.js'
import ListScreen, { RecentListScreen } from './src/screens/ListScreen.js'
import DetailScreen from './src/screens/DetailScreen.js'
import TeamScreen from './src/screens/TeamScreen.js'

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

const MainScreenNavigator = TabNavigator({
  Home: { screen: ListScreen },
  Recent: { screen: RecentListScreen },
  Team: { screen: TeamScreen },
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
});

const Navigator = StackNavigator({
  Main: { screen: MainScreenNavigator },
  Detail: { screen: DetailScreen },
});

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      accessToken: ''
    }
  }

  async componentDidMount() {
    const accessToken = await store.get('accessToken')
    console.log(accessToken)
    this.setState({accessToken})
    Linking.getInitialURL().then((url) => {
      if (!accessToken && url) {
        console.log('Initial url is: ' + url);
        this.handleOpenURL(url)
      }
    })
    Linking.addEventListener('url', this.handleOpenURL)
  }

  authorize() {
    Linking.openURL([
      'https://api.esa.io/oauth/authorize',
      '?response_type=code',
      '&client_id=' + Config.CLIENT_ID,
      '&redirect_uri=' + Config.REDIRECT_URI,
    ].join(''))

  }

  async handleOpenURL(url) {
    const authorizationCode = url.match(/\?code=(.*)/)[1]
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
    if (responseJson.error) {
      console.log(responseJson)
      return
    }
    const accessToken = responseJson.access_token
    await store.save('accessToken', accessToken)
    const user = await api.jwt(accessToken).get('/v1/user?include=teams')
    await store.save('user', user.body)
    if (user.body.teams.length == 0) {
      console.log('閲覧出来る記事がありません。esa.ioへの登録が必要です。')
    } else {
      await store.save('teamName', user.body.teams[0].name)
    }
  }

  render() {
    return this.state.accessToken ? <Navigator/> : <View>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Changes you make will automatically reload.</Text>
      <Text>Shake your phone to open the developer menu.</Text>
      <Text>{this.state.accessToken}</Text>
      <Button
        title='Authorize'
        onPress={this.authorize}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
