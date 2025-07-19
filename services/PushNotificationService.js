import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class PushNotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize push notifications
  async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      // Get the token that uniquely identifies this device
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Get push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }

      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      
      this.expoPushToken = pushToken.data;
      console.log('Push token:', pushToken.data);

      // Store token in AsyncStorage
      await AsyncStorage.setItem('expoPushToken', pushToken.data);

      // Register token with backend
      await this.registerTokenWithBackend(pushToken.data);

      return pushToken.data;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return null;
    }
  }

  // Register token with your backend
  async registerTokenWithBackend(token) {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) return;

      const user = JSON.parse(userData);
      const userId = user._id || user.id;

      if (!userId) return;

      const response = await fetch('https://walktograveweb-backendserver.onrender.com/api/users/register-push-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          pushToken: token,
          platform: Platform.OS,
        }),
      });

      if (response.ok) {
        console.log('Push token registered with backend successfully');
      } else {
        console.error('Failed to register push token with backend');
      }
    } catch (error) {
      console.error('Error registering push token with backend:', error);
    }
  }

  // Set up notification listeners
  setupNotificationListeners() {
    // Listen for notifications received while app is running
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listen for user interactions with notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Handle notification received
  handleNotificationReceived(notification) {
    const { title, body, data } = notification.request.content;
    
    // Update notification badge
    this.updateNotificationBadge();
    
    // Store notification locally for in-app display
    this.storeNotificationLocally(notification);
  }

  // Handle notification tap/response
  handleNotificationResponse(response) {
    const { notification } = response;
    const { data } = notification.request.content;
    
    // Navigate based on notification type
    if (data?.type === 'service_added' || data?.type === 'service_updated') {
      // Navigate to services screen
      console.log('Navigate to services screen');
    } else if (data?.type === 'faq_added' || data?.type === 'faq_updated') {
      // Navigate to FAQ screen
      console.log('Navigate to FAQ screen');
    }
  }

  // Store notification locally
  async storeNotificationLocally(notification) {
    try {
      const existingNotifications = await AsyncStorage.getItem('localNotifications');
      const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      
      const newNotification = {
        id: notification.request.identifier,
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      notifications.unshift(newNotification);
      
      // Keep only last 50 notifications
      const limitedNotifications = notifications.slice(0, 50);
      
      await AsyncStorage.setItem('localNotifications', JSON.stringify(limitedNotifications));
    } catch (error) {
      console.error('Error storing notification locally:', error);
    }
  }

  // Get local notifications
  async getLocalNotifications() {
    try {
      const notifications = await AsyncStorage.getItem('localNotifications');
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Error getting local notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const notifications = await this.getLocalNotifications();
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      
      await AsyncStorage.setItem('localNotifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Update notification badge
  async updateNotificationBadge() {
    try {
      const notifications = await this.getLocalNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;
      
      await Notifications.setBadgeCountAsync(unreadCount);
    } catch (error) {
      console.error('Error updating notification badge:', error);
    }
  }

  // Get unread notification count
  async getUnreadCount() {
    try {
      const notifications = await this.getLocalNotifications();
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Send local notification (for testing)
  async sendLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
  }

  // Cleanup listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Get push token
  getPushToken() {
    return this.expoPushToken;
  }
}

export default new PushNotificationService();
