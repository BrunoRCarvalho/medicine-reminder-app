import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import {
  ScrollView,
  Linking,
  View,
  TouchableHighlight,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  AsyncStorage,
  ActivityIndicator
} from "react-native";

import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Thumbnail,
  Body,
  Button,
  Footer,
  FooterTab
} from "native-base";

import { Loading } from "./Loading";
import PushNotification from "react-native-push-notification";

import { Card } from "react-native-elements";
// import Button from "antd-mobile/lib/button";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import Menu from "../extras/Menu";

import AnimatedLinearGradient, {
  presetColors
} from "react-native-animated-linear-gradient";

import {
  retrieveMedicine,
  editMedicine,
  deleteMedicine,
  getColors,
  resetActiveMedicine,
  deleteColors,
  getUserById,
  loadingFalse,
  loadingTrue,
  deleteAlarms
} from "../ducks/user";

class Home extends Component {
  constructor(props) {
    super(props);

    this.bounceValue = new Animated.Value(0);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    AsyncStorage.getItem("user").then(result => {
      if (result) {
        this.props.getUserById(result).then(res => {
          if (this.props.user) {
            const { id } = this.props.user;
            this.props.retrieveMedicine(id).then(() => {
              PushNotification.configure({
                onNotification: notification => {
                  if (notification.notificationId) {
                    this.props
                      .editMedicine(notification.notificationId)
                      .then(() => {
                        this.setState({ loading: false });
                        this.props.navigation.navigate("Profile");
                      });
                  }
                },
                requestPermissions: true
              });
              this.props.getColors(id).then(() => {
                this.setState({ loading: false });
                if (!this.props.medicine.length) {
                  setTimeout(
                    () =>
                      Alert.alert(
                        "Instructions",
                        `You can Click the "+" sign below to get started!`
                      ),
                    1000
                  );
                }
              });
            });
          }
        });
      } else {
        this.setState({ loading: false });
        Alert.alert("Error", "Something went wrong!");
        this.props.navigation.navigate("SignUp");
      }
    });
  }

  render() {
    const { navigation, user, medicine, backgroundColors } = this.props;

    const styles = StyleSheet.create({
      actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: "white"
      },
      footerButton: {
        fontSize: 25,
        color: `${backgroundColors.footer_icon}`
      },
      footer: {
        backgroundColor: `${backgroundColors.button}`
      },
      title: {
        color: `${backgroundColors.textcolor}`,
        fontSize: 23
      },
      description: {
        color: `${backgroundColors.textcolor}`,
        fontSize: 15
      }
    });

    return this.state.loading ? (
      <Loading />
    ) : (
      <View style={{ flex: 1 }}>
        <Container>
          <AnimatedLinearGradient
            customColors={[
              `${backgroundColors.first}`,
              `${backgroundColors.second}`,
              `${backgroundColors.third}`
            ]}
            speed={5000}
          />

          <Content>
            <ScrollView>
              <List
                dataArray={medicine}
                renderRow={item => (
                  <ListItem
                    style={{ height: 100 }}
                    onPress={() => {
                      this.setState({ loading: true });
                      this.props.editMedicine(item.id).then(() => {
                        navigation.navigate("Profile");
                        this.setState({ loading: false });
                      });
                    }}
                  >
                    <Thumbnail square size={120} source={{ uri: item.image }} />
                    <Body>
                      <Text style={styles.title}>{item.name}</Text>
                      <Text note style={styles.description}>
                        {item.description}
                      </Text>
                    </Body>
                  </ListItem>
                )}
              />
            </ScrollView>
          </Content>
          <Footer>
            <FooterTab style={styles.footer}>
              <Button
                onPress={() => {
                  this.setState({ loading: true });
                  navigation.navigate("Colors");
                  this.setState({ loading: false });
                }}
                onLongPress={() => {
                  Alert.alert("Colors", "Colors sucessfully removed");
                  this.setState({ loading: true });
                  this.props.deleteColors(this.props.user.id).then(() => {
                    this.props.getColors(this.props.user.id).then(() => {
                      this.setState({ loading: false });
                    });
                  });
                }}
                delayLongPress={1500}
              >
                <Icon name="format-color-fill" style={styles.footerButton} />
              </Button>
              <Button
                onPress={() => {
                  this.setState({ loading: true });
                  this.props.navigation.navigate("Create");
                  this.setState({ loading: false });
                }}
                onLongPress={() => {
                  Alert.alert("Alarm", "All alarms deleted");
                  this.setState({ loading: true });
                  PushNotification.cancelAllLocalNotifications();
                  this.props
                    .deleteAlarms(this.props.user.id)
                    .then(() => this.setState({ loading: false }));
                }}
                delayLongPress={1500}
              >
                <Icon name="plus-box" style={styles.footerButton} />
              </Button>
              <Button
                onPress={() => {
                  this.setState({ loading: true });
                  navigation.navigate("Interaction");
                  this.setState({ loading: false });
                }}
                onLongPress={() => {
                  Alert.alert("Logout", "Logout Successful");
                  this.setState({ loading: true });
                  AsyncStorage.setItem("user", "").then(() => {
                    this.props.navigation.navigate("SignUp");
                    this.setState({ loading: false });
                  });
                }}
                delayLongPress={1500}
              >
                <Icon name="link-variant" style={styles.footerButton} />
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </View>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {
  retrieveMedicine,
  editMedicine,
  deleteMedicine,
  getColors,
  resetActiveMedicine,
  deleteColors,
  getUserById,
  loadingFalse,
  loadingTrue,
  deleteAlarms
})(Home);
