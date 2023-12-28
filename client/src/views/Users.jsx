import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
        getUsers();
    }, []);

    const onDelete = (u) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        axiosClient.delete(`/users/${u.id}`).then(() => {
            setNotification("User was successfully deleted");
            getUsers();
        });
    };

    const getUsers = (link = "/users") => {
        setLoading(true);
        axiosClient
            .get(link)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
                setInfo(data.links);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleNextPage = () => {
        getUsers(info.next);
        window.scrollTo(0, 0);
    };

    const handlePreviousPage = () => {
        getUsers(info.prev);
        window.scrollTo(0, 0);
    };
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link
                                            className="btn-edit"
                                            to={`/users/${u.id}`}
                                        >
                                            Edit
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={() => onDelete(u)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
                <nav style={{ width: "100%", margin: "0 auto" }}>
                    <ul
                        style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            listStyle: "none",
                            justifyContent: "center",
                            gap: "20px",
                        }}
                    >
                        {info.prev ? (
                            <li className="page-item">
                                <button
                                    className="btn-add"
                                    onClick={handlePreviousPage}
                                >
                                    Previous
                                </button>
                            </li>
                        ) : null}
                        {info.next ? (
                            <li className="page-item">
                                <button
                                    className="btn-add"
                                    onClick={handleNextPage}
                                >
                                    Next
                                </button>
                            </li>
                        ) : null}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
