import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
} from 'react-native';
import Frisbee from 'frisbee';
import store from 'react-native-simple-store';

const api = new Frisbee({
  baseURI: 'https://api.esa.io'
})

export default class ListScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      post: null
    }
  }


  render() {
    return (
      <View>
        <Text>Detail Screen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    marginTop: 8,
    flexDirection: 'row',
    paddingLeft: 12,
  },
  content: {
    flex: 1,
    borderBottomColor: '#ddd',
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
