import React from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { auth0ClientId, auth0Domain, redirectUri } from '../auth0-configuration';

const AUTH_URL = `https://${auth0Domain}/authorize?` +
  `response_type=token&` +
  `client_id=${auth0ClientId}&` +
  `redirect_uri=${redirectUri}&` +
  `scope=openid%20profile%20email`;

export default function AuthWebView({ onSuccess }) {
  const handleNavigationChange = (event) => {
    const { url } = event;

    if (url.startsWith(redirectUri)) {
      const fragment = url.split('#')[1];
      const params = new URLSearchParams(fragment);

      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');

      if (accessToken) {
        onSuccess({ accessToken, idToken });
      }

      return false;
    }

    return true;
  };

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ uri: AUTH_URL }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        useWebKit={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        injectedJavaScriptBeforeContentLoaded={`
          const meta = document.createElement('meta');
          meta.setAttribute('name', 'viewport');
          meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
          document.getElementsByTagName('head')[0].appendChild(meta);
        `}
        onNavigationStateChange={handleNavigationChange}
        onError={(e) => console.warn('WebView error:', e.nativeEvent)}
        onHttpError={(e) => console.warn('WebView HTTP error:', e.nativeEvent)}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={{ marginTop: 50 }} />}
        scalesPageToFit={true}
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    ...(Platform.OS === 'ios' && {
      minWidth: width,
      minHeight: height,
    }),
  },
});