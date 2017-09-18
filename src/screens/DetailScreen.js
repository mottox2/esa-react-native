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
  padding: 16px;
  margin: 0;
  font-size: 14px;
  word-wrap: break-word;
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
ul {
  margin: 20px 0;
}
ul ul, ul ol, ol ol, ol ul {
  margin: 0
}
li {
  margin: 4px 0;
}
li.task-list-item {
  margin-left: -20px;
  list-style-type: none;
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
blockquote {
  background-color: #f5f5f5;
  color: #747478;
  margin: 0 -16px;
  padding: 8px 16px;
  font-size: 12px;
}
</style>
<script src="https://use.fontawesome.com/ffb71e0a08.js"></script>
`

export default class DetailScreen extends Component {
  componentDidMount() {
    console.log(this.props.navigation.state.params)
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
        <WebView style={styles.webView} source={{ html: `${htmlStyles}<body>${this.props.navigation.state.params.body_html}</body>` }} />
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
