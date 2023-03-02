export const getSender = (loggedUser, users) => {
  console.log('users Data in getSender: ', users);
  console.log('loggedUser in getSender: ', loggedUser);
  //   console.log(users[0]._id === loggedUser._id);
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  
};

export const getSenderFull = (loggedUser, users) => {
  // console.log("users Data in getSender: ", users);
  // console.log(users[0]._id === loggedUser.id);
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

//it basically check that if(last message index === messages last index and
// if userId not equal to last messages sender _id  and
// if last messages sender _id exists )
export const isSameMessage = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

//it basically check that if(last message index === messages last index and
// if userId not equal to last messages sender _id  and
// if last messages sender _id exists )
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  ) {
    return 0;
  } else {
    return 'auto';
  }
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
