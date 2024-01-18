import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  NoSymbolIcon,
} from "react-native-heroicons/outline";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import CartItem from "../components/cart-items";
import { BASE_URL_API } from "../utils";
import Dialog from "react-native-dialog";
import OrderItem from "../components/order-items";

export default function HistoryScreen(props) {
  const navigation = useNavigation();
  const [order, setOrder] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("Giỏ hàng đang trống");
  const [phone, setPhone] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const phone = await AsyncStorage.getItem("DienMay_phone");
    if (phone) {
      await axios
        .get(`${BASE_URL_API}/orders`)
        .then((res) => {
          let orderDetails = [];
          res.data?.map((item) => {
            if (item?.customer?.phone == phone) {
              item?.order_details?.map((i) => orderDetails.push(i));
            }
          });
          setOrder(orderDetails);
        })
        .catch((e) => console.log(e.repsonse));
    } else {
      setVisible(true);
    }
  };

  const setStorage = async () => {
    await AsyncStorage.setItem("DienMay_phone", phone);
    getOrder();
    setVisible(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("DienMay_phone");
    navigation.navigate("Home");
  };

  return (
    // SafeAreaView is used to avoid the notch on the phone
    <SafeAreaView style={[styles.container]}>
      {/* SchrollView is used in order to scroll the content */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: heightPercentageToDP(0.05),
          paddingBottom: heightPercentageToDP(1),
          paddingLeft: 20,
          paddingRight: 60,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-white"
        >
          <ChevronLeftIcon strokeWidth={4.5} color="#ed1b24" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 2,
            fontSize: heightPercentageToDP(2),
            color: "#d0011b",
          }}
        >
          Lịch sử giao dịch
        </Text>
        <TouchableOpacity
          style={{ flex: 1, position: "absolute", right: 25, top: 10 }}
          onPress={logout}
          className="bg-white"
        >
          <ArrowRightOnRectangleIcon strokeWidth={2.5} color="#ed1b24" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Using the reusable header component */}

        {/* Mapping the products into the Cart component */}
        {order?.length ? (
          order?.map((order) => <OrderItem order={order} />)
        ) : (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              paddingBottom: 50,
            }}
          >
            <NoSymbolIcon size={100} color="#ed1b24" />
            <Text>Lịch sử trống</Text>
          </View>
        )}
      </ScrollView>
      {/* Creating a seperate view to show the total amount and checkout button */}
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
          navigation.goBack();
        }}
      />
      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Nhập số điện thoại</Dialog.Title>
          <Dialog.Input onChangeText={(e) => setPhone(e)}></Dialog.Input>
          <Dialog.Button label="Huỷ" onPress={() => navigation.goBack()} />
          <Dialog.Button
            label="Xác nhận"
            onPress={() => phone && setStorage()}
          />
        </Dialog.Container>
      </View>
    </SafeAreaView>
  );
}

// Styles....
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: widthPercentageToDP(90),
    marginTop: 15,
  },
  total: {
    borderTopWidth: 1,
    paddingTop: 15,
    borderTopColor: "#E5E5E5",
    marginBottom: 15,
  },
  cartTotalText: {
    fontSize: widthPercentageToDP(4.5),
    color: "#989899",
  },
});
