import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../themes/Theme'; // Adjust path as needed

const UserInstructionsScreen = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Guide</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.mainTitle}>BWGS Transport App User Guide</Text>
        
        {/* Bus Tracking Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('tracking')}
          >
            <Text style={styles.sectionTitle}>How to Track Your Bus</Text>
            <Icon 
              name={activeSection === 'tracking' ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#4285F4"
            />
          </TouchableOpacity>
          
          {activeSection === 'tracking' && (
            <View style={styles.sectionContent}>
              <View style={styles.stepCard}>
                <Text style={styles.stepTitle}>Step 1: Login to Your Account</Text>
                <Text style={styles.stepDescription}>
                  Open the BWGS Transport app and login using your registered email/mobile number and password.
                </Text>
              </View>
              
              <View style={styles.stepCard}>
                <Text style={styles.stepTitle}>Step 2: Navigate to Dashboard</Text>
                <Text style={styles.stepDescription}>
                  After logging in, you will be directed to the dashboard. If not, tap on the "Dashboard" option from the bottom navigation menu.
                </Text>
              </View>
              
              <View style={styles.stepCard}>
                <Text style={styles.stepTitle}>Step 3: Tap on "Track" Button</Text>
                <Text style={styles.stepDescription}>
                  On the dashboard, locate and tap the "Track" button. This button is prominently displayed in the center of your dashboard.
                </Text>
              </View>
              
              <View style={styles.stepCard}>
                <Text style={styles.stepTitle}>Step 4: View the Tracking Map</Text>
                <Text style={styles.stepDescription}>
                  The app will open a map showing three key locations:
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>• Your current location (blue dot)</Text>
                  <Text style={styles.listItem}>• Bus location (bus icon)</Text>
                  <Text style={styles.listItem}>• Bus stop location (stop sign icon)</Text>
                </View>
                <Text style={styles.stepDescription}>
                  The map will also display the distance between:
                </Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>• You and the bus stop</Text>
                  <Text style={styles.listItem}>• The bus and the bus stop</Text>
                  <Text style={styles.listItem}>• You and the bus</Text>
                </View>
              </View>
              
              <View style={[styles.stepCard, styles.noteCard]}>
                <Text style={styles.noteTitle}>Important Notes About Tracking</Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>• The app requires location permission to function properly.</Text>
                  <Text style={styles.listItem}>• Real-time updates occur every 30 seconds.</Text>
                  <Text style={styles.listItem}>• The tracking feature works best with a stable internet connection.</Text>
                  <Text style={styles.listItem}>• Consider disabling battery optimization for the app.</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        
        {/* Delete Account Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('delete')}
          >
            <Text style={styles.sectionTitle}>How to Delete Your Account</Text>
            <Icon 
              name={activeSection === 'delete' ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#FF3B30"
            />
          </TouchableOpacity>
          
          {activeSection === 'delete' && (
            <View style={styles.sectionContent}>
              <View style={[styles.stepCard, styles.deleteCard]}>
                <Text style={styles.deleteStepTitle}>Step 1: Go to Profile Settings</Text>
                <Text style={styles.stepDescription}>
                  Login to your account and tap on the "Profile" icon in the bottom navigation menu. Then select "Settings" from the profile page.
                </Text>
              </View>
              
              <View style={[styles.stepCard, styles.deleteCard]}>
                <Text style={styles.deleteStepTitle}>Step 2: Select "Delete Account"</Text>
                <Text style={styles.stepDescription}>
                  Scroll down to the bottom of the Settings page and tap on the "Delete Account" button.
                </Text>
              </View>
              
              <View style={[styles.stepCard, styles.deleteCard]}>
                <Text style={styles.deleteStepTitle}>Step 3: Confirm with Password</Text>
                <Text style={styles.stepDescription}>
                  A confirmation dialog will appear asking you to enter your password to verify your identity.
                </Text>
              </View>
              
              <View style={[styles.stepCard, styles.deleteCard]}>
                <Text style={styles.deleteStepTitle}>Step 4: Final Confirmation</Text>
                <Text style={styles.stepDescription}>
                  After entering your password, you will receive a final confirmation warning. Tap on "Delete My Account" to permanently delete your account.
                </Text>
              </View>
              
              <View style={[styles.stepCard, styles.noteCard]}>
                <Text style={styles.noteTitle}>Important Information</Text>
                <View style={styles.listContainer}>
                  <Text style={styles.listItem}>• Account deletion is permanent and cannot be undone.</Text>
                  <Text style={styles.listItem}>• All your data will be removed within 30 days.</Text>
                  <Text style={styles.listItem}>• Any active services will be terminated immediately.</Text>
                  <Text style={styles.listItem}>• You'll need to create a new account for future use.</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        
        {/* Help & Support */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need Additional Help?</Text>
          <Text style={styles.supportText}>
            If you have any questions or need assistance with using the app, please contact our support team:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>Email: Sharmamritunjay4@gmail.com</Text>
            <Text style={styles.contactText}>Phone: +91 821-0430471</Text>
            <Text style={styles.contactText}>Support Hours: Monday to Friday, 9:00 AM to 6:00 PM</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.colors.backgroundColorSecond,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    // borderBottomWidth: activeSection ? 1 : 0,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionContent: {
    padding: 16,
  },
  stepCard: {
    backgroundColor: '#F5F9FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  deleteCard: {
    backgroundColor: '#FFF5F5',
    borderLeftColor: '#FF3B30',
  },
  noteCard: {
    backgroundColor: '#FFFBF0',
    borderLeftColor: '#FFC107',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4285F4',
  },
  deleteStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FF3B30',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFC107',
  },
  stepDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  listContainer: {
    marginVertical: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  supportSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  supportText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});

export default UserInstructionsScreen;