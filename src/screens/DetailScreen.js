import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  WebView,
  Linking,
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
  async componentDidMount() {
    console.log(this.props.navigation.state.params)
    this.teamName = await store.get('teamName')
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
        <WebView
          ref={(ref) => { this.webview = ref }}
          style={styles.webView}
          source={{ html: `${htmlStyles}<body>${this.props.navigation.state.params.body_html}</body>` }}
          onNavigationStateChange={(event) => {
            console.log(event)
            const url = event.url
            if (((typeof url) === 'string') && (url[0] === '/')) {
              this.webview.stopLoading();
              // 相対リンクを絶対リンクに直す
              Linking.openURL(`https://${this.teamName}.esa.io${url}`);
            } else if (url !== 'about:blank') {
              this.webview.stopLoading();
              Linking.openURL(url);

            }
          }}
         />
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
