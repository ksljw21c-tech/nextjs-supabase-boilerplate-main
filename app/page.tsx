/**
 * @file app/page.tsx
 * @description 홈페이지 - 히어로 섹션과 상품 목록
 *
 * 생동감 있는 히어로 섹션과 함께 상품 목록을 Grid 레이아웃으로 표시합니다.
 * 카테고리 필터링과 페이지네이션을 지원합니다.
 */

import { Suspense } from "react";
import ProductsSection from "@/components/products-section";
import { LoadingPage } from "@/components/loading";
import { Sparkles, TrendingUp, Truck, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

// 히어로 섹션 컴포넌트
function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl mb-12">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-chart-2/80 to-chart-5/90" />
      
      {/* 장식 요소 */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      {/* 콘텐츠 */}
      <div className="relative z-10 px-6 py-16 md:px-12 md:py-24 lg:py-32 text-white">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm md:text-base font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              🎉 지금 가입하면 10% 할인!
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight">
            트렌디한 스타일,
            <br />
            <span className="text-white/90">특별한 가격으로</span>
          </h1>
          
          <p className="text-base md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
            매일 새로운 상품이 업데이트됩니다. 
            지금 바로 당신만의 스타일을 찾아보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="#products"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              쇼핑 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/my-orders"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              주문 내역 확인
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// 특징 배지 컴포넌트
function FeatureBadges() {
  const features = [
    { icon: Truck, text: "무료 배송", subtext: "5만원 이상" },
    { icon: Shield, text: "안전 결제", subtext: "토스페이먼츠" },
    { icon: TrendingUp, text: "베스트 상품", subtext: "인기 아이템" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-12">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="glass-card rounded-2xl p-4 md:p-6 text-center hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
        >
          <feature.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary" />
          <p className="font-bold text-sm md:text-base">{feature.text}</p>
          <p className="text-xs md:text-sm text-muted-foreground">{feature.subtext}</p>
        </div>
      ))}
    </div>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || "1", 10);

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-6 md:px-8 md:py-10">
      <div className="w-full max-w-7xl mx-auto">
        {/* 히어로 섹션 */}
        <HeroSection />

        {/* 특징 배지 */}
        <FeatureBadges />

        {/* 상품 섹션 */}
        <section id="products" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-2">
                <span className="text-gradient">전체 상품</span>
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-chart-5" />
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                최신 트렌드를 반영한 상품들을 만나보세요
              </p>
            </div>
          </div>

          <Suspense fallback={<LoadingPage message="상품을 불러오는 중..." />}>
            <ProductsSection category={category} page={page} />
          </Suspense>
        </section>

        {/* 개발 모드 디버그 정보 */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-12 p-4 glass-card rounded-xl">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              🛠️ 디버그 정보
            </h3>
            <p className="text-xs text-muted-foreground">
              카테고리: {category || "없음"}, 페이지: {page}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              이 메시지는 개발 환경에서만 표시됩니다.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
