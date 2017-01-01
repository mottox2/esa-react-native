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

    this.state = {
      posts: [],
    }
  }

  async componentDidMount() {
    const accessToken = await store.get('accessToken')
    const posts = await api.jwt(accessToken).get('/v1/teams/kobit/posts')
    debugger
    this.setState({ posts: posts.body.posts })
  }

  render() {
    return (
      <View>
        {this.state.posts.map((post) => {
          return (
            <View>
              <Text>{post.name}</Text>
            </View>
          )
        })}
      </View>
    )
  }
}
