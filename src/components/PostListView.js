import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
} from 'react-native';
import store from 'react-native-simple-store';
import Frisbee from 'frisbee';
import postsData from '../../posts.js';


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
    // const accessToken = await store.get('accessToken')
    // const posts = await api.jwt(accessToken).get('/v1/teams/kobit/posts')
    let posts = {}
    posts.body = postsData;

    console.log(posts.body)
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(posts.body.posts) })
  }

  render() {
    return (
      <View>
        <Text>ListView</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(row) => <View style={styles.row}>
            <Image
              source={{uri: row.created_by.icon}}
              style={{width: 44, height: 44}}
            />
            <View style={styles.content}>
              <Text style={styles.category}>{row.category}</Text>
              <Text style={styles.title}>{row.name}</Text>
            </View>
          </View>}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  category: {
    color: '#9DA4AF',
    fontSize: 11,
  },
  title: {
    color: '#3C4A60',
    fontSize: 15,
  }
});
