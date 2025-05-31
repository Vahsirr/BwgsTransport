
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import theme from "../../themes/Theme";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../slices/userSlice";
import { Avatar, TextInput, Button } from "react-native-paper";
import jwtService from "../../auth/services/jwtService";
import { showMessage } from "../../slices/messageSlice";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const user = useSelector(selectUser);

  const toggleHelp = () => {
    const toValue = helpExpanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setHelpExpanded(!helpExpanded);
  };

  const helpHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Adjust this value based on your content height
  });

  const navigationItems = [
    { icon: "account", title: "My Account", color: "#4285F4" },
    {
      icon: "help-circle",
      title: "Help",
      color: "#4285F4",
      isHelp: true,
      content: [
        // {
        //   title: "FAQ",
        //   description: "Frequently asked questions about our services",
        // },
        {
        title: "Contact Support",
        description: "Email: Sharmamritunjay4@gmail.com\nPhone: +91 821-0430471\nSupport Hours: Monday to Friday, 9:00 AM to 6:00 PM",
      }
      ],
    },
    // { icon: "car", title: "User Instructions", color: "#4285F4" },
    { icon: "car", title: "User Instructions", color: "#4285F4", isInstructions: true },

    { icon: "account-remove", title: "Delete My Account", color: "#FF3B30", },
    { icon: "shield-lock", title: "Privacy Policy", color: "#4285F4", isPrivacyPolicy: true },

  ];

  const handleDeleteAccount = async () => {
    if (!password) {
      dispatch(showMessage({ message: "Please enter your password", variant: "error" }));
      return;
    }

    setLoading(true);
    try {
      // Call the API to delete the account
      const response = await jwtService.deleteAccount(password);
      
      if (response.status === 200) {
        dispatch(showMessage({ message: "Account successfully deleted", variant: "success" }));
        setDeleteModalVisible(false);
        
        // Logout the user after successful account deletion
        jwtService.logout();
        // navigation.navigate("signIn");

        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "signIn" }],
        // });
      } else {
        dispatch(showMessage({ message: "Failed to delete account", variant: "error" }));
      }
    } catch (error) {
      dispatch(showMessage({ 
        message: error.response?.data?.message || "Error deleting account", 
        variant: "error" 
      }));
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Delete", 
          onPress: () => setDeleteModalVisible(true),
          style: "destructive" 
        }
      ]
    );
  };

  const renderNavigationItem = (item, index) => {
    if (item.isHelp) {
      return (
        <View key={index}>
          <TouchableOpacity style={styles.navButton} onPress={toggleHelp}>
            <View style={styles.navContent}>
              <Icon
                name={item.icon}
                size={24}
                color={item.color}
                style={styles.navIcon}
              />
              <Text style={styles.navText}>{item.title}</Text>
            </View>
            <Icon
              name={helpExpanded ? "chevron-up" : "chevron-right"}
              size={24}
              color="#C7C7CC"
            />
          </TouchableOpacity>

          <Animated.View style={[styles.helpContent, { height: helpHeight }]}>
            {item.content.map((helpItem, helpIndex) => (
              <TouchableOpacity
                key={helpIndex}
                style={styles.helpItem}
                onPress={() => {
                  /* Handle help item press */
                }}
              >
                <Text style={styles.helpItemTitle}>{helpItem.title}</Text>
                <Text style={styles.helpItemDescription}>
                  {helpItem.description}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      );
    }
if (item.isPrivacyPolicy) {
  return (
    <TouchableOpacity 
      key={index} 
      style={styles.navButton} 
      onPress={() => setPrivacyModalVisible(true)}
    >
      <View style={styles.navContent}>
        <Icon
          name={item.icon}
          size={24}
          color={item.color}
          style={styles.navIcon}
        />
        <Text style={styles.navText}>
          {item.title}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#C7C7CC" />
    </TouchableOpacity>
  );
}
// Add this condition BEFORE the final return statement
 if (item.isInstructions) {
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.navButton} 
        onPress={() => navigation.navigate("UserInstructions")}
      >
        <View style={styles.navContent}>
          <Icon
            name={item.icon}
            size={24}
            color={item.color}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>{item.title}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#C7C7CC" />
      </TouchableOpacity>
    );
  }

    // Special handling for Delete Account option
    if (item.title === "Delete My Account") {
      return (
        <TouchableOpacity 
          key={index} 
          style={styles.navButton} 
          onPress={showDeleteConfirmation}
        >
          <View style={styles.navContent}>
            <Icon
              name={item.icon}
              size={24}
              color={item.color}
              style={styles.navIcon}
            />
            <Text style={[styles.navText, styles.deleteText]}>
              {item.title}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#C7C7CC" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity key={index} style={styles.navButton} onPress={() => {}}>
        <View style={styles.navContent}>
          <Icon
            name={item.icon}
            size={24}
            color={item.color}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>
            {item.title}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {user.data.photoURL ? (
          <Avatar.Image
            size={40}
            style={styles.profileImage}
            source={{ uri: user.data.photoURL }}
          />
        ) : (
          <Avatar.Text
            size={40}
            style={styles.profileImage}
            label={user.data.name[0]}
          />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.data.name}</Text>
          <Text style={styles.profilePhone}>{user.data.mobile}</Text>
        </View>
      </View>

      {/* Navigation Items */}
      <View style={styles.navigationSection}>
        {navigationItems.map((item, index) =>
          renderNavigationItem(item, index)
        )}
      </View>

      {/* Delete Account Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
            <Text style={styles.modalDescription}>
              Please enter your password to confirm account deletion. This action cannot be undone.
            </Text>
            
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
            />
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => {
                  setDeleteModalVisible(false);
                  setPassword('');
                }}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              
              <Button 
                mode="contained" 
                onPress={handleDeleteAccount}
                loading={loading}
                disabled={loading || !password}
                style={styles.deleteButton}
              >
                Delete Account
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
  visible={privacyModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setPrivacyModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={[styles.modalContent, { height: '80%' }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={[styles.modalTitle, { color: '#000' }]}>Privacy Policy</Text>
        <Text style={styles.modalDescription}>
          <Text style={{ fontWeight: 'bold' }}>Introduction{"\n"}</Text>
          BWGS Transport is committed to protecting the privacy and security of the information of students, parents, and guardians who use our school transport services via our website and mobile application.{"\n\n"}
          
          This Privacy Policy explains how we collect, use, disclose, and protect your information when you access our transport services through the Platform.{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>1. Information We Collect{"\n"}</Text>
          a. Personal Information:{"\n"}
          - Student's name, age, class, school ID{"\n"}
          - Parent/guardian's name, contact number, email{"\n"}
          - Home and pickup/drop-off location addresses{"\n"}
          - Emergency contact details{"\n\n"}

          b. Usage Information:{"\n"}
          - Device information (type, model, OS){"\n"}
          - IP address{"\n"}
          - App usage patterns{"\n"}
          - GPS location data of buses (for real-time tracking){"\n\n"}

          c. Driver & Staff Data:{"\n"}
          - Driver's name, contact, license information{"\n"}
          - Vehicle registration and route details{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>2. How We Use Your Information{"\n"}</Text>
          - Schedule and manage bus routes{"\n"}
          - Provide real-time location tracking to parents{"\n"}
          - Ensure student safety and timely communication{"\n"}
          - Send important updates (e.g., delays, route changes){"\n"}
          - Maintain records for administrative and safety purposes{"\n"}
          - Improve our services and user experience{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>3. Sharing of Information{"\n"}</Text>
          - With authorized school staff or transport operators{"\n"}
          - With third-party service providers (only as required for service functionality, under strict confidentiality){"\n"}
          - When required by law or government authorities{"\n"}
          - In case of emergencies for safety and security reasons{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>4. Data Security{"\n"}</Text>
          We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, misuse, or alteration.{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>5. Your Rights{"\n"}</Text>
          You have the right to:{"\n"}
          - Access and update your personal data{"\n"}
          - Request deletion of your data (subject to school policy){"\n"}
          - Withdraw consent at any time (which may affect access to transport features){"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>6. Children's Privacy{"\n"}</Text>
          We collect student information only with parental or school authority consent. Our services are designed to ensure child safety and are compliant with applicable child data protection laws.{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>7. Changes to This Policy{"\n"}</Text>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>8. Contact Us{"\n"}</Text>
          If you have questions or concerns about this Privacy Policy or how your data is handled, please contact us at:{"\n\n"}
          Email: Sharmamritunjay4@gmail.com{"\n"}
          Phone: +91 821-0430471{"\n"}
          Address: BWGS DORANDA, Ranchi, PIN code:- 834002
        </Text>
      </ScrollView>

      <Button
        mode="outlined"
        onPress={() => setPrivacyModalVisible(false)}
        style={{ marginTop: 10 }}
      >
        Close
      </Button>
    </View>
  </View>
</Modal>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: theme.colors.backgroundColorSecond,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.backgroundColorSecond,
    paddingBottom: 24,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: "#666",
  },
  navigationSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    fontSize: 16,
    color: "#000000",
  },
  deleteText: {
    color: "#FF3B30",
  },
  helpContent: {
    overflow: "hidden",
    backgroundColor: "#F8F8F8",
  },
  helpItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  helpItemDescription: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF3B30',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  passwordInput: {
    width: '100%',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#FF3B30',
  },
});

export default ProfileScreen;