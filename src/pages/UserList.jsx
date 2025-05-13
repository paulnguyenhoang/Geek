import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import styles from "../styles/UserList.module.css";
import usePageTitle from "../hooks/usePageTitle";

function UserList() {
  // Sử dụng custom hook để đặt tiêu đề trang
  usePageTitle("Users");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await axios.get("https://jsonplaceholder.typicode.com/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Avatar",
      key: "avatar",
      render: (_, record) => (
        <Avatar
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            record.name
          )}&background=random`}
          alt={record.name}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <a href={`mailto:${text}`} className={styles.blueLink}>
          {text}
        </a>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <a href={`tel:${text}`} className={styles.blueLink}>
          {text}
        </a>
      ),
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (text) => (
        <a href={`https://${text}`} target="_blank" rel="noreferrer" className={styles.blueLink}>
          {text}
        </a>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className={styles.actionButton} onClick={() => navigate(`/users/${record.id}`)}>
          <EyeOutlined className={styles.eyeIcon} /> Show
        </div>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>User List</h2>
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default UserList;
