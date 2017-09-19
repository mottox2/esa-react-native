import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';


import Frisbee from 'frisbee';
import store from 'react-native-simple-store';

// import Router from '../navigation/Router.js'
import Config from '../../config.js'

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

export default class ListScreen extends Component {
  static navigationOptions = {
    title: 'Wing'
  }

  _loadMoreContentAsync = async () => {
    if (this.state.isLoadingMore || !this.nextPage) return
    console.log('More loading')
    this.setState({ isLoadingMore: true })

    const accessToken = await store.get('accessToken')
    const query = Object.assign({}, this.query, { page: this.nextPage })
    console.log('query:', this.query)

    const posts = await this.fetchPosts(query)

    this.setState({ isLoadingMore: false, dataSource: this.state.dataSource.cloneWithRows(this.posts)})
    console.log('Done: More loading')
  }

  async fetchPosts(query) {
    const posts = await api.jwt(this.accessToken).get(this.requestPath, { body: query })
    this.nextPage = posts.body.next_page
    if (!this.nextPage) this.setState({ canLoadMore: false })
    this.posts = this.posts.concat(posts.body.posts)
    return posts
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
    this.posts = []
  }

  async componentDidMount() {
    this.accessToken = await store.get('accessToken')
    const teamName = await store.get('teamName')
    this.requestPath = '/v1/teams/' + teamName + '/posts'

    // Set query
    const user = await store.get('user')
    const screenName = user.screen_name
    this.query = this.navigationParams(screenName)
    console.log('query:', this.query)

    const posts = await this.fetchPosts(this.query)

    this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.posts), isLoading: false })
  }

  goToDetail(post) {
    this.props.navigation.navigate('Detail', {
      name: post.name, number: post.number, body_html: post.body_html
    })
  }

  navigationParams() {
    return {}
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
            removeClippedSubviews={false}
            enableEmptySections={true}
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
    backgroundColor: 'white',
  },
  indictorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
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
    fontWeight: "500",
    lineHeight: 21,
  },
  createdBy: {
    color: '#9DA4AF',
    fontSize: 11,
    marginTop: 4,
  }
});

export class RecentListScreen  extends ListScreen {
  static navigationOptions = {
    tabBarLabel: 'Home',
    title: 'Recent Posts',
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons
        name='home'
        size={30}
        color={tintColor}
      />
    )
  }

  constructor(props) {
    super(props)
  }

  navigationParams() {
    return {}
  }
}

export class StarredListScreen  extends ListScreen {
  static navigationOptions = {
    tabBarLabel: 'Starred',
    title: 'Starred Posts',
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons
        name='star'
        size={28}
        color={tintColor}
      />
    )
  }

  constructor(props) {
    super(props)
  }

  navigationParams() {
    return { q: 'starred:true' }
  }
}

export class WatchedListScreen  extends ListScreen {
  static navigationOptions = {
    tabBarLabel: 'Watching',
    title: 'Watching Posts',
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons
        name='visibility'
        size={28}
        color={tintColor}
      />
    )
  }

  constructor(props) {
    super(props)
  }

  navigationParams() {
    return { q: 'watched:true' }
  }
}

export class ProfileListScreen  extends ListScreen {
  static navigationOptions = {
    tabBarLabel: 'Mine',
    title: 'My Posts',
  }

  constructor(props) {
    super(props)
  }

  navigationParams(screenName) {
    return { q: `user:${screenName}` }
  }
}
