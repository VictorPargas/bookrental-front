"use client";

import ContentLoader from "react-content-loader";

export const SkeletonTable = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={300}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {/* Cabeçalhos */}
      <rect x="10" y="10" rx="4" ry="4" width="95%" height="20" />

      {/* Linhas de Tabela */}
      {Array.from({ length: 5 }).map((_, index) => (
        <rect key={index} x="10" y={40 + index * 40} rx="4" ry="4" width="95%" height="30" />
      ))}
    </ContentLoader>
  );
};
