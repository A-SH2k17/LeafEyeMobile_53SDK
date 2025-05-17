import { StyleSheet,Platform} from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FFF7',
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
  },
  header: {
    backgroundColor: '#3D7054',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    color: '#E8F5E9',
    marginTop: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    padding: (4),
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  quickActionsScrollContent: {
    paddingBottom: 8,
  },
  quickActionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 120,
    height: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionText: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
  recentPlantsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    flex: 1,
  },
  recentPlantsContent: {
    paddingBottom: 100, // Extra padding to account for tab bar
  },
  plantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  plantIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantInfo: {
    marginLeft: 16,
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  plantStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantStatus: {
    fontSize: 14,
  },
  statusHealthy: {
    color: '#3D7054',
  },
  statusWarning: {
    color: '#FF9800',
  },
  plantWatered: {
    fontSize: 14,
    color: '#757575',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#A6C5A7',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Adjust for bottom insets
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabItemCenter: {
    width: 60,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#3D7054',
    fontWeight: '500',
  },
  identifyButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30, // Adjusted for iOS bottom insets
    alignSelf: 'center',
    backgroundColor: '#3D7054',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  identifyText: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 10, // Adjusted for iOS bottom insets
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#3D7054',
  },


  //login
  scrollContainer: {
    flexGrow: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  logoSignContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    textAlign: 'center',
    color: '#047857',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  screenSubtitle: {
    textAlign: 'center',
    color: '#047857',
    fontSize: 14,
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#047857',
    marginBottom: 4,
    fontSize: 14,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 40,
  },
  primaryButton: {
    backgroundColor: '#047857',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#a7f3d0',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#047857',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  buttonSpacing: {
    marginTop: 12,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    color: '#047857',
    fontWeight: '500',
  },
});