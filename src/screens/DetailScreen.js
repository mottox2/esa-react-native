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

let htmlStyles = `
<style>
a.anchor {
  display: none
}
a {
  color: #0a9b94;
  text-decoration: none;
}
body {
  overflow: auto;
  color: #3c4a60;
  line-height: 1.5;
}
pre {
  overflow: auto;
  white-space: pre;
  word-wrap: break-word;
  word-break: break-all;
  background-color: #f5f5f5;
  display: block;
  padding: 20px;
}
iframe, img {
  max-width: 100%;
}
li {
  margin: 4px 0;
}
h2 {
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  padding: 8px 0;
}
h2 .fa, h3 .fa, h4 .fa {
  color: rgba(60,74,96,0.3);
  margin-right: 4px;
}
</style>
<script src="https://use.fontawesome.com/ffb71e0a08.js"></script>
`

export default class DetailScreen extends Component {
  static route = {
    navigationBar: {
      title(params) {
        return params.name
      },
      backgroundColor: '#2DA8A3',
      tintColor: '#FFF',
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
        <WebView style={styles.webView} source={{ html: `${htmlStyles}<body>${this.props.route.params.body_html}</body>` }} />
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
