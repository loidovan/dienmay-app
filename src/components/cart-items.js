import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { BASE_URL, BASE_URL_API } from "../utils";
import { MinusIcon, PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";

export default function CartItem({ cart, onRefresh }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const deleteCart = async (id) => {
    if (!id) return;
    await axios
      .delete(`${BASE_URL_API}/carts/${id}`)
      .then((response) => {
        onRefresh();
      })
      .catch((e) => console.log(e?.repsonse));
  };

  const minusQty = async (id) => {
    await axios
      .put(`${BASE_URL_API}/carts/${id}`, { quantity: "-1" })
      .then((response) => {
        onRefresh();
      })
      .catch((e) => {
        if (e?.response?.data?.message) {
          setAlertMsg(e.response.data.message);
          setShowAlert(true);
        }
      });
  };

  const plusQty = async (id) => {
    await axios
      .put(`${BASE_URL_API}/carts/${id}`, { quantity: "+1" })
      .then((response) => {
        onRefresh();
      })
      .catch((e) => {
        if (e?.response?.data?.message) {
          setAlertMsg(e.response.data.message);
          setShowAlert(true);
        }
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => deleteCart(cart?.id)}>
        <XMarkIcon color={"black"} />
      </TouchableOpacity>
      <Image
        source={{ uri: `${BASE_URL}${cart?.product?.image}` }}
        style={styles.image}
      />
      <View style={styles.info}>
        <View>
          <Text style={styles.name}>{cart?.product?.name}</Text>
          {/* <Text style={styles.description}>
            {product.description} • ${product.unit_price / 100}
          </Text> */}
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>
            {new Intl.NumberFormat("en-US").format(cart?.product?.price || "")}₫
          </Text>
          <TouchableOpacity onPress={() => minusQty(cart?.id)}>
            <MinusIcon color={"grey"} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{cart?.quantity}</Text>
          <TouchableOpacity onPress={() => plusQty(cart?.id)}>
            <PlusIcon color={"grey"} />
          </TouchableOpacity>
        </View>
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title=""
        message={alertMsg}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Xác nhận"
        confirmButtonColor="#d0011b"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: "#e6e6e6",
    width: widthPercentageToDP("100%"),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: widthPercentageToDP(36),
    height: heightPercentageToDP(14),
    borderRadius: 10,
  },
  title: {
    fontSize: widthPercentageToDP(4),
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: heightPercentageToDP(2.5),
  },
  info: {
    marginLeft: widthPercentageToDP(3),
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: heightPercentageToDP(2),
    width: widthPercentageToDP(50),
  },
  description: {
    fontSize: widthPercentageToDP(3.5),
    color: "#8e8e93",
    marginTop: heightPercentageToDP(2),
  },

  price: {
    fontSize: widthPercentageToDP(4),
    color: "#d0011b",
  },
  quantity: {
    fontSize: widthPercentageToDP(4),
  },
});
