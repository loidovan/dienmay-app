import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { BASE_URL, BASE_URL_API } from "../utils";
import { MinusIcon, PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import Dialog from "react-native-dialog";
import { useNavigation } from "@react-navigation/native";

export default function OrderItem({ order }) {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const getStatusLabel = (number) => {
    if (number === 2) return "Hoàn thành";
    if (number === 1) return "Đã xử lý";
    return "Chờ xử lý";
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          className="px-6"
        >
          <Text style={{ color: "grey" }}>
            Ngày đặt: {order?.order?.created_at}
          </Text>
          <Text
            style={{
              color: "orange",
              fontWeight: 500,
            }}
          >
            {getStatusLabel(order?.order?.status)}
          </Text>
        </View>
        <View style={styles.container}>
          <View>
            <Pressable
              onPress={() =>
                navigation.navigate("RecipeDetail", {
                  id: order?.product?.id,
                  price: order?.product?.price,
                })
              }
            >
              <Image
                source={{ uri: `${BASE_URL}${order?.product?.image}` }}
                style={styles.image}
              />
            </Pressable>
          </View>
          <View style={styles.info}>
            <View>
              <Text style={styles.name}>{order?.product?.name}</Text>
            </View>
            <View style={styles.footer}>
              <Text style={styles.price}>
                {new Intl.NumberFormat("en-US").format(
                  order?.product?.price || ""
                )}
                ₫
              </Text>

              <Text style={styles.quantity}>{order?.quantity}</Text>
            </View>
          </View>
        </View>
      </Pressable>
      <View>
        <Dialog.Container
          contentStyle={{ width: (width * 90) / 100 }}
          visible={visible}
        >
          <Dialog.Title>CHI TIẾT ĐƠN HÀNG</Dialog.Title>
          <View className="px-5 pb-3">
            <Text style={{ color: "orange", fontWeight: 500 }}>
              THÔNG TIN NHẬN HÀNG
            </Text>
            <Text className="pt-2">
              Người nhận: {order?.order?.customer?.gender || ""}{" "}
              {order?.order?.customer?.name || ""}
            </Text>
            <Text className="pt-2">
              SĐT: {order?.order?.customer?.phone || ""}
            </Text>
            <Text className="pt-2">
              Nhận tại: {order?.order?.address || ""}
            </Text>
            <Text className="pt-2">
              Hình thức thanh toán: {order?.order?.payment || ""}
            </Text>
          </View>
          <View
            style={{ borderBottomWidth: 0.5, borderBottomColor: "grey" }}
            className="mx-5"
          ></View>
          <View className="py-3 px-5">
            <Text style={{ color: "orange", fontWeight: 500 }}>
              THÔNG TIN SẢN PHẨM
            </Text>
            <Text className="pt-2">
              Tên sản phẩm: {order?.product?.name || ""}
            </Text>
            <Text className="pt-2">
              Đơn giá:{" "}
              {new Intl.NumberFormat("en-US").format(
                order?.product?.price || ""
              )}
              ₫
            </Text>
            <Text className="pt-2">Số lượng: {order?.quantity || ""}</Text>
            <Text className="pt-2" style={{ color: "#d0011b" }}>
              Thành tiền:{" "}
              {new Intl.NumberFormat("en-US").format(
                order?.product?.price * order?.quantity || ""
              )}
              ₫
            </Text>
          </View>
          <Dialog.Button label="Đóng" onPress={() => setVisible(false)} />
        </Dialog.Container>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
