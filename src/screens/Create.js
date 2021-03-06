import React, { Component } from "react";
import axios from "axios";
const ImagePicker = require("react-native-image-picker");

import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Alert,
  Picker,
  DatePickerAndroid,
  TimePickerAndroid
} from "react-native";

import {
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
  Right,
  Footer,
  FooterTab
} from "native-base";

import PushNotification from "react-native-push-notification";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Loading } from "./Loading";

import styled from "styled-components/native";

import {
  createMedicine,
  retrieveRxcuis,
  addAlarm,
  createMedicineActive,
  loadingTrue,
  loadingFalse
} from "../ducks/user";

import { connect } from "react-redux";
import Menu from "./../extras/Menu";
import AnimatedLinearGradient from "react-native-animated-linear-gradient";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image:
        "http://drpattydental.com/wp-content/uploads/2017/05/placeholder.png",
      name: "",
      description: "",
      rxcuis: "",
      interval: "day",
      startDate: "",
      time: "",
      loading: true
    };

    this.createNewMedicine = this.createNewMedicine.bind(this);
    this.getImage = this.getImage.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: false });
    this.props.loadingFalse();
  }

  getImage = () => {
    ImagePicker.showImagePicker({ cameraType: "back" }, response => {
      this.setState({ loading: true });
      let source = response.uri;
      this.setState({
        image: source
          ? source
          : "http://drpattydental.com/wp-content/uploads/2017/05/placeholder.png"
      });
      this.setState({ loading: false });
    });
  };

  createNewMedicine() {
    const { id } = this.props.user;
    const { image, name, description } = this.state;
    this.props.retrieveRxcuis(name).then(() => {
      if (this.props.rxcuis) {
        this.props
          .createMedicine({
            name,
            image,
            description,
            rxcuis: this.props.rxcuis,
            id
          })
          .then(res => {
            if (res.value) {
              this.props
                .createMedicineActive(
                  name,
                  image,
                  description,
                  this.props.rxcuis,
                  id
                )
                .then(response => {
                  Alert.alert("Medicine", "Medicine was sucessfully added");
                  this.props.navigation.navigate("Home");
                  this.setState({ loading: false });
                });
            } else {
              Alert.alert("Error", "Something Went Wrong");
              this.setState({ loading: false });
            }
          })
          .catch(console.log);
      } else {
        Alert.alert("Medicine not found", "Make sure the name is right!");
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { navigation, backgroundColors } = this.props;
    return this.state.loading ? (
      <Loading />
    ) : (
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail
                  source={{
                    uri: this.state.image
                  }}
                />
                <Body>
                  <TextInput
                    placeholder="Medicine Name"
                    onChangeText={e => this.setState({ name: e })}
                  />
                  <TextInput
                    note
                    placeholder="Medicine Description"
                    onChangeText={e => this.setState({ description: e })}
                  />
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <TouchableHighlight
                onPress={this.getImage}
                style={{
                  height: 350,
                  flex: 1
                }}
              >
                <Image
                  source={{
                    uri: this.state.image
                  }}
                  style={{ height: 350, flex: 1 }}
                />
              </TouchableHighlight>
            </CardItem>
          </Card>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              onPress={() => {
                this.setState({ loading: true });
                this.createNewMedicine();
              }}
              style={{ backgroundColor: this.props.backgroundColors.button }}
            >
              <Text style={{ color: this.props.backgroundColors.footer_icon }}>
                Save
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {
  createMedicine,
  retrieveRxcuis,
  addAlarm,
  createMedicineActive,
  loadingTrue,
  loadingFalse
})(Create);
