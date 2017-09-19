import React from 'react';
import { StyleSheet, Text, View, Linking, Button, Image } from 'react-native';
import store from 'react-native-simple-store';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Frisbee from 'frisbee';
import Config from './config.js'
import { Constants, LinearGradient } from 'expo'

// import PostListView from './src/components/PostListView.js'
import ListScreen, { RecentListScreen, StarredListScreen, WatchedListScreen } from './src/screens/ListScreen.js'
import DetailScreen from './src/screens/DetailScreen.js'
import TeamScreen from './src/screens/TeamScreen.js'

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

// ex. exp://exp.host/@community/with-webbrowser-redirect/+
const redirectUri = Constants.linkingUri.replace('+', '')

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
      accessToken: '',
      res: '',
      req: '',
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
      '&redirect_uri=' + redirectUri,
    ].join(''))

  }

  openEsa() {
    Linking.openURL('https://esa.io')
  }

  async handleOpenURL(url) {
    const matches = url.match(/\?code=(.*)/)
    if (!matches) return
    const authorizationCode = matches[1]
    const requestData = {
      client_id: Config.CLIENT_ID,
      client_secret: Config.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri.replace(/\?code=(.*)/, ''),
      code: authorizationCode,
    }
    this.setState({ req: JSON.stringify(requestData) })
    console.log(requestData)
    let headers = new Headers();
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')

    const response = await fetch('https://api.esa.io/oauth/token', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    })
    const responseJson = await response.json()
    this.setState({ res: JSON.stringify(responseJson) })
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
      this.setState({accessToken})
    }
  }

  render() {
    return (this.state.accessToken) ? <Navigator/> : <View style={styles.container}>
      <View style={styles.onboardingHeader}>
        <LinearGradient colors={['#18CAC5', '#09807A']} style={styles.onboardingGradient}>
          <Image source={require('./assets/images/wing.png')} style={styles.onboardingLogo} />
          <Text style={styles.onboardingDescription}>WINGはドキュメント共有サービスesa.ioの{"\n"}非公式クライアントアプリです。</Text>
        </LinearGradient>
      </View>
      <View style={styles.onboardingFooter}>
        <Text style={{ opacity: 0.6, marginBottom: 8 }}>ご利用にはesa.ioのアカウントの認証が必要です</Text>
        {/* <Text style={{ opacity: 0.6, marginBottom: 8 }}>{ this.state.req }</Text>
        <Text style={{ opacity: 0.6, marginBottom: 8 }}>{ this.state.res }</Text> */}
        <Button
          title='esa.ioと連携する'
          onPress={this.authorize}
        />
        <Button
          title='アカウントをお持ちでない方はこちら'
          onPress={this.openEsa}
          style={{marginTop: 8 }}
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
  onboardingHeader: {
    flex: 2,
  },
  onboardingGradient: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingLogo: {
    height: 90,
    resizeMode: 'contain',
  },
  onboardingDescription: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
    lineHeight: 26,
    marginTop: 12,
    textAlign: 'center',
  },
  onboardingFooter: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 16,
  },
});
