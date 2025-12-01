// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { InAppUpdates, IAUUpdateKind } from 'react-native-in-app-updates';

// const ForceUpdateScreen = ({ onDone }: any) => {

//   useEffect(() => {
//     const updater = new InAppUpdates(false);

//     updater.checkNeedsUpdate().then((result: any) => {
//       if (result.shouldUpdate) {
//         // FORCE UPDATE
//         updater.startUpdate({
//           updateType: IAUUpdateKind.IMMEDIATE,
//         });
//       } else {
//         // NO UPDATE → NORMAL APP START
//         onDone();
//       }
//     });
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{fontSize:16}}>Checking for updates...</Text>
//     </View>
//   );
// };

// export default ForceUpdateScreen;
