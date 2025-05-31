import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomDropdown = ({ label, value, items, onSelect, placeholder, width = '100%' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ width }}>
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text
          style={{
            color: value ? '#000' : '#D3D3D3',
            fontSize: wp('3.8%'),
            fontFamily: 'Inter_400Regular',
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <ScrollView>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={{ color: '#000', fontSize: wp('3.8%'), fontFamily: 'Inter_400Regular' }}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.5%'),
    fontFamily: 'Inter_700Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: wp('2%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('2%'),
    backgroundColor: '#fff',
    fontSize: wp('3.8%'),
    fontFamily: 'Inter_400Regular',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp('75%'),
    maxHeight: hp('40%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('3%'),
  },
  option: {
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default CustomDropdown;