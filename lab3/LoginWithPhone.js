import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const PhoneNumberLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');

  const sendVerificationCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmation);
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  const confirmCode = async () => {
    try {
      await confirmation.confirm(verificationCode);
      console.log('User signed in successfully.');
    } catch (error) {
      console.error('Error confirming code:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <Button title="Send Verification Code" onPress={sendVerificationCode} />

      {confirmation && (
        <View>
          <TextInput
            placeholder="Enter verification code"
            value={verificationCode}
            onChangeText={(text) => setVerificationCode(text)}
          />
          <Button title="Confirm Code" onPress={confirmCode} />
        </View>
      )}
    </View>
  );
};

export default PhoneNumberLogin;
