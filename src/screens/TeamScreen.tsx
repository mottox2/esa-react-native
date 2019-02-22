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
import { NavigationActions, StackActions, TabScene } from 'react-navigation'
import { MaterialIcons } from '@expo/vector-icons';
import store from 'react-native-simple-store';

interface State {
  dataSource: any
  isLoading: boolean
}

interface Props {
  navigation: any
}

export default class TeamScreen extends Component<Props, State> {
  static navigationOptions = {
    tabBarLabel: 'Teams',
    title: 'Switch Team',
    tabBarIcon: ({ tintColor } : TabScene) => (
      <MaterialIcons
        name='group'
        size={28}
        color={tintColor}
      />
    )
  }

  constructor(props: Props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds,
      isLoading: true,
    }
  }

  // FIXME: 壊れてる
  async switchTeam(row: any) {
    console.log(row)
    await store.save('teamName', row.name)
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'TeamScreen'})]
    })
    this.props.navigation.dispatch(resetAction)
  }

  async componentDidMount() {
    var user = await store.get('user')
    const teams = user.teams
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(teams),
      isLoading: false,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.isLoading ?
          <View style={styles.indictorWrapper}><ActivityIndicator size='large'/></View> :
          <ListView
            dataSource={this.state.dataSource}
            removeClippedSubviews={false}
            renderRow={(row) => <TouchableHighlight onPress={this.switchTeam.bind(this, row)} underlayColor='#eeeeee'>
              <View style={styles.row}>
                <Image
                  source={{uri: row.icon}}
                  style={{width: 44, height: 44, marginRight: 12, borderRadius: 22}}
                />
                <View style={styles.content}>
                  <Text style={styles.category}></Text>
                  <Text style={styles.title}>{row.name}</Text>
                  <Text style={styles.createdBy}>{row.url}</Text>
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
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
  },
  createdBy: {
    color: '#9DA4AF',
    fontSize: 11,
    marginTop: 4,
  }
});
