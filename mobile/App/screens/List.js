import React from 'react';

import {List, ListItem} from '../components/List';

const DATA = [
  {
      "_id": "5d14d8360ac4c1fab0fe8999",
      "name": "Restaurant 1",
      "hours": "8am - 8pm",
      "address": "123 Fake Street",
      "__v": 0
  },
  {
      "_id": "5d14d8360ac4c1fab0fe899a",
      "name": "Restaurant 2",
      "hours": "1pm - 11pm",
      "address": "000 Hmm Drive",
      "__v": 0
  },
  {
      "_id": "5d14d8360ac4c1fab0fe899b",
      "name": "Restaurant 3",
      "hours": "7am - 7pm",
      "address": "111 Real Street",
      "__v": 0
  }
]

export default ({ navigation }) => (
  <List
    data={DATA}
    renderItem={({ item, index }) => (
      <ListItem
        title={item.name}
        isOdd={index % 2}
        onPress={() => navigation.navigate("RestaurantDetails", { item })}
      />
    )}
  />
);