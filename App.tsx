import * as React from 'react'
import { StyleSheet, Text, View, Linking, Button, Image, Platform, StatusBar } from 'react-native'
import store from 'react-native-simple-store'
import Config from './config.js'
import { LinearGradient, AuthSession } from 'expo'

import NavigationContainer from './NavigationContainer'
import Esa from 'esa-node';

export default class App extends React.Component {
  state = {
    accessToken: '',
    res: '',
    req: '',
    url: ''
  }

  async componentDidMount() {
    const accessToken = await store.get('accessToken')
    console.log(accessToken)
    this.setState({ accessToken })
    // Linking.getInitialURL().then((url) => {
    //   if (!accessToken && url) {
    //     this.setState({ url })
    //     console.log('Initial url is: ' + url);
    //     this.handleOpenURL(url)
    //   }
    // })
    // Linking.addEventListener('url', this.handleOpenURL)
  }

  async authorize() {
    let redirectUrl = AuthSession.getRedirectUrl()
    // this.setState({ url: redirectUrl })
    let result: any = await AuthSession.startAsync({
      authUrl: [
        'https://api.esa.io/oauth/authorize',
        '?response_type=code',
        '&client_id=' + Config.CLIENT_ID,
        '&redirect_uri=' + redirectUrl
      ].join('')
    })
    // this.setState({ res: JSON.stringify(result) })
    const code = result.params.code
    this.getAccessToken(code, redirectUrl)
  }

  openEsa() {
    Linking.openURL('https://esa.io')
  }

  async getAccessToken(code, redirectUrl) {
    if (!code) return
    const requestData = {
      client_id: Config.CLIENT_ID,
      client_secret: Config.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: redirectUrl,
      code: code
    }
    this.setState({ req: JSON.stringify(requestData) })
    console.log(requestData)
    let headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')
    const response = await fetch('https://api.esa.io/oauth/token', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    })
    const responseJson = await response.json()
    this.setState({ res: JSON.stringify(responseJson) })
    console.log(responseJson)
    if (responseJson.error) {
      console.log(responseJson)
      return
    }
    const accessToken = responseJson.access_token
    const api = new Esa(accessToken)
    const user = await api.user({ include: 'teams' })
    await store.save('accessToken', accessToken)
    await store.save('user', user)
    if (!user.teams) { return }
    if (user.teams.length == 0) {
      console.log('閲覧出来る記事がありません。esa.ioへの登録が必要です。')
    } else {
      await store.save('teamName', user.teams[0].name)
      this.setState({ accessToken })
    }
  }

  render() {
    return this.state.accessToken ? (
      <View style={styles.container}>
        {Platform.OS === 'android' ? (
          <StatusBar barStyle="light-content" backgroundColor="#075B56" />
        ) : (
          <StatusBar barStyle="dark-content" />
        )}
        <NavigationContainer />
      </View>
    ) : (
      <View style={styles.container}>
        {Platform.OS === 'android' ? null : <StatusBar barStyle="light-content" />}
        <View style={styles.onboardingHeader}>
          <LinearGradient colors={['#18CAC5', '#09807A']} style={styles.onboardingGradient}>
            <Image source={require('./assets/images/wing.png')} style={styles.onboardingLogo} />
            <Text style={styles.onboardingDescription}>
              WINGはドキュメント共有サービスesa.ioの{'\n'}非公式クライアントアプリです。
            </Text>
          </LinearGradient>
        </View>
        <View style={styles.onboardingFooter}>
          <Text style={{ opacity: 0.6, marginBottom: 8 }}>
            ご利用にはesa.ioのアカウントの認証が必要です
          </Text>
          {/* <Text style={{ opacity: 0.6, marginBottom: 8 }}>{ redirectUri }</Text> */}
          {/* <Text style={{ opacity: 0.6, marginBottom: 8 }}>{ this.state.url }</Text> */}
          {/* <Text style={{ opacity: 0.6, marginBottom: 8 }}>{ this.state.req }</Text> */}
          {/* <Text style={{ opacity: 0.6, marginBottom: 8 }}>{ this.state.res }</Text> */}
          <Button title="esa.ioと連携する" onPress={this.authorize.bind(this)} />
          {Platform.OS === 'android' && (
            <Button title="アカウントをお持ちでない方はこちら" onPress={this.openEsa} />
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  onboardingHeader: {
    flex: 2
  },
  onboardingGradient: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  onboardingLogo: {
    height: 90,
    resizeMode: 'contain'
  },
  onboardingDescription: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
    lineHeight: 26,
    marginTop: 12,
    textAlign: 'center'
  },
  onboardingFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  }
})
