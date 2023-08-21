import _, {set} from 'lodash';
import {observer} from 'mobx-react';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

import {useFocusEffect, useRoute} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import searchStore from '../../../../common/store/search.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {IItem} from '../../interfaces/base-dto/item.interface';
import {
  IGetItemsPaginatedReq,
  IGetItemsPaginatedRes,
} from '../../interfaces/items';
import * as i from '../../services/items.service';
import BottomMenu from './components/bottom-menu';
import FilterMenu from './components/filter-menu';
import {PropsProductsScreen} from './props-products-screen';
import styles from './styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

// import { FeatherIcon } from 'react-native-vector-icons/Feather';

const ProductsScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<PropsProductsScreen>();
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<IItem[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [bottomMenuVisible, setBottomMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const [reqDto, setReqDto] = useState<IGetItemsPaginatedReq>({
    groupId: groupStore.id,
    page: 1,
    limit: 5,
    search: '',
    searchBy: ['groupProduct.name'],
    sortBy: ['groupProduct.name:ASC', 'timestamp.createdAt:ASC'],
    filter: {
      'timestamp.deletedAt': '$eq:$null',
    },
  });

  // filter
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<string | null>(null);
  const [bestBeforeDate, setBestBeforeDate] = useState<string | null>(null);
  const [storageLocation, setStorageLocation] = useState<string | null>(null);
  const [purchaseLocation, setPurchaseLocation] = useState<string | null>(null);

  const openFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const handleSortByChange = (value: string | null) => {
    setSortBy(value);
  };

  const handleStockStatusChange = (value: string | null) => {
    setStockStatus(value);
  };

  const handleBestBeforeDateChange = (value: string | null) => {
    setBestBeforeDate(value);
  };

  const handleStorageLocationChange = (value: string | null) => {
    setStorageLocation(value);
  };

  const handlePurchaseLocationChange = (value: string | null) => {
    setPurchaseLocation(value);
  };

  const tags = {
    runningOutOfStock: {
      text: 'Sắp hết',
    },
    outOfStock: {
      text: 'Hết',
    },
  };

  const [resDto, setResDto] = useState<IGetItemsPaginatedRes>({
    data: [],
    message: '',
    statusCode: 0,
    links: {},
    meta: {},
  });

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  const fetchMoreData = () => {
    console.log('fetchMoreData');

    if (groupStore.id === '' || !groupStore.id) {
      return;
    }

    if (!resDto?.links?.next) {
      return;
    }

    // update page
    setReqDto(prevReqDto => ({
      ...prevReqDto,
      page: prevReqDto.page! + 1,
    }));
  };

  useEffect(() => {
    requestCameraPermission();
    appStore.setSearchActive(true);
    searchStore.setSearchText('');
    searchStore.setIsPerformingSearch(false);

    if (groupStore.id === '' || !groupStore.id) {
      return;
    }

    // reset searchActive when unmount
    return () => {
      appStore.setSearchActive(false);
      searchStore.setSearchText('');
    };
  }, []);

  useEffect(() => {
    if (groupStore.id === '' || !groupStore.id) {
      return;
    }

    setIsLoading(true);

    // fetch the first 10 items
    i.getItemPaginated(reqDto).then(res => {
      console.log('res getItemPaginated: ', res.data.length);
      setResDto(_.cloneDeep(res));

      if (reqDto.page === 1) {
        setItems(_.cloneDeep(res.data));
      } else {
        setItems([...items, ...res.data]);
      }
      setIsLoading(false);
    });
  }, [reqDto]);

  // watch for groupStore.id change
  useEffect(() => {
    // reset page to 1
    setReqDto(prevReqDto => ({
      ...prevReqDto,
      page: 1,
      groupId: groupStore.id,
      search: searchStore.searchText,
    }));
  }, [groupStore.id]);

  // listen to the search text change
  useEffect(() => {
    console.log('search text changed, ', searchStore.searchText);
    if (searchStore.isPerformingSearch) {
      // search result changed
      console.log('btn search pressed, ready to perform searching');

      // reset page to 1
      setReqDto(prevReqDto => ({
        ...prevReqDto,
        page: 1,
        search: searchStore.searchText,
      }));

      // reset search text and isPerformingSearch
      // searchStore.setSearchText('');
      searchStore.setIsPerformingSearch(false);
    }
  }, [searchStore.searchText, searchStore.isPerformingSearch]);

  const openCamera = useCallback(() => {
    setModalVisible(false);
    setShowCamera(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      //reset page to 1
      setReqDto(prevReqDto => ({
        ...prevReqDto,
        page: 1,
        search: searchStore.searchText,
      }));
    }, []),
  );

  const renderCamera = () => {
    if (!showCamera) {
      return <View style={{flex: 1}} />;
    } else if (!device) {
      return <Text>No camera device available</Text>;
    } else {
      return (
        <View>
          <Camera
            style={{flex: 1, width: '100%', height: '100%'}}
            device={device}
            isActive={true}
            enableZoomGesture
          />
        </View>
      );
    }
  };

  const renderTag = (item: IItem) => {
    if (item.quantity !== undefined && item.quantity === 0) {
      return (
        <View style={[styles.prodTag, styles.prodTagOutOfStock]}>
          <Text style={[styles.prodTagText, styles.prodTagTextOutOfStock]}>
            {tags.outOfStock.text}
          </Text>
        </View>
      );
    } else if (item.quantity !== undefined && item.quantity <= 3) {
      return (
        <View style={[styles.prodTag, styles.prodTagRunningOutOfStock]}>
          <Text
            style={[styles.prodTagText, styles.prodTagTextRunningOutOfStock]}>
            {tags.runningOutOfStock.text}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const renderItem = (item: IItem) => {
    return (
      <TouchableOpacity
        style={[
          styles.productItemContainer,
          selectedItemId === item.id && styles.selectedItemHighlight,
        ]}
        key={item.id}
        onLongPress={() => {
          console.log('onLongPress item: ', item.id);

          setSelectedItemId(item.id!);
          setBottomMenuVisible(true);
        }}>
        <Image
          source={{
            uri: item?.image || IMAGE_URI_DEFAULT,
          }}
          style={styles.prodImg}
        />

        {renderTag(item)}
        <View style={styles.productInfoContainer}>
          <View style={styles.productInfo}>
            {/* <Text style={[styles.text, {fontWeight: 'bold'}]}>
              Tên sản phẩm:{' '}
            </Text> */}
            <Text style={styles.infoText} numberOfLines={3}>
              {item?.groupProduct?.name || 'Chưa có tên sản phẩm'}
            </Text>
          </View>

          <View style={styles.productInfo}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: 30,
                }}>
                <MaterialCommunityIcons name="warehouse" size={20} />
              </View>
              <Text style={styles.infoText}>
                {' '}
                {item?.storageLocation?.name ?? 'Không rõ'}
              </Text>
            </View>
          </View>

          <View style={styles.productInfo}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: 30,
                }}>
                <MaterialCommunityIcons name="shopping" size={20} />
              </View>
              <Text style={styles.infoText}>
                {' '}
                {item?.purchaseLocation?.name ?? 'Không rõ'}
              </Text>
            </View>
          </View>

          {item?.quantity || item.quantity === 0 ? (
            <View style={styles.productInfo}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                Số lượng:{' '}
              </Text>
              <Text style={styles.infoText}>
                {item?.quantity} {item?.unit || ''}
              </Text>
            </View>
          ) : (
            false
          )}
          {item?.bestBefore ? (
            <View style={styles.productInfo}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>HSD: </Text>
              <Text style={styles.infoText}>
                {moment(item?.bestBefore).isValid()
                  ? moment(item?.bestBefore).format('DD-MM-YYYY')
                  : item?.bestBefore.toString()}
              </Text>
            </View>
          ) : (
            false
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        ...styles.container,
        paddingBottom: 50,
      }}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Danh sách sản phẩm</Text>
        <TouchableOpacity onPress={openFilterModal}>
          <AntDesignIcon name="filter" size={24} color={Colors.text.orange} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('open modal add product');

            setModalVisible(true);
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.text.orange}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <View style={styles.modalContentContainer}>
            <View style={styles.modalTitleContainer}>
              <View
                style={{
                  width: '15%',
                }}
              />
              <Text style={styles.modalTitle}>Thêm sản phẩm</Text>
              <TouchableOpacity
                style={{
                  width: '15%',
                }}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Ionicons
                  name="close"
                  size={22}
                  color={Colors.text.orange}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptionsContainer}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate(RouteNames.SCAN_BARCODE, {});
                }}>
                <AntDesignIcon
                  name="barcode"
                  size={30}
                  color={Colors.icon.orange}
                />
                <Text style={{fontWeight: 'bold', color: Colors.text.orange}}>
                  Quét barcode
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate(
                    RouteNames.ADD_PRODUCT_INFO as never,
                    {} as never,
                  );
                }}>
                <AntDesignIcon
                  name="edit"
                  size={30}
                  color={Colors.icon.orange}
                />
                <Text style={{fontWeight: 'bold', color: Colors.text.orange}}>
                  Nhập thông tin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={items}
        keyExtractor={item =>
          item?.id?.toString() ?? new Date().getTime().toString()
        }
        renderItem={({item}) => renderItem(item)}
        contentContainerStyle={styles.container}
        onEndReached={fetchMoreData} // Add your function to fetch more data here
        onEndReachedThreshold={0.2} // Adjust the threshold as needed
        ListEmptyComponent={() => {
          if (!isLoading) {
            return (
              <View
                style={{
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    color: Colors.text.grey,
                  }}>
                  Không có sản phẩm
                  <Text
                    style={{
                      color: Colors.text.orange,
                    }}>
                    {searchStore.searchText.length > 0
                      ? ' ' + searchStore.searchText + ' '
                      : ' '}
                  </Text>
                  nào
                </Text>
              </View>
            );
          } else {
            return null;
          }
        }}
        ListFooterComponent={() => {
          if (isLoading) {
            return (
              <View>
                <Text
                  style={{
                    color: Colors.text.grey,
                  }}>
                  Đang tải ...
                </Text>
              </View>
            );
          } else {
            if (resDto?.data?.length > 0 && !resDto?.links?.next) {
              return (
                <View>
                  <Text
                    style={{
                      color: Colors.text.grey,
                    }}>
                    Hết
                  </Text>
                </View>
              );
            } else {
              return null;
            }
          }
        }}
      />
      <BottomMenu
        isVisible={bottomMenuVisible}
        onClose={() => {
          setBottomMenuVisible(false);
          setSelectedItemId(null);
        }}
        onUse={() => {
          // Handle "Use" option
          setBottomMenuVisible(false);
        }}
        onUpdate={() => {
          // Handle "Update" option
          setBottomMenuVisible(false);
        }}
        onDelete={() => {
          // Handle "Delete" option
          setBottomMenuVisible(false);
        }}
        onDetail={() => {
          // Handle "Detail" option
          setBottomMenuVisible(false);
        }}
      />

      <FilterMenu
        curReqDto={reqDto}
        isVisible={isFilterModalVisible}
        onClose={closeFilterModal}
        onSortByChange={handleSortByChange}
        onStockStatusChange={handleStockStatusChange}
        onBestBeforeDateChange={handleBestBeforeDateChange}
        onStorageLocationChange={handleStorageLocationChange}
        onPurchaseLocationChange={handlePurchaseLocationChange}
      />
    </View>
  );
};

export default observer(ProductsScreen);
