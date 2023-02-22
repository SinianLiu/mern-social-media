import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
    // req successful
  } catch (err) {
    res.status(404).json({ message: err.message });
    // 404 Not Found
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    // req.params,req.query是用在get请求当中，而req.body是用在post请求中
    const user = await User.findById(id);

    const friends = await Promise.all(
    //Promise.all  不止一个步骤 
      user.friends.map((id) => User.findById(id))
    // 用ID 找到每一个“朋友”的账号
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    //  如果用户列表里包含这个id
    // 双方的好友列表里都删掉对方 用filter（ ），里面的东西保留
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}; 