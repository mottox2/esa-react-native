import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
} from 'react-native';
import store from 'react-native-simple-store';
import Frisbee from 'frisbee';


const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

export default class PostListView extends Component {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds
    }
  }

  async componentDidMount() {
    const accessToken = await store.get('accessToken')
    const posts = await api.jwt(accessToken).get('/v1/teams/kobit/posts')
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(posts.body.posts) })
  }

  render() {
    return (
      <View>
        <Text>ListView</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(row) => <Text>{row.name}</Text>}
        />
      </View>
    )
  }
}
