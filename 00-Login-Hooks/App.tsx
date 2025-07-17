import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import AuthWebView from './components/AuthWebView';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokens, setTokens] = useState<{accessToken: string; idToken: string} | null>(null);
  const [showWebView, setShowWebView] = useState(false);

  const handleLoginSuccess = (tokens: {accessToken: string; idToken: string}) => {
    setTokens(tokens);
    setIsLoggedIn(true);
    setShowWebView(false);
    Alert.alert('Logged in!', 'Access Token: ' + tokens.accessToken);
  };

  const handleLogout = () => {
    setTokens(null);
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Auth0Sample - Seamless Login </Text>
      {showWebView ? (
        <AuthWebView onSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Text>
            {isLoggedIn ? 'You are logged in.' : 'You are not logged in.'}
          </Text>
          <Button
            onPress={isLoggedIn ? handleLogout : () => setShowWebView(true)}
            title={isLoggedIn ? 'Log Out' : 'Log In'}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
