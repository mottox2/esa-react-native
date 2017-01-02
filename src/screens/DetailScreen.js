import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  WebView,
} from 'react-native';
import Frisbee from 'frisbee';
import store from 'react-native-simple-store';

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

const htmlStyles = `
<style>
a.anchor {
  display: none
}
</style>
`

export default class DetailScreen extends Component {
  static route = {
    navigationBar: {
      title(params) {
        return params.name
      },
    },
  }

  componentDidMount() {
    console.log(this.props.route.params)
  }

  constructor(props) {
    super(props)

    this.state = {
      post: null
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView style={styles.webView} source={{ html: htmlStyles + this.props.route.params.body_html }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1
  },
});
