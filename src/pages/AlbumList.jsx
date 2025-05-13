import { useEffect, useState } from "react";
import { Table, Avatar, Button, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/AlbumList.module.css";
import usePageTitle from "../hooks/usePageTitle";

function AlbumList() {
  // Sử dụng custom hook để đặt tiêu đề trang
  usePageTitle("Albums");

  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract values from URL with proper fallbacks
  // Sử dụng 'current' thay vì 'page' và mặc định pageSize là 20
  const currentPage = parseInt(searchParams.get("current") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  // Thiết lập query parameters mặc định nếu URL không có
  useEffect(() => {
    if (!searchParams.has("pageSize") || !searchParams.has("current")) {
      setSearchParams({
        pageSize: "20",
        current: "1",
      });
    }
  }, [searchParams, setSearchParams]);

  // Fetch all data on initial load
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [albumRes, userRes] = await Promise.all([
          axios.get("https://jsonplaceholder.typicode.com/albums"),
          axios.get("https://jsonplaceholder.typicode.com/users"),
        ]);
        setAlbums(albumRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Show loading state when pagination parameters change
  useEffect(() => {
    if (albums.length > 0) {
      // Only show loading for pagination changes, not initial load
      setPaginationLoading(true);

      // Simulate API delay for better UX feedback (remove in production)
      const timer = setTimeout(() => {
        setPaginationLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentPage, pageSize]);

  const getUserInfo = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user
      ? {
          name: user.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&background=random`,
          id: user.id,
        }
      : {};
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "User",
      key: "user",
      render: (_, record) => {
        const user = getUserInfo(record.userId);
        return user.name ? (
          <div className={styles.userContainer}>
            <div className={styles.userInteractive}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                className={styles.userAvatar}
                onClick={() => navigate(`/users/${user.id}`)}
              />
              <span className={styles.userName} onClick={() => navigate(`/users/${user.id}`)}>
                {user.name}
              </span>
            </div>
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/albums/${record.id}`)}
          className={styles.viewButton}
        >
          Show
        </Button>
      ),
    },
  ];

  // Calculate paginated data based on the current page and page size
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAlbums = albums.slice(startIndex, endIndex);

  // Pagination change handler - cập nhật lại để sử dụng 'current' thay vì 'page'
  const handlePaginationChange = (page, size) => {
    // Show loading state
    setPaginationLoading(true);

    // Update URL parameters
    setSearchParams({
      pageSize: size.toString(),
      current: page.toString(),
    });

    // Force re-render to ensure the UI updates
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 0);
  };

  // If initial data is loading, show a full-page loading spinner
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Album List</h2>
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={paginatedAlbums}
          rowKey="id"
          loading={paginationLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: albums.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: handlePaginationChange,
            onShowSizeChange: handlePaginationChange,
          }}
        />
      </div>
    </div>
  );
}

export default AlbumList;
