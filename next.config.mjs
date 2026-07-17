/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // RSS 기사 썸네일은 매우 다양한 도메인에서 오므로 next/image 최적화 대신
    // 컴포넌트에서 일반 <img> 태그를 사용합니다. (도메인 화이트리스트 관리 불필요)
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
