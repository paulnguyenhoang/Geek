import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Typography, Avatar, Table, Spin } from "antd";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { IoArrowBackOutline } from "react-icons/io5";
import styles from "../styles/UserDetail.module.css";
import usePageTitle from "../hooks/usePageTitle";

const { Title, Text } = Typography;

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Đặt tiêu đề động dựa trên ID user
  usePageTitle(`#${id} Show User`);

  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const userRes = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        const albumsRes = await axios.get(
          `https://jsonplaceholder.typicode.com/albums?userId=${id}`
        );
        setUser(userRes.data);
        setAlbums(albumsRes.data);
      } catch (err) {
        console.error("Error fetching user detail", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading || !user) return <Spin className={styles.loadingContainer} />;

  // Cấu hình các cột cho bảng albums
  const albumColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120, // Cột ID chiếm 80px cố định
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      // Không đặt width cho Title để nó tự động mở rộng lấp đầy không gian còn lại
      render: (text) => <span className={styles.albumTitle}>{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 250, // Cột Actions chiếm 150px cố định
      align: "left",
      render: (_, record) => (
        <div className={styles.actionButton} onClick={() => navigate(`/albums/${record.id}`)}>
          <EyeOutlined className={styles.eyeIcon} /> Show
        </div>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb navigation */}
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbItem} onClick={() => navigate("/users")}>
          <UserOutlined className={styles.breadcrumbIcon} /> Users
        </span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Show</span>
      </div>

      {/* Back button - chỉ có mũi tên là clickable */}
      <div className={styles.backButtonContainer}>
        <div className={styles.arrowContainer} onClick={() => navigate(-1)}>
          <IoArrowBackOutline className={styles.backArrow} />
        </div>
        <span className={styles.backText}>Show User</span>
      </div>

      {/* User Card */}
      <div className={styles.contentWrapper}>
        <Card className={styles.userCard}>
          <div className={styles.userInfo}>
            <Avatar
              size={64}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=random`}
              alt={user.name}
              className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
              <Title level={4} className={styles.userName}>
                {user.name}
              </Title>
              <Text className={styles.userEmail}>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </Text>
            </div>
          </div>
        </Card>

        {/* Albums Section */}
        <div className={styles.albumsSection}>
          <Title level={5}>Albums</Title>
          <Table
            className={styles.albumTable}
            columns={albumColumns}
            dataSource={albums}
            rowKey="id"
            pagination={false}
            tableLayout="fixed"
          />
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
