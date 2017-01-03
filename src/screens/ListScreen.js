import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import Frisbee from 'frisbee';
import store from 'react-native-simple-store';
import postsData from '../../posts.js';

import Router from '../navigation/Router.js'
import Config from '../../config.js'

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

const queryMap = (tabId, screenName) => {
  switch (tabId) {
  case 'recent':
    return ''
  case 'starred':
    return '?q=starred:true'
  case 'watched':
    return '?q=watched:true'
  case 'profile':
    return `?q=@${screenName}`
  default:
    console.log(`Unknown tabId: ${tabId}`)
  }
}

export default class ListScreen extends Component {
  static route = {
    navigationBar: {
      title: 'esa.io Android Client \(Beta\)'
    },
  }

  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds,
      isLoading: true,
    }
    this.goToDetail = this.goToDetail.bind(this)
  }

  async componentDidMount() {
    // const accessToken = await store.get('accessToken')
    // const user = await store.get('user')
    // const screenName = user.screen_name
    // const tabId = this.props.route.params.tabId
    // const query = queryMap(tabId, screenName)
    // const teamName = Config.TEAM_NAME
    //
    // const posts = await api.jwt(accessToken).get('/v1/teams/' + teamName + '/posts' + query)
    let posts = {}
    posts.body = postsData;

    console.log(posts.body)
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(posts.body.posts), isLoading: false })
  }

  goToDetail(post) {
    this.props.navigator.push(Router.getRoute('detail', {name: post.name, number: post.number, body_html: post.body_html}));
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.isLoading ?
          <View style={styles.indictorWrapper}><ActivityIndicator size='large'/></View> :
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(row) => <TouchableHighlight onPress={this.goToDetail.bind(this, row)} underlayColor='#eeeeee'>
              <View style={styles.row}>
                <Image
                  source={{uri: row.created_by.icon}}
                  style={{width: 44, height: 44, marginRight: 12, borderRadius: 22}}
                />
                <View style={styles.content}>
                  <Text style={styles.category}>{row.category}</Text>
                  <Text style={styles.title}>{row.name}</Text>
                  <Text style={styles.createdBy}>Created by {row.created_by.name}</Text>
                </View>
              </View>
            </TouchableHighlight>}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indictorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    marginTop: 8,
    flexDirection: 'row',
    paddingLeft: 12,
  },
  content: {
    flex: 1,
    borderBottomColor: '#ddd', //'#F0F0F0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
    paddingRight: 12,
    paddingBottom: 8,
  },
  category: {
    color: '#9DA4AF',
    fontSize: 11,
    marginBottom: 2,
  },
  title: {
    color: '#3C4A60',
    fontSize: 15,
    lineHeight: 21,
  },
  createdBy: {
    color: '#9DA4AF',
    fontSize: 11,
    marginTop: 4,
  }
});
