import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';


import Frisbee from 'frisbee';
import store from 'react-native-simple-store';

import Router from '../navigation/Router.js'
import Config from '../../config.js'

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

const queryMap = (tabId, screenName) => {
  switch (tabId) {
  case 'recent':
    return {}
  case 'starred':
    return { q: 'starred:true' }
  case 'watched':
    return { q: 'watched:true' }
  case 'profile':
    return { q: `user:${screenName}` }
  default:
    console.log(`Unknown tabId: ${tabId}`)
  }
}

export default class ListScreen extends Component {
  static route = {
    navigationBar: {
      title: 'Wing'
    },
  }

  _loadMoreContentAsync = async () => {
    if (this.state.isLoadingMore || !this.nextPage) return
    console.log('More loading')
    this.setState({ isLoadingMore: true })
    const accessToken = await store.get('accessToken')
    const query = Object.assign({}, this.query, { page: this.nextPage })
    console.log(query)
    const posts = await api.jwt(accessToken).get(this.requestPath, { body: query })
    this.nextPage = posts.body.next_page
    if (!this.nextPage) this.setState({ canLoadMore: false })
    this.posts = this.posts.concat(posts.body.posts)
    this.setState({ isLoadingMore: false, dataSource: this.state.dataSource.cloneWithRows(this.posts)})
    console.log('Done: More loading')
  }

  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds,
      isLoading: true,
      isLoadingMore: false,
      canLoadMore: true
    }
    this.goToDetail = this.goToDetail.bind(this)
  }

  async componentDidMount() {
    const accessToken = await store.get('accessToken')
    const user = await store.get('user')
    const screenName = user.screen_name
    const tabId = this.props.route.params.tabId
    this.query = queryMap(tabId, screenName)
    const teamName = await store.get('teamName')
    console.log(this.query)

    this.requestPath = '/v1/teams/' + teamName + '/posts'
    const posts = await api.jwt(accessToken).get(this.requestPath, { body: this.query })
    this.nextPage = posts.body.next_page
    if (!this.nextPage) this.setState({ canLoadMore: false })
    this.posts = posts.body.posts
    // let posts = {}
    // posts.body = postsData;

    console.log(posts.body)
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(posts.body.posts), isLoading: false })
  }

  goToDetail(post) {
    this.props.navigation.performAction(({ tabs, stacks }) => {
      stacks('root').push(Router.getRoute('detail', {name: post.name, number: post.number, body_html: post.body_html}))
    });
    // this.props.navigator.push(Router.getRoute('detail', {name: post.name, number: post.number, body_html: post.body_html}));
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.isLoading ?
          <View style={styles.indictorWrapper}><ActivityIndicator size='large'/></View> :
          <ListView
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            dataSource={this.state.dataSource}
            distanceToLoadMore={10}
            canLoadMore={this.state.canLoadMore}
            isLoadingMore={this.state.isLoading}
            onLoadMoreAsync={this._loadMoreContentAsync}
            renderRow={(row) => <TouchableNativeFeedback onPress={this.goToDetail.bind(this, row)} underlayColor='#eeeeee'>
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
            </TouchableNativeFeedback>}
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
    paddingTop: 8,
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
