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
import { NavigationScreenOptions } from 'react-navigation'
import store from 'react-native-simple-store';
import Esa from 'esa-node'

interface Props {
  navigation: any
}

interface State {
  isLoadingMore: boolean
  isLoading: boolean
  isRefreshing: boolean
  canLoadMore: boolean
  dataSource: any
}

export default abstract class ListScreen extends Component<Props, State> {
  posts: Array<any>
  nextPage?: number | null
  accessToken?: string
  teamName?: string
  query?: {
    q?: string
  }

  constructor(props: Props) {
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
    this.teamName = await store.get('teamName')
    this.query = this.navigationParams()
    await this.fetchPosts(this.query)
  }

  _loadMoreContentAsync = async () => {
    if (this.state.isLoadingMore || !this.nextPage) return
    this.setState({ isLoadingMore: true })

    const query = {
      ...this.query,
      page: this.nextPage
    }

    await this.fetchPosts(query)
  }

  async fetchPosts(query: any) {
    if (!this.accessToken)  { return }
    const api = new Esa(this.accessToken, this.teamName)
    const res = await api.posts(query)

    this.nextPage = res.next_page
    if (!this.nextPage) this.setState({ canLoadMore: false })
    this.posts = this.posts.concat(res.posts)
    this.setState({
      isLoading: false,
      isLoadingMore: false,
      dataSource: this.state.dataSource.cloneWithRows(this.posts)
    })
  }

  goToDetail(post: any) {
    this.props.navigation.navigate('DetailScreen', {
      name: post.name, number: post.number, body_html: post.body_html
    })
  }

  async onRefresh() {
    this.setState({isRefreshing: true, isLoading: true});
    this.posts = []
    const query = {...this.query, page: 1 }
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
  static navigationOptions : NavigationScreenOptions = {
    title: 'Recent Posts',
  }

  navigationParams() {
    return {}
  }
}

export class StarredListScreen  extends ListScreen {
  static navigationOptions : NavigationScreenOptions = {
    title: 'Starred Posts',
  }

  navigationParams() {
    return { q: 'starred:true' }
  }
}

export class WatchedListScreen  extends ListScreen {
  static navigationOptions : NavigationScreenOptions = {
    title: 'Watched Posts',
  }

  navigationParams() {
    return { q: 'watched:true' }
  }
}