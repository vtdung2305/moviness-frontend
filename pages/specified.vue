<script lang="ts" setup>
// composable
const { t } = useLang()

// meta
definePageMeta({
  layout: 'seo-page',
})
</script>

<template>
  <div class="specified">
    <h2>特定商取引法に基づく表記</h2>
    <h3>アプリ名</h3>
    <p>moviness</p>
    <h3>販売事業者名</h3>
    <p>株式会社 信成堂</p>
    <h3>販売事業者住所</h3>
    <p>〒 989-0851 宮城県刈田郡蔵王町曲竹神西４−４</p>
    <h3>代表者名</h3>
    <p>我妻 成</p>
    <h3>ホームページ</h3>
    <p>
      <a
        href="https://shinseido.jp"
        target="_blank"
        class="site"
      >
        https://shinseido.jp
      </a>
    </p>
    <h3>電子メール</h3>
    <p>
      <a href="mailto:xxxx@example.mail.com" class="email">
        xxxx@example.mail.com
      </a>
    </p>
    <h3>電話番号</h3>
    <p>
      <a href="tel:0224-26-9441" class="tel">
        0224-26-9441
      </a>
    </p>
    <h3>販売価格</h3>
    <p>
      プラン内容に応じて販売価格（消費税含む）を設定し、該当ページで表示します。
    </p>
    <h3>商品等の引き渡し時期（日数）・発送方法</h3>
    <p>オンラインにおけるサービス利用</p>
    <h3>代金の支払時期および方法</h3>
    <p>
      サービスごとに支払時期および方法を指定し、該当ページで表示します。
    </p>
    <h3>商品代金以外に必要な費用 ／送料、消費税等</h3>
    <p>なし（料金は税込）</p>
    <h3>
      返品の取扱条件／返品期限、返品時の送料負担または解約や退会条件
    </h3>
    <p>
      解約は当社指定の手続きにより可能。ただし、商品の性質上既に支払われた分に対する返金は不可。
    </p>
    <h3>不良品の取扱条件</h3>
    <p>現状有姿による利用となります</p>
  </div>
</template>

<style lang="scss" scoped>
.specified {
  max-width: 994px;
  width: 90%;
  margin: 0 auto;
  padding: 200px 0 160px;

  @media screen and (max-width: 1180px) {
    padding: 83px 0 96px;
  }

  h2 {
    margin-bottom: 48px;
    font-size: 32px;
    font-weight: 700;

    @media screen and (max-width: 1180px) {
      font-size: 26px;
    }
  }

  h3 {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 700;

    @media screen and (max-width: 1180px) {
      font-size: 22px;
    }

    & + p {
      margin-bottom: 32px;
      font-size: 22px;

      @media screen and (max-width: 1180px) {
        font-size: 20px;
      }

      .site {
        text-decoration: underline;
        transition: 0.3s;

        &:hover {
          opacity: 0.6;
          transition: 0.3s;
        }
      }

      .email {
        transition: 0.3s;

        &:hover {
          opacity: 0.6;
          transition: 0.3s;
        }
      }

      .tel {
        pointer-events: none;

        @media screen and (max-width: 1180px) {
          pointer-events: auto;
        }
      }
    }

    &:last-of-type {
      & + p {
        margin-bottom: 0;
      }
    }
  }
}
</style>
