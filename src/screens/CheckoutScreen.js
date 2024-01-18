import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { RadioGroup } from "react-native-radio-buttons-group";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import SelectDropdown from "react-native-select-dropdown";
import { BASE_URL, BASE_URL_API } from "../utils";
import CheckBox from "react-native-check-box";
import AwesomeAlert from "react-native-awesome-alerts";

export const CheckoutScreen = (props) => {
  const navigation = useNavigation();
  const propsData = props.route.params;

  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [otherPeopleGender, setOtherPeopleGender] = useState("");
  const [otherPeopleName, setOtherPeopleName] = useState("");
  const [otherPeoplePhone, setOtherPeoplePhone] = useState("");
  const [otherPeopleReceive, setOtherPeopleReceive] = useState(false);
  const [payment, setPayment] = useState("");
  const [phone, setPhone] = useState("");
  const [wayReceive, setWayReceive] = useState("");
  const [form, setForm] = useState({});
  const [provinceId, setProvinceId] = useState([]);
  const [districtId, setDistrictId] = useState([]);
  const [wardId, setWardId] = useState([]);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const districtRef = useRef(null);
  const wardRef = useRef(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("Đặt hàng thành công");

  const genderOptions = useMemo(
    () => [
      {
        id: "Anh", // acts as primary key, should be unique and non-empty string
        label: "Anh",
        color: "#d0011b",
      },
      {
        id: "Chị",
        label: "Chị",
        color: "#d0011b",
      },
    ],
    []
  );

  const receiveOptions = useMemo(
    () => [
      {
        id: "Giao tận nơi", // acts as primary key, should be unique and non-empty string
        label: "Giao tận nơi",
        color: "#d0011b",
      },
      {
        id: "Nhận tại siêu thị",
        label: "Nhận tại siêu thị",
        color: "#d0011b",
      },
    ],
    []
  );

  const paymentOptions = useMemo(
    () => [
      {
        id: "Tiền mặt", // acts as primary key, should be unique and non-empty string
        label: "Tiền mặt",
        color: "#d0011b",
      },
      {
        id: "Điện tử",
        label: "Điện tử",
        color: "#d0011b",
      },
    ],
    []
  );

  useEffect(() => {
    getProvinces();
  }, []);
  useEffect(() => {
    if (provinceId) {
      districtRef.current.reset();
      wardRef.current.reset();
      getDistricts();
    }
  }, [provinceId]);
  useEffect(() => {
    if (districtId) {
      wardRef.current.reset();
      getWards();
    }
  }, [districtId]);

  const getProvinces = async () => {
    setDistrictId(null);
    setWardId(null);
    await axios.post(`${BASE_URL_API}/getProvinces`).then((res) => {
      setProvinces(res.data);
    });
  };
  const getDistricts = async () => {
    setWardId(null);
    await axios
      .post(`${BASE_URL_API}/getDistricts`, {
        province_id: provinceId,
      })
      .then((res) => {
        setDistricts(res.data);
      });
  };
  const getWards = async () => {
    await axios
      .post(`${BASE_URL_API}/getWards`, { district_id: districtId })
      .then((res) => {
        setWards(res.data);
      });
  };

  // Function to handle the user's input
  const handleChange = () => {
    // Creating an object to store the user's input
    let form = {
      address,
      gender,
      name,
      note,
      otherPeopleGender,
      otherPeopleName,
      otherPeoplePhone,
      otherPeopleReceive,
      payment,
      phone,
      wayReceive,
    };
    // Calling the onChange function and passing the address object as an argument
    setForm(form);
  };

  const onSubmit = async () => {
    await axios
      .post(`${BASE_URL_API}/orders`, {
        carts: propsData?.cart,
        form,
        province_id: provinceId,
        district_id: districtId,
        ward_id: wardId,
        hostName: BASE_URL,
        totalPrice: propsData?.totalPrice,
      })
      .then((res) => {
        if (res?.data?.url) {
          Linking.openURL(res.data.url);
        }
        setAlertMsg("Đặt hàng thành công");
      })
      .catch((e) => {
        if (e?.response?.data?.message) {
          setAlertMsg(e.response.data.message);
        }
      })
      .finally(() => setShowAlert(true));
  };

  return (
    // Creating a view to hold the user's input
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          borderBottomWidth: heightPercentageToDP(0.05),
          paddingBottom: heightPercentageToDP(1),
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full ml-5 bg-white"
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
          Thanh toán
        </Text>
      </View>
      <ScrollView
        className="px-5 pt-5"
        style={{ flexGrow: 1, display: "flex" }}
      >
        <Text className="text-lg">Thông tin khách hàng</Text>
        <RadioGroup
          radioButtons={genderOptions}
          onPress={(id) => {
            setGender(id);
            setForm({ ...form, gender: id });
          }}
          selectedId={gender}
          layout="row"
          containerStyle={{ marginLeft: -10 }}
        />
        <TextInput
          onChangeText={(e) => {
            setName(e);
            handleChange();
          }}
          placeholder="Họ tên"
          style={styles.input}
        />
        <TextInput
          onChangeText={(e) => {
            setPhone(e);
            handleChange();
          }}
          placeholder="Số điện thoại"
          style={styles.input}
        />
        <Text className="text-lg mt-4">Cách thức nhận hàng</Text>
        <RadioGroup
          radioButtons={receiveOptions}
          onPress={(id) => {
            setWayReceive(id);
            setForm({ ...form, wayReceive: id });
          }}
          selectedId={wayReceive}
          layout="row"
          containerStyle={{ marginLeft: -10 }}
        />
        <SelectDropdown
          data={provinces}
          defaultButtonText="Chọn Tỉnh / Thành Phố"
          onSelect={(selectedItem) => {
            setProvinceId(selectedItem);
            handleChange();
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
          buttonStyle={{
            width: "100%",
            height: 40,
            borderRadius: 4,
            backgroundColor: "white",
            borderWidth: 0.1,
            marginTop: 10,
          }}
          buttonTextStyle={{
            fontSize: 13,
            textAlign: "left",
          }}
        />
        <SelectDropdown
          data={districts}
          ref={districtRef}
          defaultButtonText="Chọn Quận / Huyện"
          onSelect={(selectedItem) => {
            setDistrictId(selectedItem);
            handleChange();
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
          buttonStyle={{
            width: "100%",
            height: 40,
            borderRadius: 4,
            backgroundColor: "white",
            borderWidth: 0.1,
            marginTop: 10,
          }}
          buttonTextStyle={{
            fontSize: 13,
            textAlign: "left",
          }}
        />
        <SelectDropdown
          data={wards}
          defaultButtonText="Chọn Phường / Xã"
          ref={wardRef}
          onSelect={(selectedItem) => {
            setWardId(selectedItem);
            handleChange();
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
          buttonStyle={{
            width: "100%",
            height: 40,
            borderRadius: 4,
            backgroundColor: "white",
            borderWidth: 0.1,
            marginTop: 10,
          }}
          buttonTextStyle={{
            fontSize: 13,
            textAlign: "left",
          }}
        />
        <TextInput
          onChangeText={(e) => {
            setAddress(e);
            handleChange();
          }}
          placeholder="Số nhà, tên đường"
          style={styles.input}
        />
        <TextInput
          onChangeText={(e) => {
            setNote(e);
            handleChange();
          }}
          placeholder="Yêu cầu khác (không bắt buộc)"
          style={styles.input}
        />
        <CheckBox
          style={{ flex: 1, paddingTop: 12 }}
          onClick={() => {
            if (otherPeopleReceive) {
              setOtherPeopleGender("");
              setOtherPeopleName("");
              setOtherPeoplePhone("");
              return setOtherPeopleReceive(false);
            }
            return setOtherPeopleReceive(true);
          }}
          isChecked={otherPeopleReceive}
          rightText={"Gọi người khác nhận hàng (nếu có)"}
          checkBoxColor="#d0011b"
        />
        {otherPeopleReceive && (
          <View
            style={{
              backgroundColor: "#f8f9fa",
              padding: 12,
              borderRadius: 5,
              marginTop: 12,
            }}
          >
            <RadioGroup
              radioButtons={genderOptions}
              onPress={(id) => {
                setOtherPeopleGender(id);
                setForm({ ...form, otherPeopleGender: id });
              }}
              selectedId={otherPeopleGender}
              layout="row"
              containerStyle={{ marginLeft: -10 }}
            />
            <TextInput
              onChangeText={(e) => {
                setOtherPeopleName(e);
                handleChange();
              }}
              placeholder="Họ tên"
              style={{ ...styles.input, backgroundColor: "white" }}
            />
            <TextInput
              onChangeText={(e) => {
                setOtherPeoplePhone(e);
                handleChange();
              }}
              placeholder="Số điện thoại"
              style={{ ...styles.input, backgroundColor: "white" }}
            />
          </View>
        )}
        <Text className="text-lg mt-4">Chọn hình thức thanh toán</Text>
        <RadioGroup
          radioButtons={paymentOptions}
          onPress={(id) => {
            setPayment(id);
            setForm({ ...form, payment: id });
          }}
          selectedId={payment}
          layout="row"
          containerStyle={{ marginLeft: -10 }}
        />
        <View style={{ marginBottom: 30 }}></View>
      </ScrollView>
      <View className="px-5">
        <View style={[styles.row, styles.total]}>
          <Text style={styles.cartTotalText}>Tổng tiền</Text>
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {new Intl.NumberFormat("en-US").format(propsData?.totalPrice || "")}
            ₫
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#d0011b",
            borderRadius: 20,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {/* A button to navigate to checkout screen */}
          <TouchableOpacity
            style={{ width: "100%" }}
            large={true}
            onPress={onSubmit}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                width: "100%",
                textAlign: "center",
              }}
            >
              Xác nhận
            </Text>
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
          navigation.navigate("Home");
        }}
      />
    </SafeAreaView>
  );
};

// Creating a stylesheet to style the view
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: heightPercentageToDP(8),
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderColor: "#E5E5E5",
    borderRadius: 5,
    marginTop: 10.2,
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
