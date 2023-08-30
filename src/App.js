import uniqid from "uniqid";

import { useState } from "react";

const initialFriends = [
  {
    id: "llv0w93w",
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=llv0w93w",
    balance: -7,
  },
  {
    id: "llv10ot8",
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=llv10ot8",
    balance: 20,
  },
  {
    id: "llv117nf",
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=llv117nf",
    balance: 0,
  },
];

function Button({ onToggle, children }) {
  return (
    <button className="button" onClick={onToggle}>
      {children}
    </button>
  );
}

export default function App() {
  // Form Add New Friend
  const [formAddFriend, setFormAddFriend] = useState(false);
  const handleToggleAddFriend = () => {
    setFormAddFriend(!formAddFriend);

    // Close Split Bill Container
    setFriendSelected(null);
    setSelected(null);
  };

  // Friends list & Handle add new friend
  const [friends, setFriends] = useState(initialFriends);
  const handleAddNewFriend = (fr) => {
    setFriends([...friends, fr]);
    setFormAddFriend(false);

    // Auto-open split bill container with the newly added friend
    setFriendSelected(fr.id);
    setSelected(fr);
  };

  const [friendSelected, setFriendSelected] = useState(null);
  const [selected, setSelected] = useState(null);
  const handleSelectFriend = (id) => {
    const [selected] = friends.filter((fr) => fr.id === id);
    setFriendSelected(id);
    setSelected(selected);

    // Closing addNewFriend Form
    setFormAddFriend(false);
  };

  const handleSplitBill = (bal) => {
    setFriends((friends) =>
      friends.map((fr) =>
        fr.id === friendSelected ? { ...fr, balance: fr.balance + bal } : fr
      )
    );

    // Clearing Selection of Friend
    setFriendSelected(null);
    setSelected(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={friendSelected}
        />
        {formAddFriend && <FormAddFriend onAddNewFriend={handleAddNewFriend} />}
        <Button onToggle={handleToggleAddFriend}>
          {formAddFriend ? "Close" : "Add new friend"}
        </Button>
      </div>
      {friendSelected && (
        <SplitBill friend={selected} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((fr) => (
        <Friend
          friend={fr}
          key={fr.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const selected = friend.id === selectedFriend;

  return (
    <li className={selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <button
        className="button"
        onClick={() =>
          onSelectFriend(friend.id === selectedFriend ? null : friend.id)
        }
      >
        {selected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddNewFriend }) {
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const [name, setName] = useState("");

  // Add New Friend to List
  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!name || !image) return;

    const newFriend = {
      id: uniqid(),
      name,
      image: `${image}?u=${uniqid()}`,
      balance: 0,
    };

    // call App func with the new friend obj
    onAddNewFriend(newFriend);
  };

  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>👭Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📷Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState(0);
  const [expense, setExpense] = useState(0);
  const [payingUser, setPayingUser] = useState("user");

  const handleSplitBill = (e) => {
    e.preventDefault();

    if (payingUser === "user") onSplitBill(bill - expense);
    if (payingUser === "friend") onSplitBill(-expense);
  };

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSplitBill(e)}>
      <h2>Split a bill with {friend.name}</h2>

      <label>💰 Total Bill value:</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>💶 Your Expense:</label>
      <input
        type="number"
        value={expense}
        onChange={(e) =>
          setExpense(
            Number(e.target.value) > bill ? expense : Number(e.target.value)
          )
        }
      />

      <label>💸 {friend.name}'s Expense:</label>
      <input type="number" disabled value={bill - expense} />

      <label>💳 Who's paying the bill?</label>
      <select
        value={payingUser}
        onChange={(e) => setPayingUser(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
