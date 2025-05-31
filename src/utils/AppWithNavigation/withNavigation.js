import { useNavigation, useRoute } from '@react-navigation/native';

function withNavigation(Child) {
  return (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    return <Child {...props} navigation={navigation} route={route} />;
  };
}

export default withNavigation;
