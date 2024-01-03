// import { push, ref } from "firebase/database";
// import { useState, FormEvent } from "react";
// import { database } from "../../firebase";
// import "./dataTable.scss";
// import { useNavigate } from "react-router-dom";

// interface DataTableProps {
//   addUser: boolean;
// }

// const AddUser: React.FC<DataTableProps> = ({ addUser }) => {
//   const [newUser, setNewUser] = useState({
//     NAME: "",
//     PHONE: "",
//     AMOUNT: 0, // Set default value or handle it as per your requirement
//   });

//   const [value, setValue] = useState(addUser);

//   const naviagte = useNavigate();

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewUser((prevUser) => ({
//       ...prevUser,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Reference to the 'USERS' node in the database
//     const usersRef = ref(database, "USERS");

//     // Push a new user to the 'USERS' node
//     push(usersRef, newUser)
//       .then(() => {
//         console.log("User added successfully");
//         // Optionally, reset the form or perform other actions
//         setNewUser({
//           NAME: "",
//           PHONE: "",
//           AMOUNT: 0,
//         });
//         setValue(!value);
//         addUser = value;
//         console.log(addUser);
//         naviagte("/users");
//       })
//       .catch((error) => {
//         console.error("Error adding user", error);
//       });
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Name:
//           <input
//             type="text"
//             name="NAME"
//             value={newUser.NAME}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Phone:
//           <input
//             type="text"
//             name="PHONE"
//             value={newUser.PHONE}
//             onChange={handleInputChange}
//           />
//         </label>
//         {/* Add other fields as needed */}
//         <button type="submit">Add User</button>
//       </form>
//     </div>
//   );
// };

// export default AddUser;
