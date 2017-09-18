import React from 'react';
import { StyleSheet, Text, View, Linking, Button } from 'react-native';
import Config from './config.js'

export default class App extends React.Component {
  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial url is: ' + url);
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

  handleOpenURL(event) {
    console.log(event.url)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Button
          title='Authorize'
          onPress={this.authorize}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
