import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import backend_url from "../api_url";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backend_url}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteModal = (id) => setDeletingUserId(id);
  const closeDeleteModal = () => setDeletingUserId(null);
  const handleEdit = (user) => setEditingUser(user);
  const closeEditModal = () => setEditingUser(null);

  return (
    <div className="container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2>User List</h2>
        <div className="d-flex mt-2 mt-md-0">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by Username or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading...</p>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-striped align-middle text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td className="text-break">{user.username}</td>
                    <td className="text-break">{user.email}</td>
                    <td className="text-break">{user.role}</td>
                    <td>
                      <div className="d-flex justify-content-center flex-wrap gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleEdit(user)}
                          title="Edit User"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => openDeleteModal(user._id)}
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <EditUser
          user={editingUser}
          refreshUsers={fetchUsers}
          closeModal={closeEditModal}
        />
      )}

      {deletingUserId && (
        <DeleteUser
          userId={deletingUserId}
          onClose={closeDeleteModal}
          refreshUsers={fetchUsers}
        />
      )}
    </div>
  );
}
