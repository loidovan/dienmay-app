import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { categoryData } from "../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import { CachedImage } from "../helpers/image";
import UserAvatar from "react-native-user-avatar";

const avatarImgs = [
  "https://media.istockphoto.com/id/628736088/fr/photo/t%C3%A9l%C3%A9viseur-r%C3%A9tro-isol%C3%A9-sur-fond-blanc-communication-m%C3%A9dias.jpg?s=612x612&w=0&k=20&c=UNL0DzvpNWyyDnzZwez5gSZPenX0fS7Xpni5WB4t3gE=",
  "https://media.istockphoto.com/id/1041825506/vi/anh/m%E1%BB%9F-t%E1%BB%A7-l%E1%BA%A1nh-t%E1%BB%AB-b%C3%AAn-trong.jpg?s=612x612&w=0&k=20&c=_Z0DhtFimtl9oD9LmlE8UqfvOSMctY0cfJk3EU_bkPQ=",
  "https://media.istockphoto.com/id/1355251759/vi/anh/nh%C3%ACn-t%E1%BB%AB-m%C3%A1y-gi%E1%BA%B7t-v%E1%BB%9Bi-n%C6%B0%E1%BB%9Bc-%E1%BA%A3nh-minh-h%E1%BB%8Da-3d.jpg?s=612x612&w=0&k=20&c=NvNMUfQ3DPoXwANRfCsd_gz8oTbJ_3X-PgjilzPoYUc=",
  "https://media.istockphoto.com/id/1067915554/vi/anh/b%C3%A0n-tay-nam-%C4%91ang-%C4%91%E1%BB%95-n%C6%B0%E1%BB%9Bc-l%E1%BA%A1nh-v%C3%A0-%C4%91%C3%A1-vi%C3%AAn-t%E1%BB%AB-b%E1%BB%99-ph%C3%A2n-ph%E1%BB%91i-t%E1%BB%A7-l%E1%BA%A1nh-gia-%C4%91%C3%ACnh.jpg?s=612x612&w=0&k=20&c=dDtv5xCAdvEXds8N2WPlJVhm9SFTw28WPwtAnzdiQCQ=",
  "https://media.istockphoto.com/id/1409343543/vi/anh/b%C6%A1m-nhi%E1%BB%87t-kh%C3%B4ng-kh%C3%AD-%C4%91%E1%BB%83-l%C3%A0m-m%C3%A1t-ho%E1%BA%B7c-s%C6%B0%E1%BB%9Fi-%E1%BA%A5m-ng%C3%B4i-nh%C3%A0.jpg?s=612x612&w=0&k=20&c=HSvb82Z5XliHciqKBXOrFjC2-aKdOFnL0rCoFSo19RU=",
  "https://hips.hearstapps.com/hmg-prod/images/gh-113021-ghi-best-fridges-1638385441.png?crop=0.486xw:0.746xh;0.0385xw,0.160xh&resize=640:*",
  "https://media.istockphoto.com/id/1321306931/vi/anh/m%C3%A1y-chi%C3%AAn-kh%C3%B4ng-kh%C3%AD-n%E1%BA%A5u-khoai-t%C3%A2y-chi%C3%AAn-trong-nh%C3%A0-b%E1%BA%BFp-l%E1%BB%91i-s%E1%BB%91ng-c%E1%BB%A7a-n%E1%BA%A5u-%C4%83n-b%C3%ACnh-th%C6%B0%E1%BB%9Dng-m%E1%BB%9Bi.jpg?s=612x612&w=0&k=20&c=qxS9gOEDeBukXSQB8WH9riqQ9clQrLDzhaGMi9G1uHM=",
  "https://hips.hearstapps.com/hmg-prod/images/washing-machine-at-blue-wall-frontal-view-with-copy-royalty-free-image-1096523200-1564593294.jpg?crop=0.645xw:1.00xh;0.179xw,0&resize=1200:*",
  "https://hoangngan.vn/anhdaidien/2023/05/18/may-loc-nuoc-ion-kiem-kangen-leveluk-k8_1684426414.png",
  "https://static.toiimg.com/thumb/msid-98004948,width-1280,resizemode-4/98004948.jpg",
  "https://thegioilocnuoc.vn/public/uploaded/product/product_201.jpg",
  "https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/1801c418208f9607a371e61f8d9184d9/1/4/144457_2020_2.jpg",
  "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/news/mtsp-gia-dung/NOI-CO~1.JPG",
];

export default function Categories({
  categories,
  activeCategory,
  handleChangeCategory,
}) {
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {categories.map((cat, index) => {
          let isActive = cat.strCategory == activeCategory;
          let activeButtonClass = isActive ? " bg-amber-500" : " bg-black/10";
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCategory(cat.id)}
              className="flex items-center space-y-1"
            >
              <View className={"rounded-full p-[6px] " + activeButtonClass}>
                <Image
                  source={{
                    uri:
                      avatarImgs[index] ||
                      avatarImgs[Math.floor(Math.random() * avatarImgs.length)],
                  }}
                  style={{ width: hp(6), height: hp(6) }}
                  className="rounded-full"
                />
                {/* <CachedImage
                  uri={
                    "https://media.istockphoto.com/id/628736088/fr/photo/t%C3%A9l%C3%A9viseur-r%C3%A9tro-isol%C3%A9-sur-fond-blanc-communication-m%C3%A9dias.jpg?s=612x612&w=0&k=20&c=UNL0DzvpNWyyDnzZwez5gSZPenX0fS7Xpni5WB4t3gE="
                  }
                  style={{ width: hp(6), height: hp(6) }}
                  className="rounded-full"
                /> */}
                {/* <UserAvatar size={60} name={cat.name} bgColor="#ed1c24" /> */}
              </View>
              <Text className="text-neutral-600" style={{ fontSize: hp(1.6) }}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
