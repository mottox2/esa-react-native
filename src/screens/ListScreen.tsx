import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';

import Frisbee from 'frisbee';
import store from 'react-native-simple-store';

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

export default class ListScreen extends Component {
  static navigationOptions = {
    title: 'Wing'
  }

  _loadMoreContentAsync = async () => {
    if (this.state.isLoadingMore || !this.nextPage) return
    this.setState({ isLoadingMore: true })

    const query = Object.assign({}, this.query, { page: this.nextPage })
    console.log('query[' + this.nextPage + ']:', this.query)

    await this.fetchPosts(query)
  }

  async fetchPosts(query) {
    const res = await api.jwt(this.accessToken).get(this.requestPath, { body: query })
    this.nextPage = res.body.next_page
    // console.log(res.body)
    if (!this.nextPage) this.setState({ canLoadMore: false })
    this.posts = this.posts.concat(res.body.posts)
    this.setState({
      isLoading: false,
      isLoadingMore: false,
      dataSource: this.state.dataSource.cloneWithRows(this.posts)
    })
  }

  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds,
      isLoading: true,
      isLoadingMore: false,
      isRefreshing: false,
      canLoadMore: true,
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

    await this.fetchPosts(this.query)
  }

  goToDetail(post) {
    this.props.navigation.navigate('DetailScreen', {
      name: post.name, number: post.number, body_html: post.body_html
    })
  }

  async onRefresh() {
    this.setState({isRefreshing: true, isLoading: true});
    this.posts = []
    const query = Object.assign({}, this.query, { page: 1 })
    await this.fetchPosts(query)
    this.setState({isRefreshing: false});
  }

  navigationParams() {
    return {}
  }

  renderList() {
    return (this.posts.length > 0 ?
        <ListView
          renderScrollComponent={props => <InfiniteScrollView {...props} />}
          dataSource={this.state.dataSource}
          distanceToLoadMore={10}
          canLoadMore={this.state.canLoadMore}
          isLoadingMore={this.state.isLoading}
          onLoadMoreAsync={this._loadMoreContentAsync}
          removeClippedSubviews={false}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
              colors={['#09918A']}
              tintColor='#09918A'
            />
          }
          renderRow={(row) => <TouchableHighlight onPress={this.goToDetail.bind(this, row)} underlayColor='#eeeeee'>
            <View style={styles.row}>
              <Image
                source={{uri: row.created_by.icon}}
                style={{width: 44, height: 44, marginRight: 12, borderRadius: 22}}
              />
              <View style={styles.content}>
                {row.category &&
                  <Text style={styles.category}>{row.category}</Text>
                }
                <Text style={row.wip ? styles.wipTitle : styles.title}>
                  { row.wip ?
                    <Text style={styles.wipLabel}> WIP </Text> : false
                  }
                  { row.wip ?
                    ' ' : false
                  }
                  {row.name}
                </Text>
                <Text style={styles.createdBy}>Created by {row.created_by.name}</Text>
              </View>
            </View>
          </TouchableHighlight>}
        /> :
        <Text style={styles.blankText}>該当する記事はありません</Text>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.isLoading ?
          <View style={styles.indictorWrapper}><ActivityIndicator size='large'/></View> : this.renderList()
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
    minHeight: 44 + 16,
    paddingRight: 12,
    paddingBottom: 8,
    justifyContent: 'center'
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
  wipTitle: {
    color: '#9fa6b1',
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 21,
  },
  wipLabel: {
    backgroundColor: '#eee',
    fontSize: 12,
  },
  createdBy: {
    color: '#9DA4AF',
    fontSize: 11,
    marginTop: 4,
  },
  blankText: {
    color: '#747478',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  }
});

export class RecentListScreen  extends ListScreen {
  static navigationOptions = {
    title: 'Recent Posts',
  }

  navigationParams() {
    return {}
  }
}

export class StarredListScreen  extends ListScreen {
  static navigationOptions = {
    title: 'Starred Posts',
  }

  navigationParams() {
    return { q: 'starred:true' }
  }
}

export class WatchedListScreen  extends ListScreen {
  static navigationOptions = {
    title: 'Watched Posts',
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
