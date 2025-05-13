import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Card, Typography, Spin, Image } from "antd";
import { EyeOutlined, UpOutlined, PictureOutlined } from "@ant-design/icons";
import { IoArrowBackOutline } from "react-icons/io5";
import styles from "../styles/AlbumDetail.module.css";
import usePageTitle from "../hooks/usePageTitle";

const { Title, Text } = Typography;

function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Đặt tiêu đề động dựa trên ID album
  usePageTitle(`#${id} Show Album`);

  useEffect(() => {
    async function fetchAlbumData() {
      try {
        setLoading(true);
        const albumRes = await axios.get(`https://jsonplaceholder.typicode.com/albums/${id}`);
        const userRes = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${albumRes.data.userId}`
        );
        const photosRes = await axios.get(
          `https://jsonplaceholder.typicode.com/photos?albumId=${id}`
        );

        setAlbum(albumRes.data);
        setUser(userRes.data);
        setPhotos(photosRes.data);
      } catch (err) {
        console.error("Error loading album detail", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumData();
  }, [id]);

  if (loading || !album || !user)
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Loading album..." />
        </div>
      </div>
    );

  // Tính toán số hàng cần thiết cho 10 ảnh
  const itemsPerRow = 5; // Giả sử có 5 ảnh mỗi hàng
  const initialRows = Math.ceil(Math.min(10, photos.length) / itemsPerRow);
  // Giảm chiều cao xuống để loại bỏ khoảng trống dư thừa
  const photoHeight = 200; // Chiều cao của mỗi ảnh + title + padding
  const initialHeight = initialRows * photoHeight;

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb navigation */}
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbItem} onClick={() => navigate("/albums")}>
          <PictureOutlined className={styles.breadcrumbIcon} /> Albums
        </span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Show</span>
      </div>

      {/* Back button */}
      <div className={styles.backButtonContainer}>
        <div className={styles.arrowContainer} onClick={() => navigate(-1)}>
          <IoArrowBackOutline className={styles.backArrow} />
        </div>
        <span className={styles.backText}>Show Album</span>
      </div>

      {/* Main content wrapper */}
      <div className={styles.contentWrapper}>
        {/* User and album info */}
        <Card className={styles.userCard}>
          <div className={styles.userInfo}>
            <Avatar
              size={64}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=random`}
              alt={`Avatar of ${user.name}`}
              className={styles.userAvatar}
              onClick={() => navigate(`/users/${user.id}`)}
            />
            <div className={styles.userDetails}>
              <Title
                level={4}
                className={styles.userName}
                onClick={() => navigate(`/users/${user.id}`)}
              >
                {user.name}
              </Title>
              <Text type="secondary" className={styles.userEmail}>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </Text>
            </div>
          </div>

          <div className={styles.albumTitle}>
            <Title level={5}>{album.title}</Title>
          </div>
        </Card>

        {/* Photos section */}
        <div className={styles.photosSection}>
          <Title level={5}>Photos</Title>

          {/* Sử dụng chiều cao chính xác hơn */}
          <div
            className={`${styles.photosGrid} ${showAll ? styles.expandedGrid : ""}`}
            style={{
              maxHeight: showAll ? "none" : `${initialHeight}px`,
              overflow: showAll ? "auto" : "hidden",
            }}
          >
            <Image.PreviewGroup>
              {(showAll ? photos : photos.slice(0, 10)).map((photo) => (
                <div key={photo.id} className={styles.photoItem}>
                  <div className={styles.photoWrapper}>
                    <Image
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      className={styles.photoImg}
                      preview={{
                        src: photo.url,
                        mask: (
                          <div className={styles.previewMask}>
                            <span className={styles.previewContent}>
                              <EyeOutlined className={styles.previewIcon} />
                              <span className={styles.previewText}>Preview</span>
                            </span>
                          </div>
                        ),
                        title: photo.title,
                      }}
                    />
                    <div className={styles.photoTitle}>{photo.title}</div>
                  </div>
                </div>
              ))}
            </Image.PreviewGroup>
          </div>

          {/* Nút View More sẽ hiển thị dưới cùng, không thêm padding/margin dư thừa */}
          {photos.length > 10 && (
            <div className={styles.viewMoreContainer}>
              {!showAll ? (
                <button className={styles.viewMoreButton} onClick={() => setShowAll(true)}>
                  View all photos ({photos.length})
                </button>
              ) : (
                <button
                  className={styles.viewMoreButton}
                  onClick={() => {
                    setShowAll(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <UpOutlined /> Show less
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlbumDetail;
