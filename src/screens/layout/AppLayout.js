import React from "react";
import { View, Text, ScrollView, StatusBar, StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import UserMenu from "../../components/UserMenu";

function AppLayout(props) {
  return (
    <View style={[styles.container, props.style]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.appBar.backgroundColor}
      />
      <View style={styles.appBar}>
        <View style={styles.leftContainer}></View>
        <View style={styles.rightContainer}>
          <UserMenu />
        </View>
      </View>

      <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.title}>DashboardScreen</Text>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Title title="Sales" subtitle="$10,000" />
            <Card.Content>
              <Text>This Month's Sales</Text>
            </Card.Content>
            <Card.Actions>
              <Button>View Details</Button>
            </Card.Actions>
          </Card>
          <Card style={styles.card}>
            <Card.Title title="Users" subtitle="1,200" />
            <Card.Content>
              <Text>Total Active Users</Text>
            </Card.Content>
            <Card.Actions>
              <Button>View Details</Button>
            </Card.Actions>
          </Card>
          <Card style={styles.card}>
            <Card.Title title="Orders" subtitle="350" />
            <Card.Content>
              <Text>Total Orders This Month</Text>
            </Card.Content>
            <Card.Actions>
              <Button>View Details</Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  appBar: {
    height: 64,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  scrollViewContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 20,
  },
});

export default React.memo(AppLayout);
