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

export default class TeamScreen extends Component {
  static route = {
    navigationBar: {
      title: 'esa.io Android Client \(Beta\)',
    },
  }

  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds,
    }
  }

  async switchTeam(row) {
    console.log(row)
    await store.save('teamName', row.name)
    this.props.navigation.performAction(({ tabs, stacks }) => {
      stacks('root').replace(Router.getRoute('rootNavigation'))
    });
  }

  async componentDidMount() {
    var user = await store.get('user')
    const teams = user.teams
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(teams),
    })
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.isLoading ?
          <View style={styles.indictorWrapper}><ActivityIndicator size='large'/></View> :
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(row) => <TouchableNativeFeedback onPress={this.switchTeam.bind(this, row)} underlayColor='#eeeeee'>
              <View style={styles.row}>
                <Image
                  source={{uri: row.icon}}
                  style={{width: 44, height: 44, marginRight: 12, borderRadius: 22}}
                />
                <View style={styles.content}>
                  <Text style={styles.category}>{row.name}</Text>
                  <Text style={styles.title}>{row.name}</Text>
                  <Text style={styles.createdBy}>Created by {row.name}</Text>
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
