import React from 'react';
import { StyleSheet, Text, View, Linking, Button, Image } from 'react-native';
import store from 'react-native-simple-store';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Frisbee from 'frisbee';
import Config from './config.js'
import { Constants } from 'expo'

// import PostListView from './src/components/PostListView.js'
import ListScreen, { RecentListScreen, StarredListScreen, WatchedListScreen } from './src/screens/ListScreen.js'
import DetailScreen from './src/screens/DetailScreen.js'
import TeamScreen from './src/screens/TeamScreen.js'

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

const MainScreenNavigator = TabNavigator({
  Recent: { screen: RecentListScreen },
  Starred: { screen: StarredListScreen },
  Watched: { screen: WatchedListScreen },
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
    // ex. exp://exp.host/@community/with-webbrowser-redirect/+
    let redirectUri = Constants.linkingUri
    redirectUri = redirectUri.replace('+', 'authorize')
    console.log(redirectUri)

    Linking.openURL([
      'https://api.esa.io/oauth/authorize',
      '?response_type=code',
      '&client_id=' + Config.CLIENT_ID,
      '&redirect_uri=' + redirectUri,
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
    return (this.state.accessToken && false) ? <Navigator/> : <View style={styles.container}>
      <View style={{ flex: 2, backgroundColor: '#09807A', justifyContent: 'center', padding: 16, alignItems: 'center' }}>
        <Image source={require('./assets/images/wing.png')} style={{ height: 90, resizeMode: 'contain' }} />
        <Text style={{fontSize: 16, color: 'white', lineHeight: 26, marginTop: 12, textAlign: 'center' }}>WINGはドキュメント共有サービスesa.ioの{"\n"}非公式クライアントアプリです。</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ opacity: 0.6 }}>ご利用にはesa.ioのアカウントの認証が必要です</Text>
        <Button
          title='esa.ioと連携する'
          onPress={this.authorize}
        />
        <Button
          title='アカウントをお持ちでない方はこちら'
          onPress={this.authorize}
        />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});
